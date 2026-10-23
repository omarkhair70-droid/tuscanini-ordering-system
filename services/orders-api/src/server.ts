import {createHash, timingSafeEqual} from 'node:crypto';
import {createServer, type IncomingMessage, type ServerResponse} from 'node:http';
import type {Pool} from 'pg';
import {RequestKeyCollision} from './orders.js';
import {OperationalError,advanceOrder,listOperatorOrders} from './operations.js';
import {syncMenuCatalog,submitMenuOrder} from './menu-orders.js';

type Settings={serviceKey:string;acceptOrders:boolean;syncCatalog:boolean};
export function serviceSettingsFromEnvironment():Settings {
  const serviceKey=process.env.ORDER_API_SERVICE_KEY??'';
  if(serviceKey.length<32)throw new Error('ORDER_API_SERVICE_KEY must be a separate 32+ character server-only secret.');
  return {serviceKey,acceptOrders:process.env.ORDER_API_ACCEPT_ORDERS==='yes',
    syncCatalog:process.env.CATALOG_SYNC_ENABLED==='yes'};
}
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function send(res:ServerResponse,status:number,body:unknown) {
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store, max-age=0','X-Content-Type-Options':'nosniff'});
  res.end(JSON.stringify(body));
}
function authenticated(req:IncomingMessage,key:string):boolean {
  const submitted=req.headers['x-tuscanini-service-key'];
  if(typeof submitted!=='string'||submitted.length<32||submitted.length>256)return false;
  const expect=createHash('sha256').update(key).digest();
  const got=createHash('sha256').update(submitted).digest();
  return timingSafeEqual(got,expect);
}
async function body(req:IncomingMessage,maxBytes=24000):Promise<Record<string,unknown>> {
  if(!String(req.headers['content-type']??'').startsWith('application/json'))throw new OperationalError('JSON required.',415);
  const parts:Buffer[]=[];
  let size=0;
  for await(const chunk of req){
    const bytes=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);
    size+=bytes.length;
    if(size>maxBytes)throw new OperationalError('Request too large.',413);
    parts.push(bytes);
  }
  try{
    const parsed:unknown=JSON.parse(Buffer.concat(parts).toString('utf8'));
    if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('object expected');
    return parsed as Record<string,unknown>;
  }catch{throw new OperationalError('Invalid JSON object.',400)}
}
export function createOrderApi(pool:Pool,settings:Settings) {
  return createServer(async(req,res)=>{
    const pathname=new URL(req.url??'/','http://localhost').pathname;
    const method=req.method??'GET';
    try {
      if(method==='GET'&&pathname==='/healthz')return send(res,200,{ok:true});
      if(method==='GET'&&pathname==='/readyz'){
        await pool.query('SELECT 1');
        return send(res,200,{ok:true});
      }
      // All order endpoints, including tracking and catalog, are server-to-server.
      if(!authenticated(req,settings.serviceKey))return send(res,403,{error:'Forbidden'});
      if(method==='POST'&&pathname==='/v1/catalog/sync'){
        if(!settings.syncCatalog)return send(res,503,{error:'Catalog synchronization disabled.'});
        const data=await body(req,150000);
        const count=await syncMenuCatalog(pool,data.products);
        return send(res,200,{ok:true,count});
      }
      if(method==='POST'&&pathname==='/v1/orders'){
        if(!settings.acceptOrders)return send(res,503,{error:'Order intake disabled.'});
        const data=await body(req,32000);
        const order=await submitMenuOrder(pool,data);
        return send(res,200,{ok:true,id:order.id,subtotal_cents:String(order.subtotal_cents),status:order.status});
      }
      const tracking=/^\/v1\/orders\/([0-9a-f-]+)\/track$/i.exec(pathname);
      if(method==='GET'&&tracking){
        if(!uuid.test(tracking[1]))return send(res,400,{error:'Invalid order reference.'});
        const result=await pool.query<{id:string;status:string;subtotal_cents:string;
          order_type:string;table_reference:string|null;created_at:string}>(
          'SELECT id,status,subtotal_cents::text,order_type,table_reference,created_at FROM tuscanini.orders WHERE id=$1',
          [tracking[1]]
        );
        if(!result.rows[0])return send(res,404,{error:'Order not found.'});
        return send(res,200,{ok:true,order:result.rows[0]});
      }
      if(method==='GET'&&pathname==='/v1/operator/orders'){
        // Caller is the authenticated Next route. Only that route may expose
        // staff inbox to browsers after checking its separate operator passkey.
        const orders=await listOperatorOrders(pool,30);
        return send(res,200,{ok:true,orders});
      }
      const action=/^\/v1\/operator\/orders\/([0-9a-f-]+)\/action$/i.exec(pathname);
      if(method==='POST'&&action){
        if(!uuid.test(action[1]))return send(res,400,{error:'Invalid order reference.'});
        const data=await body(req);
        const op=data.action;
        if(typeof op!=='string'||!['accept','reject','start','ready','deliver'].includes(op)){
          return send(res,400,{error:'Invalid operator action.'});
        }
        const role=op==='start'||op==='ready'?'kitchen':'cashier';
        const saved=await advanceOrder(pool,action[1],op as 'accept'|'reject'|'start'|'ready'|'deliver',role);
        return send(res,200,{ok:true,...saved});
      }
      return send(res,404,{error:'Unknown route.'});
    }catch(error){
      const code=error instanceof OperationalError?error.httpStatus:
        error instanceof RequestKeyCollision?409:
        error instanceof SyntaxError||error instanceof TypeError?400:
        error instanceof Error&&/Invalid menu choice|Request key format|Unavailable|Unknown addon/.test(error.message)?400:500;
      // Never put database internals or customer data in public replies/logs.
      if(code>=500)console.error('Tuscanini API request failed',pathname,code);
      send(res,code,{error:code>=500?'Order service unavailable.':error instanceof Error?error.message:'Invalid request.'});
    }
  });
}
