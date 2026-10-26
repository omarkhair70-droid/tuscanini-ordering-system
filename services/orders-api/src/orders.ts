/**
 * Separate TypeScript + PostgreSQL transaction spike.
 * No HTTP/public API, merchant data, Supabase, payment gateway or cashier system.
 */
import { createHash } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';

export type CartLine = { sku: string; qty: number };
export type RecordedOrder = {
  id: string;
  request_key: string;
  payload_sha256: string;
  status: string;
  subtotal_cents: string;
};
export type FaultStage = 'after_header' | 'after_lines' | 'after_history' | 'after_outbox';

export class RequestKeyCollision extends Error {
  constructor() {
    super('Request key reused with a different cart.');
    this.name = 'RequestKeyCollision';
  }
}

function normalizeItems(items: unknown): CartLine[] {
  if (!Array.isArray(items) || items.length < 1 || items.length > 20) {
    throw new Error('Expected 1–20 order line objects.');
  }
  const seen = new Set<string>();
  const normalized: CartLine[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') throw new Error('Invalid line.');
    const data = item as Record<string, unknown>;
    if (typeof data.sku !== 'string'
      || !/^[a-zA-Z0-9_-]{1,64}$/.test(data.sku)
      || !Number.isInteger(data.qty)
      || Number(data.qty) < 1 || Number(data.qty) > 100
      || seen.has(data.sku)) {
      throw new Error('Invalid SKU, quantity, or duplicate SKU.');
    }
    seen.add(data.sku);
    normalized.push({ sku: data.sku, qty: Number(data.qty) });
  }
  return normalized.sort((a, b) => a.sku < b.sku ? -1 : a.sku > b.sku ? 1 : 0);
}

async function findExisting(pool: Pool, key: string, sha: string): Promise<RecordedOrder | null> {
  const result = await pool.query<RecordedOrder>(
    'SELECT id, request_key, payload_sha256, status, subtotal_cents FROM tuscanini.orders WHERE request_key = $1',
    [key],
  );
  const prior = result.rows[0] ?? null;
  if (prior && prior.payload_sha256 !== sha) throw new RequestKeyCollision();
  return prior;
}

function isIdempotencyUniqueViolation(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const { code, constraint } = error as { code?: string; constraint?: string };
  return code === '23505' && constraint === 'orders_request_key_key';
}

export async function submitOrder(
  pool: Pool,
  requestKey: string,
  suppliedItems: CartLine[],
  faultAt?: FaultStage,
): Promise<RecordedOrder> {
  if (typeof requestKey !== 'string' || !/^[a-zA-Z0-9_-]{8,80}$/.test(requestKey)) {
    throw new Error('Request key format invalid.');
  }
  const items = normalizeItems(suppliedItems);
  // Python's json.dumps(sort_keys=True, separators=(",",":")) sorts keys
  // alphabetically; this identical {qty,sku} representation allows comparing
  // the two experimental implementations' cart fingerprint contract.
  const canonical = JSON.stringify(items.map(item => ({ qty: item.qty, sku: item.sku })));
  const sha = createHash('sha256').update(canonical, 'utf8').digest('hex');

  const found = await findExisting(pool, requestKey, sha);
  if (found) return found;

  const client: PoolClient = await pool.connect();
  try {
    await client.query('BEGIN');
    const lines: Array<{ sku: string; name: string; unit: number; qty: number; total: number }> = [];
    let subtotal = 0;
    for (const item of items) {
      // Lock sorted SKU rows to protect price consistency during transaction.
      const product = await client.query<{ sku: string; name: string; unit_price_cents: number }>(
        'SELECT sku, name, unit_price_cents FROM tuscanini.catalog_item WHERE sku = $1 AND available = TRUE FOR UPDATE',
        [item.sku],
      );
      if (!product.rows[0]) throw new Error('Unavailable or unknown catalog item.');
      const unit = product.rows[0].unit_price_cents;
      const total = unit * item.qty;
      subtotal += total;
      if (!Number.isSafeInteger(total) || !Number.isSafeInteger(subtotal)) {
        throw new Error('Amount overflow.');
      }
      lines.push({ sku: item.sku, name: product.rows[0].name, unit, qty: item.qty, total });
    }
    const created = await client.query<RecordedOrder>(
      "INSERT INTO tuscanini.orders(request_key, payload_sha256, subtotal_cents, status) VALUES ($1,$2,$3,'received') RETURNING id, request_key, payload_sha256, status, subtotal_cents",
      [requestKey, sha, subtotal],
    );
    const order = created.rows[0];
    if (!order) throw new Error('Missing inserted order.');
    if (faultAt === 'after_header') throw new Error('Injected fault: header');

    for (const line of lines) {
      await client.query(
        'INSERT INTO tuscanini.order_line(order_id, sku_snapshot, name_snapshot, unit_price_cents, quantity, line_total_cents) VALUES ($1,$2,$3,$4,$5,$6)',
        [order.id, line.sku, line.name, line.unit, line.qty, line.total],
      );
    }
    if (faultAt === 'after_lines') throw new Error('Injected fault: lines');

    await client.query(
      "INSERT INTO tuscanini.order_status_event(order_id, status, detail) VALUES ($1,'received','Received, not accepted by staff.')",
      [order.id],
    );
    if (faultAt === 'after_history') throw new Error('Injected fault: audit');

    await client.query(
      "INSERT INTO tuscanini.outbox_event(order_id, kind, payload) VALUES ($1,'order.received',$2::jsonb)",
      [order.id, JSON.stringify({ order_id: order.id, status: 'received' })],
    );
    if (faultAt === 'after_outbox') throw new Error('Injected fault: outbox');

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    if (isIdempotencyUniqueViolation(error)) {
      // After rollback, PostgreSQL's unique-index conflict has resolved:
      // concurrent submissions converge on the committed existing row.
      const existing = await findExisting(pool, requestKey, sha);
      if (existing) return existing;
    }
    throw error;
  } finally {
    client.release();
  }
}

/** At-least-once relay fixture. Consumer must dedupe using event id. */
export async function deliverOneOutbox(
  pool: Pool,
  send: (eventId: string, payload: unknown) => Promise<void>,
): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const events = await client.query<{ id: string; payload: unknown }>(
      'SELECT id, payload FROM tuscanini.outbox_event WHERE delivered_at IS NULL ORDER BY created_at, id FOR UPDATE SKIP LOCKED LIMIT 1',
    );
    const event = events.rows[0];
    if (!event) {
      await client.query('COMMIT');
      return false;
    }
    await send(event.id, event.payload);
    await client.query(
      'UPDATE tuscanini.outbox_event SET delivered_at = now() WHERE id = $1',
      [event.id],
    );
    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
