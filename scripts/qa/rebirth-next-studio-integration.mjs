/**
 * Actual Next.js API → disposable PostgreSQL Order Room service integration.
 * Runs only with localhost app+studio servers and synthetic prices/orders.
 */
import assert from 'node:assert/strict';
const base=process.env.STUDIO_NEXT_SMOKE_URL ?? 'http://127.0.0.1:3099';
if(!/^http:\/\/127\.0\.0\.1:[0-9]{2,5}$/.test(base))throw Error('Only localhost tests permitted.');
const operatorKey=process.env.TUSCANINI_STUDIO_OPERATOR_KEY;
if(!operatorKey||operatorKey.length<24)throw Error('Missing disposable studio operator key.');
const request=async(resource,opts={})=>{
  const path='/api/studio/bridge?resource='+resource+(opts.id?'&orderId='+opts.id:'');
  const response=await fetch(base+path,{cache:'no-store',
    method:opts.body===undefined?'GET':'POST',
    headers:{...(opts.key?{'x-studio-operator-key':opts.key}:{}),
      ...(opts.body===undefined?{}:{'content-type':'application/json'})},
    body:opts.body===undefined?undefined:JSON.stringify(opts.body)});
  return {response,payload:await response.json()};
};
const customer=await fetch(base+'/studio');
assert.equal(customer.status,200,'Customer Next route should render');
assert.match(await customer.text(),/اختار. اطلب. عيش الحكاية./);
const tablet=await fetch(base+'/operator/orders');
assert.equal(tablet.status,200,'Operator Next route should render');
assert.match(await tablet.text(),/الأوردرات تحت إيدك/);
const cat=await request('catalog');
assert.equal(cat.response.status,200);
const sku=cat.payload.items.find(x=>x.sku==='TUSC_DEMO_01')?.sku;
assert.equal(sku,'TUSC_DEMO_01');
const key='studio-'+crypto.randomUUID();
const items=[{sku,qty:2}];
const created=await request('create',{body:{requestKey:key,items}});
assert.equal(created.response.status,200,'Create from Next must save in PostgreSQL');
const id=created.payload.id;
assert.match(id,/^[0-9a-f-]{36}$/i);
const retried=await request('create',{body:{requestKey:key,items}});
assert.equal(retried.payload.id,id,'Identical retries must reuse the same order');
const notAllowed=await request('inbox');
assert.equal(notAllowed.response.status,403,'Operator cannot access without key');
const notAllowedAction=await request('action',{id,body:{action:'accept'}});
assert.equal(notAllowedAction.response.status,403);
const rejectedSsrF=await request('track',{id:'https://somewhere.example'});
assert.equal(rejectedSsrF.response.status,404);
const inbox=await request('inbox',{key:operatorKey});
assert.equal(inbox.response.status,200);
const order=inbox.payload.orders.find(o=>o.id===id);
assert.ok(order,'New order must appear in operator inbox');
assert.equal(order.status,'received');
assert.equal(order.items[0].qty,2);
for(const [action,next] of [['accept','accepted'],['start','preparing'],['ready','ready'],['deliver','delivered']]){
  const changed=await request('action',{id,key:operatorKey,body:{action}});
  assert.equal(changed.response.status,200,action+' should update order');
  const track=await request('track',{id});
  assert.equal(track.response.status,200);
  assert.equal(track.payload.status,next,action+' should show on customer ticket');
}
const eventLog=await request('events',{id});
assert.deepEqual(eventLog.payload.events.map(e=>e.status),['received','accepted','preparing','ready','delivered']);
const badExtra=await request('action',{id,key:operatorKey,body:{action:'ready'}});
assert.equal(badExtra.response.status,409,'Stale state action should not duplicate event');
const unchanged=await request('events',{id});
assert.equal(unchanged.payload.events.length,5);
console.log('PASS: real Next customer → PostgreSQL order → operator inbox → actions → customer tracking & 5 events.');
console.log('PASS: idempotency, staff secret gate, invalid references, stale action conflict.');
