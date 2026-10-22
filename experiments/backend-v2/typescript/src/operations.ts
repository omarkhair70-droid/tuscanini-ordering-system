/**
 * Local-only order fulfillment domain. No live POS, kitchen hardware or payment
 * callbacks. All status changes, audit rows and outbox signals commit together.
 */
import type { Pool } from 'pg';

export type OrderStatus = 'received' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered';
export type StaffRole = 'cashier' | 'kitchen';
export type StaffAction = 'accept' | 'reject' | 'start' | 'ready' | 'deliver';

export class OperationalError extends Error {
  constructor(message: string, public readonly httpStatus: number) {
    super(message);
    this.name = 'OperationalError';
  }
}

const ACTIONS: Record<StaffAction, { role: StaffRole; from: OrderStatus; to: OrderStatus }> = {
  accept: { role: 'cashier', from: 'received', to: 'accepted' },
  reject: { role: 'cashier', from: 'received', to: 'rejected' },
  start: { role: 'kitchen', from: 'accepted', to: 'preparing' },
  ready: { role: 'kitchen', from: 'preparing', to: 'ready' },
  deliver: { role: 'cashier', from: 'ready', to: 'delivered' },
};

function validateOrderId(id: string): void {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new OperationalError('Invalid order reference.', 400);
  }
}

export function assertCanApply(action: string, actorRole: StaffRole): asserts action is StaffAction {
  if (!(action in ACTIONS)) throw new OperationalError('Unknown staff action.', 400);
  if (ACTIONS[action as StaffAction].role !== actorRole) {
    throw new OperationalError('Role not allowed for this operation.', 403);
  }
}

export async function advanceOrder(
  pool: Pool,
  orderId: string,
  action: StaffAction,
  actorRole: StaffRole,
  opts: { failAfterUpdate?: boolean } = {},
): Promise<{ id: string; status: OrderStatus }> {
  validateOrderId(orderId);
  assertCanApply(action, actorRole);
  const contract = ACTIONS[action];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const current = await client.query<{ id: string; status: OrderStatus }>(
      'SELECT id, status FROM spike_ts.orders WHERE id=$1 FOR UPDATE',
      [orderId],
    );
    if (!current.rows[0]) throw new OperationalError('Order does not exist.', 404);
    if (current.rows[0].status !== contract.from) {
      throw new OperationalError(
        'Order was already changed or is not at the required stage. Refresh it before trying again.',
        409,
      );
    }

    await client.query(
      'UPDATE spike_ts.orders SET status=$2 WHERE id=$1',
      [orderId, contract.to],
    );
    if (opts.failAfterUpdate) throw new Error('Injected fault: status write');

    await client.query(
      'INSERT INTO spike_ts.order_status_event(order_id, status, detail, actor_role, action) VALUES ($1,$2,$3,$4,$5)',
      [orderId, contract.to, 'Simulation staff state change: ' + action, actorRole, action],
    );
    await client.query(
      'INSERT INTO spike_ts.outbox_event(order_id, kind, payload) VALUES ($1,$2,$3::jsonb)',
      [orderId, 'order.' + contract.to, JSON.stringify({ order_id: orderId, status: contract.to })],
    );

    await client.query('COMMIT');
    return { id: orderId, status: contract.to };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function trackOrder(pool: Pool, orderId: string): Promise<{
  id: string;
  status: OrderStatus;
  subtotal_cents: string;
}> {
  validateOrderId(orderId);
  const rows = await pool.query<{ id: string; status: OrderStatus; subtotal_cents: string }>(
    'SELECT id, status, subtotal_cents FROM spike_ts.orders WHERE id=$1',
    [orderId],
  );
  if (!rows.rows[0]) throw new OperationalError('Order does not exist.', 404);
  return rows.rows[0];
}
