/**
 * EPHEMERAL LOCAL SIMULATOR ONLY. Deliberately NOT a production HTTP API:
 * test-token + caller-supplied role are test fixtures, NOT authentication/RBAC.
 * Do not expose publicly, proxy to production, or copy as a live endpoint.
 */
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import type { Pool } from 'pg';
import { verifyDisposableLocalDatabase } from './db.js';
import { RequestKeyCollision, submitOrder, type CartLine } from './orders.js';
import { syncMenuCatalog, submitMenuOrder } from './menu-orders.js';
import { OperationalError, advanceOrder, listOperatorOrders, listOrderEvents, trackOrder, type StaffAction, type StaffRole } from './operations.js';

function json(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(data));
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  if (!(req.headers['content-type'] ?? '').startsWith('application/json')) {
    throw new OperationalError('JSON content type required.', 415);
  }
  let text = '';
  for await (const chunk of req) {
    text += String(chunk);
    if (Buffer.byteLength(text) > 16_384) {
      throw new OperationalError('Fixture body is too large.', 413);
    }
  }
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('object required');
    return value as Record<string, unknown>;
  } catch {
    throw new OperationalError('Malformed JSON object.', 400);
  }
}

function fixtureRole(req: IncomingMessage, token: string): StaffRole {
  if (req.headers['x-spike-test-token'] !== token) {
    throw new OperationalError('Test-only staff fixture token required.', 403);
  }
  const role = req.headers['x-spike-role'];
  if (role !== 'cashier' && role !== 'kitchen') {
    throw new OperationalError('Valid fixture role required.', 403);
  }
  return role;
}

export async function startLocalSimulation(pool: Pool): Promise<{
  baseUrl: string;
  fixtureToken: string;
  close: () => Promise<void>;
}> {
  verifyDisposableLocalDatabase();
  // A fixed token is needed when Next's localhost bridge runs in a
  // separate development process. It is allowed only after the disposable
  // local-DB guard above; otherwise keep a random per-run fixture token.
  const bridgeToken=process.env.TUSCANINI_STUDIO_BRIDGE_TOKEN;
  if(bridgeToken && bridgeToken.length < 24)throw new Error('Studio token must have at least 24 characters.');
  const fixtureToken=bridgeToken ?? randomUUID();
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    const method = req.method ?? 'GET';
    try {
      if(method==='GET'&&url.pathname==='/studio'){
        const html=await readFile(new URL('../studio/index.html',import.meta.url),'utf8');
        res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store',
          'Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'"});
        res.end(html.replaceAll('__STUDIO_TOKEN__',fixtureToken));
        return;
      }
      if(method==='GET'&&url.pathname==='/api/studio/catalog'){
        const rows=await pool.query<{sku:string;name:string;unit_price_cents:number}>(
          'SELECT sku,name,unit_price_cents FROM spike_ts.catalog_item WHERE available=true ORDER BY sku'
        );
        json(res,200,{items:rows.rows});
        return;
      }
      if(method==='POST'&&url.pathname==='/api/studio/catalog/sync'){
        fixtureRole(req,fixtureToken);
        const body=await readJson(req);
        const synced=await syncMenuCatalog(pool,body.products);
        json(res,200,{count:synced});
        return;
      }
      if(method==='POST'&&url.pathname==='/api/orders/menu'){
        const body=await readJson(req);
        const order=await submitMenuOrder(pool,body);
        json(res,200,{id:order.id,status:order.status,subtotal_cents:order.subtotal_cents});
        return;
      }
      const fullTrack=/^\/api\/orders\/([0-9a-f-]+)\/menu-tracking$/i.exec(url.pathname);
      if(method==='GET'&&fullTrack){
        const order=await pool.query<{id:string;status:string;subtotal_cents:string;created_at:string;
          order_type:string;table_reference:string|null}>(
          'SELECT id,status,subtotal_cents::text,created_at,order_type,table_reference FROM spike_ts.orders WHERE id=$1',
          [fullTrack[1]]
        );
        if(!order.rows[0])throw new OperationalError('Order does not exist.',404);
        json(res,200,order.rows[0]);
        return;
      }
      if(method==='GET'&&url.pathname==='/api/staff/orders'){
        fixtureRole(req,fixtureToken);
        json(res,200,{orders:await listOperatorOrders(pool,30)});
        return;
      }
      const events=new RegExp('^/api/orders/([0-9a-f-]+)/events' + String.fromCharCode(36),'i').exec(url.pathname);
      if(method==='GET'&&events){
        json(res,200,{events:await listOrderEvents(pool,events[1])});
        return;
      }
      if (method === 'POST' && url.pathname === '/api/orders') {
        const body = await readJson(req);
        const order = await submitOrder(pool, body.requestKey as string, body.items as CartLine[]);
        json(res, 200, { id: order.id, status: order.status, subtotal_cents: order.subtotal_cents });
        return;
      }
      const tracking = /^\/api\/orders\/([0-9a-f-]+)\/tracking$/i.exec(url.pathname);
      if (method === 'GET' && tracking) {
        json(res, 200, await trackOrder(pool, tracking[1]));
        return;
      }
      const action = /^\/api\/(staff|kitchen)\/orders\/([0-9a-f-]+)\/(decision|progress|handoff)$/i.exec(url.pathname);
      if (method === 'POST' && action) {
        const role = fixtureRole(req, fixtureToken);
        const body = await readJson(req);
        const requested = body.action;
        const allowedForRoute: Record<string, string[]> = {
          'staff/decision': ['accept', 'reject'],
          'kitchen/progress': ['start', 'ready'],
          'staff/handoff': ['deliver'],
        };
        const route = action[1] + '/' + action[3];
        if (!allowedForRoute[route]?.includes(String(requested))) {
          throw new OperationalError('Operation not valid for this route.', 400);
        }
        const result = await advanceOrder(pool, action[2], requested as StaffAction, role);
        json(res, 200, result);
        return;
      }
      json(res, 404, { error: 'Simulation route not found.' });
    } catch (error) {
      const status = error instanceof OperationalError ? error.httpStatus
        : error instanceof RequestKeyCollision ? 409
        : error instanceof SyntaxError || error instanceof TypeError ? 400
        : error instanceof Error && /Expected 1|Invalid SKU|Invalid menu choice|Request key format|Unavailable or unknown/.test(error.message) ? 400
        : 500;
      json(res, status, { error: error instanceof Error ? error.message : 'Unexpected simulation error.' });
    }
  });

  // No caller-provided host/port: the ephemeral fixture cannot bind to a LAN IP.
  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolve();
    });
  });
  const address = server.address() as AddressInfo;
  return {
    baseUrl: 'http://127.0.0.1:' + address.port,
    fixtureToken,
    close: () => new Promise<void>((resolve, reject) =>
      server.close(error => error ? reject(error) : resolve())),
  };
}
