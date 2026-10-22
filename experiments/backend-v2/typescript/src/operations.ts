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

/** A first-party operator inbox query for the isolated studio, not Talabat/POS. */
export async function listOperatorOrders(pool: Pool, limit=30): Promise<Array<{
  id: string; status: OrderStatus; subtotal_cents: string; created_at: string;
  items: Array<{ sku: string; name: string; qty: number; price_cents: number; selection:unknown; notes:string }>;
}>> {
  if(!Number.isInteger(limit)||limit<1||limit>50)throw new OperationalError('Invalid inbox page size.',400);
  const res=await pool.query<{
    id:string;status:OrderStatus;subtotal_cents:string;created_at:string;
    items:Array<{sku:string;name:string;qty:number;price_cents:number;selection:unknown;notes:string}>;
  }>(`
    SELECT o.id,o.status,o.subtotal_cents::text,o.created_at,
      COALESCE(json_agg(json_build_object('sku',l.sku_snapshot,'name',l.name_snapshot,
        'qty',l.quantity,'price_cents',l.unit_price_cents, 'selection',l.selection_snapshot, 'notes',l.notes_snapshot) ORDER BY l.id)
        FILTER (WHERE l.id IS NOT NULL),'[]'::json) AS items
    FROM spike_ts.orders o
    LEFT JOIN spike_ts.order_line l ON l.order_id=o.id
    GROUP BY o.id ORDER BY o.created_at DESC,o.id DESC LIMIT $1
  `,[limit]);
  return res.rows;
}

/** The actual event ledger used by the live ticket, ordered by durable event id. */
export async function listOrderEvents(pool: Pool,orderId:string):Promise<Array<{
  id:string;status:OrderStatus;action:string;actor_role:string;created_at:string;
}>> {
  validateOrderId(orderId);
  const order=await pool.query('SELECT 1 FROM spike_ts.orders WHERE id=$1',[orderId]);
  if(!order.rows[0])throw new OperationalError('Order does not exist.',404);
  const result=await pool.query<{
    id:string;status:OrderStatus;action:string;actor_role:string;created_at:string;
  }>(`SELECT id::text,status,action,actor_role,created_at
     FROM spike_ts.order_status_event WHERE order_id=$1 ORDER BY id ASC`,[orderId]);
  return result.rows;
}
