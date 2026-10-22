import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { after, before, beforeEach } from 'node:test';
import { openDisposablePool } from '../src/db.js';
import { advanceOrder } from '../src/operations.js';
import { startLocalSimulation } from '../src/http.js';
import {
  RequestKeyCollision,
  deliverOneOutbox,
  submitOrder,
  type CartLine,
  type FaultStage,
} from '../src/orders.js';

const pool = openDisposablePool();
const cart = (): CartLine[] => [
  { sku: 'PIZZA_01', qty: 2 },
  { sku: 'DRINK_01', qty: 1 },
];

async function count(table: 'orders' | 'order_line' | 'order_status_event' | 'outbox_event') {
  const result = await pool.query<{ n: string }>(
    'SELECT count(*)::text AS n FROM spike_ts.' + table,
  );
  return Number(result.rows[0]?.n ?? -1);
}

before(async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const sql = await readFile(join(root, 'schema.sql'), 'utf8');
  // Runs only after openDisposablePool validated all localhost test DB guards.
  await pool.query('DROP SCHEMA IF EXISTS spike_ts CASCADE');
  await pool.query(sql);
});

beforeEach(async () => {
  await pool.query(
    'TRUNCATE spike_ts.payment_attempt, spike_ts.outbox_event, spike_ts.order_status_event, spike_ts.order_line, spike_ts.orders, spike_ts.catalog_item RESTART IDENTITY CASCADE',
  );
  await pool.query(
    "INSERT INTO spike_ts.catalog_item(sku,name,unit_price_cents,available) VALUES ('PIZZA_01','Synthetic pizza',14500,true),('DRINK_01','Synthetic drink',2500,true)",
  );
});

after(async () => {
  try {
    await pool.query('DROP SCHEMA IF EXISTS spike_ts CASCADE');
  } finally {
    await pool.end();
  }
});

test('database pricing authority and immutable order snapshots', async () => {
  const order = await submitOrder(pool, 'order-price-0001', cart());
  assert.equal(Number(order.subtotal_cents), 31500);
  const result = await pool.query<{ sku_snapshot: string; line_total_cents: string }>(
    'SELECT sku_snapshot, line_total_cents FROM spike_ts.order_line ORDER BY sku_snapshot',
  );
  assert.deepEqual(result.rows.map(r => Number(r.line_total_cents)), [2500, 29000]);
  assert.equal(await count('order_status_event'), 1);
  assert.equal(await count('outbox_event'), 1);
  await pool.query("UPDATE spike_ts.catalog_item SET unit_price_cents = 99900 WHERE sku = 'PIZZA_01'");
  const snapshot = await pool.query<{ unit_price_cents: number }>(
    "SELECT unit_price_cents FROM spike_ts.order_line WHERE sku_snapshot = 'PIZZA_01'",
  );
  assert.equal(snapshot.rows[0]?.unit_price_cents, 14500);
});

test('same-key retries and reordered cart return one order/outbox event', async () => {
  const first = await submitOrder(pool, 'order-repeat-001', cart());
  const second = await submitOrder(pool, 'order-repeat-001', [...cart()].reverse());
  assert.equal(first.id, second.id);
  assert.equal(await count('orders'), 1);
  assert.equal(await count('outbox_event'), 1);
});

test('same key with different cart returns explicit collision', async () => {
  await submitOrder(pool, 'order-collision1', cart());
  await assert.rejects(
    submitOrder(pool, 'order-collision1', [{ sku: 'PIZZA_01', qty: 3 }]),
    RequestKeyCollision,
  );
  assert.equal(await count('orders'), 1);
});

test('injected failures after each write stage roll back every related row', async () => {
  const faults: FaultStage[] = [
    'after_header', 'after_lines', 'after_history', 'after_outbox',
  ];
  for (let i = 0; i < faults.length; i++) {
    await assert.rejects(
      submitOrder(pool, 'order-fault-' + String(i).padStart(4, '0'), cart(), faults[i]),
      /Injected fault/,
    );
    assert.equal(await count('orders'), 0);
    assert.equal(await count('order_line'), 0);
    assert.equal(await count('order_status_event'), 0);
    assert.equal(await count('outbox_event'), 0);
  }
});

test('simultaneous duplicate checkout converges to one committed order', async () => {
  const [first, second] = await Promise.all([
    submitOrder(pool, 'order-concurrent1', cart()),
    submitOrder(pool, 'order-concurrent1', cart()),
  ]);
  assert.equal(first.id, second.id);
  assert.equal(await count('orders'), 1);
  assert.equal(await count('outbox_event'), 1);
});

test('outbox recovers a pending event after a simulated transport failure', async () => {
  await submitOrder(pool, 'order-outbox-0001', cart());
  await assert.rejects(
    deliverOneOutbox(pool, async () => { throw new Error('Store network disconnected'); }),
    /Store network disconnected/,
  );
  let r = await pool.query('SELECT delivered_at FROM spike_ts.outbox_event');
  assert.equal(r.rows[0]?.delivered_at, null);
  const delivered: string[] = [];
  const didSend = await deliverOneOutbox(pool, async id => { delivered.push(id); });
  assert.equal(didSend, true);
  assert.equal(delivered.length, 1);
  r = await pool.query('SELECT delivered_at FROM spike_ts.outbox_event');
  assert.notEqual(r.rows[0]?.delivered_at, null);
  assert.equal(await deliverOneOutbox(pool, async () => assert.fail('Unexpected resend')), false);
});

test('payment failure does not silently change restaurant order state', async () => {
  const order = await submitOrder(pool, 'order-payment-001', cart());
  await pool.query(
    "INSERT INTO spike_ts.payment_attempt(order_id,amount_cents,status) VALUES ($1,$2,'initiated')",
    [order.id, Number(order.subtotal_cents)],
  );
  await pool.query("UPDATE spike_ts.payment_attempt SET status='failed' WHERE order_id=$1", [order.id]);
  const result = await pool.query<{ order_status: string; payment_status: string }>(
    'SELECT o.status AS order_status, p.status AS payment_status FROM spike_ts.orders o JOIN spike_ts.payment_attempt p ON p.order_id=o.id WHERE o.id=$1',
    [order.id],
  );
  assert.deepEqual(result.rows[0], { order_status: 'received', payment_status: 'failed' });
});

test('failed transaction leaves the same idempotency key free for a valid retry', async () => {
  await assert.rejects(
    submitOrder(pool, 'order-retry-fail', cart(), 'after_history'),
    /Injected fault/,
  );
  const created = await submitOrder(pool, 'order-retry-fail', cart());
  assert.equal(created.status, 'received');
  assert.equal(await count('orders'), 1);
  assert.equal(await count('outbox_event'), 1);
});


test('local HTTP: submitted -> accepted -> preparing -> ready -> delivered', async () => {
  const server = await startLocalSimulation(pool);
  const action = (path: string, body: unknown, role?: 'cashier' | 'kitchen', token = server.fixtureToken) =>
    fetch(server.baseUrl + path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(role ? { 'x-spike-role': role, 'x-spike-test-token': token } : {}),
      },
      body: JSON.stringify(body),
    });
  try {
    const created = await action('/api/orders', { requestKey: 'flow-happy-0001', items: cart() });
    assert.equal(created.status, 200);
    const received = await created.json() as { id: string; status: string; subtotal_cents: string };
    assert.equal(received.status, 'received');
    assert.equal(Number(received.subtotal_cents), 31500);

    const initial = await fetch(server.baseUrl + '/api/orders/' + received.id + '/tracking');
    assert.equal((await initial.json() as { status: string }).status, 'received');

    const transitions: Array<{ path: string; role: 'cashier' | 'kitchen'; action: string; state: string }> = [
      { path: '/api/staff/orders/', role: 'cashier', action: 'accept', state: 'accepted' },
      { path: '/api/kitchen/orders/', role: 'kitchen', action: 'start', state: 'preparing' },
      { path: '/api/kitchen/orders/', role: 'kitchen', action: 'ready', state: 'ready' },
      { path: '/api/staff/orders/', role: 'cashier', action: 'deliver', state: 'delivered' },
    ];
    for (const step of transitions) {
      const suffix = step.action === 'accept' ? '/decision'
        : step.action === 'deliver' ? '/handoff' : '/progress';
      const response = await action(step.path + received.id + suffix, { action: step.action }, step.role);
      assert.equal(response.status, 200, step.action + ': ' + await response.text());
      const tracked = await fetch(server.baseUrl + '/api/orders/' + received.id + '/tracking');
      assert.equal((await tracked.json() as { status: string }).status, step.state);
    }

    assert.equal(await count('orders'), 1);
    assert.equal(await count('order_status_event'), 5);
    assert.equal(await count('outbox_event'), 5);
    const events = await pool.query<{ status: string; actor_role: string; action: string }>(
      'SELECT status, actor_role, action FROM spike_ts.order_status_event ORDER BY id',
    );
    assert.deepEqual(events.rows.map(x => x.status), [
      'received', 'accepted', 'preparing', 'ready', 'delivered',
    ]);
    assert.deepEqual(events.rows.map(x => x.actor_role), [
      'system', 'cashier', 'kitchen', 'kitchen', 'cashier',
    ]);
  } finally {
    await server.close();
  }
});

test('local HTTP: cashier rejects and kitchen cannot process the order', async () => {
  const server = await startLocalSimulation(pool);
  const request = (path: string, body: unknown, role?: 'cashier' | 'kitchen') =>
    fetch(server.baseUrl + path, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(role ? { 'x-spike-role': role, 'x-spike-test-token': server.fixtureToken } : {}),
      },
      body: JSON.stringify(body),
    });
  try {
    const placed = await request('/api/orders', {
      requestKey: 'flow-rejected-0001', items: cart(),
    });
    const { id } = await placed.json() as { id: string };
    const reject = await request('/api/staff/orders/' + id + '/decision', { action: 'reject' }, 'cashier');
    assert.equal(reject.status, 200);
    const start = await request('/api/kitchen/orders/' + id + '/progress', { action: 'start' }, 'kitchen');
    assert.equal(start.status, 409);
    const track = await fetch(server.baseUrl + '/api/orders/' + id + '/tracking');
    assert.equal((await track.json() as { status: string }).status, 'rejected');
    assert.equal(await count('order_status_event'), 2);
    assert.equal(await count('outbox_event'), 2);
  } finally {
    await server.close();
  }
});

test('local HTTP: missing fixture token, wrong role and premature kitchen action are rejected', async () => {
  const server = await startLocalSimulation(pool);
  try {
    const placed = await fetch(server.baseUrl + '/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ requestKey: 'flow-unauth-0001', items: cart() }),
    });
    const { id } = await placed.json() as { id: string };
    const url = server.baseUrl + '/api/staff/orders/' + id + '/decision';
    const without = await fetch(url, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'accept' }),
    });
    assert.equal(without.status, 403);
    const unauthorized = await fetch(url, {
      method: 'POST', headers: {
        'content-type': 'application/json',
        'x-spike-test-token': server.fixtureToken,
        'x-spike-role': 'kitchen',
      },
      body: JSON.stringify({ action: 'accept' }),
    });
    assert.equal(unauthorized.status, 403);
    const premature = await fetch(server.baseUrl + '/api/kitchen/orders/' + id + '/progress', {
      method: 'POST', headers: {
        'content-type': 'application/json',
        'x-spike-test-token': server.fixtureToken,
        'x-spike-role': 'kitchen',
      },
      body: JSON.stringify({ action: 'start' }),
    });
    assert.equal(premature.status, 409);
    assert.equal(await count('order_status_event'), 1);
  } finally {
    await server.close();
  }
});

test('operator update + audit + outbox are one atomic transaction on failure', async () => {
  const placed = await submitOrder(pool, 'flow-rollback-001', cart());
  await assert.rejects(
    advanceOrder(pool, placed.id, 'accept', 'cashier', { failAfterUpdate: true }),
    /Injected fault: status write/,
  );
  const current = await pool.query<{ status: string }>(
    'SELECT status FROM spike_ts.orders WHERE id=$1', [placed.id],
  );
  assert.equal(current.rows[0]?.status, 'received');
  assert.equal(await count('order_status_event'), 1);
  assert.equal(await count('outbox_event'), 1);
});

test('two staff decisions cannot both change the same received order', async () => {
  const placed = await submitOrder(pool, 'flow-concurrent1', cart());
  const results = await Promise.allSettled([
    advanceOrder(pool, placed.id, 'accept', 'cashier'),
    advanceOrder(pool, placed.id, 'reject', 'cashier'),
  ]);
  assert.equal(results.filter(x => x.status === 'fulfilled').length, 1);
  assert.equal(results.filter(x => x.status === 'rejected').length, 1);
  assert.equal(await count('order_status_event'), 2);
  assert.equal(await count('outbox_event'), 2);
  const final = await pool.query<{ status: string }>('SELECT status FROM spike_ts.orders WHERE id=$1', [placed.id]);
  assert.ok(['accepted', 'rejected'].includes(final.rows[0]?.status ?? ''));
});

test('store event delivery outage leaves status and outbox durable for a retry', async () => {
  const placed = await submitOrder(pool, 'flow-outage-0001', cart());
  await advanceOrder(pool, placed.id, 'accept', 'cashier');
  await assert.rejects(
    deliverOneOutbox(pool, async () => { throw new Error('Simulated store offline'); }),
    /Simulated store offline/,
  );
  assert.equal(await count('outbox_event'), 2);
  const pendingBefore = await pool.query<{ n: string }>(
    'SELECT count(*)::text AS n FROM spike_ts.outbox_event WHERE delivered_at IS NULL',
  );
  assert.equal(Number(pendingBefore.rows[0]?.n), 2);
  const received: Array<{ id: string; status: string }> = [];
  for (let i = 0; i < 2; i++) {
    assert.equal(await deliverOneOutbox(pool, async (id, payload) => {
      received.push({ id, status: (payload as { status: string }).status });
    }), true);
  }
  assert.equal(await deliverOneOutbox(pool, async () => assert.fail('No remaining events')), false);
  assert.deepEqual(received.map(x => x.status).sort(), ['accepted', 'received']);
  const state = await pool.query<{ status: string }>('SELECT status FROM spike_ts.orders WHERE id=$1', [placed.id]);
  assert.equal(state.rows[0]?.status, 'accepted');
});

test('HTTP rejects malformed JSON and does not expose private staff routes without fixture credentials', async () => {
  const server = await startLocalSimulation(pool);
  try {
    const malformed = await fetch(server.baseUrl + '/api/orders', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{bad',
    });
    assert.equal(malformed.status, 400);
    assert.equal(await count('orders'), 0);
    const missing = await fetch(server.baseUrl + '/api/orders/00000000-0000-4000-8000-000000000000/tracking');
    assert.equal(missing.status, 404);
  } finally {
    await server.close();
  }
});
