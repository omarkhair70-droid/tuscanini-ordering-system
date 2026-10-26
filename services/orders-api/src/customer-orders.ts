/** Owner-scoped Oracle PostgreSQL history.
 * This helper is deliberately NOT an exposed HTTP route: only a future
 * server-verified Oracle session may supply the customer ID.
 */
import type {Pool} from 'pg';

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type CustomerOrderSummary={
  id:string; status:string; order_type:string;
  subtotal_cents:string; created_at:Date;
};
export async function listOwnedCustomerOrders(
  pool:Pool, verifiedCustomerId:string, maximum=30,
):Promise<CustomerOrderSummary[]>{
  if(!uuid.test(verifiedCustomerId))throw new TypeError('Verified customer ID required');
  if(!Number.isSafeInteger(maximum)||maximum<1)throw new TypeError('Invalid history limit');
  const result=await pool.query<CustomerOrderSummary>(
    `SELECT id,status,order_type,subtotal_cents::text,created_at
     FROM tuscanini.orders WHERE customer_account_id=$1
     ORDER BY created_at DESC,id DESC LIMIT $2`,
    [verifiedCustomerId,Math.min(maximum,30)],
  );
  return result.rows;
}
