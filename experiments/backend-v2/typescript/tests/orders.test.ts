import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test, { after, before, beforeEach } from 'node:test';
import { openDisposablePool } from '../src/db.js';
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
