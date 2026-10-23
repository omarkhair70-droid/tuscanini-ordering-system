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
assert.match(await tablet.text(),/الأوردرات بتتحرّك/);
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

// REAL REBIRTH CART: same public /api/orders + /api/orders/track endpoints,
// server-sourced 113-product catalog, real variant/add-on/note line snapshots.
const settings=await fetch(base+'/api/public/site-settings').then(x=>x.json());
assert.equal(settings.settings?.studioMode,true,'Local checkout must have real staging mode enabled');
const key2='studio-'+crypto.randomUUID();
const rebirthCustomer={name:'عميل تجربة',phone:'01012345678',address:'عنوان دليفري متبقّي لا يخص الاستلام',orderType:'pickup',
  generalNotes:'من غير بصل',confirmedAccurateDetails:true};
const menuItems=[
  {lineId:'rebirth-fixture-1',kind:'product',productId:'cm1',productName:'برجر',
    selectedSize:{id:'small',label:'صغير',price:40},
    selectedAddons:[{id:'addon-mozzarella',label:'موتزاريلا',price:20}],
    quantity:2,itemNotes:'مستوي زيادة',unitPrice:60,totalItemPrice:120},
  {lineId:'rebirth-fixture-2',kind:'product',productId:'dr1',productName:'مياه معدنية صغير',
    selectedSize:{id:'single',label:'سعر واحد',price:10},
    selectedAddons:[],quantity:1,itemNotes:'',unitPrice:10,totalItemPrice:10},
];
const rebirthBody={customer:rebirthCustomer,items:menuItems,subtotal:130,tableReference:'A-3',requestKey:key2};
async function fullOrder(body){
  const res=await fetch(base+'/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify(body)});
  return {status:res.status,payload:await res.json()};
}
const realOrder=await fullOrder(rebirthBody);
assert.equal(realOrder.status,200,'Authored Rebirth cart must save against staging catalog');
assert.equal(realOrder.payload.ok,true);
const realId=realOrder.payload.orderId;
const repeat=await fullOrder(rebirthBody);
assert.equal(repeat.payload.orderId,realId,'Exact retry returns one order');
const realInbox=await request('inbox',{key:operatorKey});
const savedLine=realInbox.payload.orders.find(o=>o.id===realId);
assert.ok(savedLine,'Customized Rebirth order appears in operator inbox');
assert.equal(savedLine.subtotal_cents,'13000');
assert.equal(savedLine.order_type,'pickup');
assert.equal(savedLine.customer_snapshot.address,'',
  'Server must discard leftover delivery address from any pickup submission');
assert.equal(savedLine.table_reference,'A-3');
assert.equal(savedLine.customer_snapshot.name,'عميل تجربة');
assert.equal(savedLine.customer_snapshot.generalNotes,'من غير بصل');
assert.equal(savedLine.items[0]?.selection.size.id,'small');
assert.equal(savedLine.items[0]?.selection.addons[0]?.id,'addon-mozzarella');
assert.equal(savedLine.items[0]?.notes,'مستوي زيادة');
// The simplest cancellation reality: only restaurant rejection is a
// durable status mutation. A customer's WhatsApp inquiry is NOT an action.
const rejectedCandidate=await fullOrder({...rebirthBody,requestKey:'studio-'+crypto.randomUUID()});
assert.equal(rejectedCandidate.status,200,'Staging saves a separate candidate for rejection');
const rejectedId=rejectedCandidate.payload.orderId;
const declined=await request('action',{id:rejectedId,key:operatorKey,body:{action:'reject'}});
assert.equal(declined.response.status,200,'Operator can reject an unaccepted order');
assert.equal(declined.payload.status,'rejected');
const rejectedTicket=await fetch(base+'/api/orders/track?orderId='+rejectedId).then(x=>x.json());
assert.equal(rejectedTicket.ok,true);
assert.equal(rejectedTicket.order.status,'ملغي','Customer ticket reports actual rejected order as cancelled');
assert.equal(rejectedTicket.order.confirmationStatus,'rejected','No fabricated merchant acceptance');
const rejectAgain=await request('action',{id:rejectedId,key:operatorKey,body:{action:'reject'}});
assert.equal(rejectAgain.response.status,409,'Second rejection must not create duplicate status events');
const rejectedEvents=await request('events',{id:rejectedId});
assert.deepEqual(rejectedEvents.payload.events.map(e=>e.status),['received','rejected']);
console.log('PASS: operator reject → persisted event → truthful Rebirth cancelled customer ticket; duplicate reject denied.');

const deliveryAddress='عنوان توصيل اختبار - بني سويف';
const delivery=await fullOrder({...rebirthBody,requestKey:'studio-'+crypto.randomUUID(),
  customer:{...rebirthCustomer,orderType:'delivery',address:deliveryAddress}});
assert.equal(delivery.status,200,'Delivery checkout must submit a complete address to staging');
const deliverySaved=(await request('inbox',{key:operatorKey})).payload.orders.find(o=>o.id===delivery.payload.orderId);
assert.equal(deliverySaved.order_type,'delivery');
assert.equal(deliverySaved.customer_snapshot.address,deliveryAddress,
  'Delivery address must be retained when fulfillment explicitly requires it');
const stamped=await fullOrder({...rebirthBody,items:[{...menuItems[0],quantity:3,totalItemPrice:180},menuItems[1]],subtotal:190});
assert.equal(stamped.status,409,'Same request key with changed quantity cannot create order');
const forgery=await fullOrder({...rebirthBody,requestKey:'studio-'+crypto.randomUUID(),
  items:[{...menuItems[0],unitPrice:1,totalItemPrice:2}],subtotal:2});
assert.equal(forgery.status,200,'Client cart local arithmetic may validate, but DB price remains authoritative');
const forgedSaved=(await request('inbox',{key:operatorKey})).payload.orders.find(o=>o.id===forgery.payload.orderId);
assert.equal(forgedSaved.subtotal_cents,'12000','Backend ignores malicious unitPrice, calculates from catalog');
await request('action',{id:realId,key:operatorKey,body:{action:'accept'}});
await request('action',{id:realId,key:operatorKey,body:{action:'start'}});
const branded=await fetch(base+'/api/orders/track?orderId='+realId).then(x=>x.json());
assert.equal(branded.ok,true);
assert.equal(branded.order.status,'جاري التحضير');
assert.equal(branded.order.confirmationStatus,'confirmed');
assert.equal(branded.order.totalEstimate,130);
const page=await fetch(base+'/order-success?orderId='+realId);
assert.equal(page.status,200);
assert.match(await page.text(),/Order in Motion|ORDER IN MOTION|TRACKING/);
console.log('PASS: FULL REBIRTH CART → menu catalog/server-priced size/addon/notes → operator → original ticket.');
console.log('PASS: full-cart retries and altered-cart conflicts, price forgery rejected as monetary authority.');
console.log('PASS: pickup strips stale private delivery address server-side; delivery retains deliberate address.');
