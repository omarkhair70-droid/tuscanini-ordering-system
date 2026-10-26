import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {once} from 'node:events';
import test from 'node:test';
import {createPool} from '../dist/db.js';
import {createOrderApi} from '../dist/server.js';
import {listOwnedCustomerOrders} from '../dist/customer-orders.js';

test('dedicated Tuscanini service has authenticated intake, durable orders and staff transitions',async()=>{
  assert.equal(process.env.PGDATABASE,'tuscanini_orders_ci','Run only on disposable CI database.');
  const pool=createPool();
  const key='ci-only-long-test-service-key-000000000000';
  const server=createOrderApi(pool,{serviceKey:key,acceptOrders:true,syncCatalog:true});
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  const base='http://127.0.0.1:'+server.address().port;
  const req=async(path,method='GET',data,auth=true)=>{
    const res=await fetch(base+path,{method,headers:{...(auth?{'x-tuscanini-service-key':key}:{}),
      ...(data?{'content-type':'application/json'}:{})},
      body:data?JSON.stringify(data):undefined});
    return {status:res.status,body:await res.json()};
  };
  try{
    assert.equal((await req('/healthz','GET',undefined,false)).status,200);
    assert.equal((await req('/readyz','GET',undefined,false)).status,200);
    assert.equal((await req('/v1/operator/orders','GET',undefined,false)).status,403,
      'No anonymous staff data');
    assert.equal((await req('/v1/catalog/sync','POST',{
      products:[{productId:'TUSC_CI_01',name:'تجربة حقيقية آمنة',categorySlug:'qa',priceFromCents:12500,
        available:true,sizes:[],addons:[]}],
    })).status,200);
    // Same 113-item historical JSON served for one-time Oracle trial import.
    // Prices are samples, not an assertion of a merchant-approved current menu.
    const fixture=JSON.parse(await readFile(
      new URL('../fixtures/historical-menu-2026-10-23.json',import.meta.url),'utf8'));
    assert.equal(fixture.products.length,113);
    const imported=await req('/v1/catalog/sync','POST',fixture);
    assert.equal(imported.status,200,JSON.stringify(imported.body));
    assert.equal(imported.body.count,113);
    const menuCount=await pool.query('SELECT count(*)::int AS n FROM tuscanini.menu_catalog WHERE product_id != $1',
      ['TUSC_CI_01']);
    assert.equal(menuCount.rows[0].n,113);
    assert.ok(fixture.products.some(v=>v.productId==='ct3'&&v.sizes[0]?.price_cents===12500),
      'historical chicken-fire size is included in cents');
    const requestKey='studio-'+randomUUID();
    const input={requestKey,tableReference:null,expectedSubtotalCents:25000,
      customer:{name:'عميل تجربة',phone:'01012345678',
        address:'PRIVATE OLD DELIVERY ADDRESS',orderType:'pickup',paymentMethod:'cash',generalNotes:''},
      items:[{kind:'product',productId:'TUSC_CI_01',sizeId:null,addonIds:[],quantity:2,itemNotes:''}],
    };
    // Do not save an order when the amount the guest reviewed differs
    // from the server's locked authoritative catalog price.
    const mismatch=await req('/v1/orders','POST',{
      ...input,requestKey:'studio-'+randomUUID(),expectedSubtotalCents:25001,
    });
    assert.equal(mismatch.status,400,'price mismatch must not create an order');
    const missing=await req('/v1/orders','POST',{
      ...input,requestKey:'studio-'+randomUUID(),expectedSubtotalCents:undefined,
    });
    assert.equal(missing.status,400,'missing reviewed amount fails closed');
    const noOrder=await pool.query('SELECT count(*)::int AS n FROM tuscanini.orders');
    assert.equal(noOrder.rows[0].n,0,'price rejection never creates order rows');
    assert.equal((await req('/v1/orders','POST',input,false)).status,403);
    const first=await req('/v1/orders','POST',input);
    assert.equal(first.status,200,JSON.stringify(first.body));
    assert.equal(first.body.subtotal_cents,'25000');
    const orderId=first.body.id;
    assert.match(orderId,/^[0-9a-f-]{36}$/);
    const retry=await req('/v1/orders','POST',input);
    assert.equal(retry.body.id,orderId,'retry must return the same committed order');
    assert.equal((await req('/v1/orders','POST',{...input,items:[{...input.items[0],quantity:1}]})).status,409,
      'idempotency key cannot be reused for a different payload');
    const saved=await pool.query('SELECT customer_snapshot FROM tuscanini.orders WHERE id=$1',[orderId]);
    assert.equal(saved.rows[0].customer_snapshot.address,'','No old delivery address in pickup order');
    assert.equal(saved.rows[0].customer_snapshot.deliveryLocation,null,
      'Pickup strips location data even from old customer drafts');
    const deliveryInput={...input,requestKey:'studio-'+randomUUID(),
      customer:{...input.customer,orderType:'delivery',paymentMethod:'instapay_on_handoff',
        address:'شارع البحر، عمارة ٥، الدور الثاني\nموقع التوصيل: https://maps.google.com/?q=29.07344,31.09811',
        deliveryLocation:{lat:29.07344,lng:31.09811}}};
    const delivery=await req('/v1/orders','POST',deliveryInput);
    assert.equal(delivery.status,200,JSON.stringify(delivery.body));
    const snapshot=await pool.query('SELECT customer_snapshot FROM tuscanini.orders WHERE id=$1',[delivery.body.id]);
    assert.deepEqual(snapshot.rows[0].customer_snapshot.deliveryLocation,{lat:29.07344,lng:31.09811},
      'Exact customer-selected coordinates survive in immutable PostgreSQL order snapshot');
    assert.equal(snapshot.rows[0].customer_snapshot.paymentMethod,'instapay_on_handoff',
      'Snapshot stores payment preference only, not any alleged completed payment');
    assert.match(snapshot.rows[0].customer_snapshot.address,/maps.google.com\/\?q=29.07344,31.09811/,
      'Cashier snapshot gets the server-derived coordinate link');
    const currentInbox=await req('/v1/operator/orders');
    const routed=currentInbox.body.orders.find(order=>order.id===delivery.body.id);
    assert.deepEqual(routed?.customer_snapshot?.deliveryLocation,{lat:29.07344,lng:31.09811},
      'Cashier inbox has the selected pin needed by the driver directions button');
    const badPayment=await req('/v1/orders','POST',{...deliveryInput,requestKey:'studio-'+randomUUID(),
      customer:{...deliveryInput.customer,paymentMethod:'online_card_paid'}});
    assert.equal(badPayment.status,400,'Client cannot forge a paid or unsupported payment state');
    const badPin=await req('/v1/orders','POST',{...deliveryInput,requestKey:'studio-'+randomUUID(),
      customer:{...deliveryInput.customer,deliveryLocation:{lat:Infinity,lng:31.09811}}});
    assert.equal(badPin.status,400,'Invalid delivery pin must never be accepted');
    const ticket=await req('/v1/orders/'+orderId+'/track');
    assert.equal(ticket.body.order.status,'received');
    assert.equal(JSON.stringify(ticket.body).includes('01012345678'),false,'tracking never leaks contact');
    assert.equal((await req('/v1/operator/orders','GET',undefined,false)).status,403);
    const inbox=await req('/v1/operator/orders');
    assert.ok(inbox.body.orders.some(o=>o.id===orderId));
    assert.equal((await req('/v1/operator/orders/'+orderId+'/action','POST',{action:'accept'},false)).status,403);
    assert.equal((await req('/v1/operator/orders/'+orderId+'/action','POST',{action:'accept'})).status,200);
    assert.equal((await req('/v1/operator/orders/'+orderId+'/action','POST',{action:'accept'})).status,409);
    for(const action of ['start','ready','deliver']){
      assert.equal((await req('/v1/operator/orders/'+orderId+'/action','POST',{action})).status,200,action);
    }
    const done=await req('/v1/orders/'+orderId+'/track');
    assert.equal(done.body.order.status,'delivered');
    const events=await pool.query('SELECT status FROM tuscanini.order_status_event WHERE order_id=$1 ORDER BY id',[orderId]);
    assert.deepEqual(events.rows.map(x=>x.status),['received','accepted','preparing','ready','delivered']);
  }finally{
    await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));
    await pool.end();
  }
});

test('intake and catalog switches fail closed',async()=>{
  const pool=createPool();
  const server=createOrderApi(pool,{serviceKey:'ci-only-long-test-service-key-000000000000',acceptOrders:false,syncCatalog:false});
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  try{
    const response=await fetch('http://127.0.0.1:'+server.address().port+'/v1/orders',{
      method:'POST',headers:{'x-tuscanini-service-key':'ci-only-long-test-service-key-000000000000','content-type':'application/json'},
      body:JSON.stringify({})});
    assert.equal(response.status,503);
    const sync=await fetch('http://127.0.0.1:'+server.address().port+'/v1/catalog/sync',{
      method:'POST',headers:{'x-tuscanini-service-key':'ci-only-long-test-service-key-000000000000','content-type':'application/json'},
      body:JSON.stringify({})});
    assert.equal(sync.status,503);
  }finally{
    await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve()));
    await pool.end();
  }
});


test('Oracle customer data keeps verified owners isolated from guests and contact matches',async()=>{
  assert.equal(process.env.PGDATABASE,'tuscanini_orders_ci');
  const pool=createPool();
  const alice=randomUUID(),bob=randomUUID(),suffix=randomUUID();
  try{
    await pool.query('INSERT INTO tuscanini.customer_accounts (id,email) VALUES ($1,$2),($3,$4)',
      [alice,'alice-'+suffix+'@example.invalid',bob,'bob-'+suffix+'@example.invalid']);
    const address=[alice,'البيت','شارع النيل، عمارة ٧',29.0743,31.0981];
    await pool.query('INSERT INTO tuscanini.customer_addresses(customer_id,label,formatted_address,latitude,longitude,is_default) VALUES ($1,$2,$3,$4,$5,true)',address);
    const otherAddress=await pool.query('SELECT count(*)::int AS n FROM tuscanini.customer_addresses WHERE customer_id=$1',[bob]);
    assert.equal(otherAddress.rows[0].n,0,'saved address belongs only to its verified owner');
    await assert.rejects(()=>pool.query('INSERT INTO tuscanini.customer_addresses(customer_id,label,formatted_address,latitude,longitude,is_default) VALUES ($1,$2,$3,$4,$5,true)',address),
      e=>e.code==='23505','one default address per customer');
    await assert.rejects(()=>pool.query('INSERT INTO tuscanini.customer_addresses(customer_id,label,formatted_address,latitude,longitude) VALUES ($1,$2,$3,$4,$5)',
      [bob,'شغل','شارع طويل',99,31.0981]),e=>e.code==='23514','reject invalid delivery GPS');
    // Matching phone in an order snapshot is deliberately NOT account proof.
    for(const owner of [alice,bob,null]){
      await pool.query(`INSERT INTO tuscanini.orders
        (request_key,payload_sha256,subtotal_cents,status,customer_snapshot,customer_account_id)
        VALUES ($1,$2,$3,'received',$4::jsonb,$5)`,
        ['owner-'+randomUUID(),'a'.repeat(64),12500,JSON.stringify({phone:'01012345678'}),owner]);
    }
    const own=await listOwnedCustomerOrders(pool,alice);
    assert.equal(own.length,1,'owner gets neither other account nor guest orders');
    assert.equal(own[0].subtotal_cents,'12500');
    assert.equal((await listOwnedCustomerOrders(pool,bob)).length,1);
    assert.equal((await listOwnedCustomerOrders(pool,alice,200)).length,1,'history limit bounded');
    await assert.rejects(()=>listOwnedCustomerOrders(pool,'01012345678'),/Verified customer ID required/);
    const guests=await pool.query('SELECT count(*)::int AS n FROM tuscanini.orders WHERE customer_account_id IS NULL');
    assert.ok(guests.rows[0].n>=1,'existing guest orders remain anonymous');
  }finally{await pool.end()}
});

test('Oracle OTP session, owned addresses and history stay private; guest preserved',async()=>{
  assert.equal(process.env.PGDATABASE,'tuscanini_orders_ci');
  const pool=createPool(),sent=[];
  const key='ci-only-long-test-service-key-000000000000';
  const api=createOrderApi(pool,{serviceKey:key,acceptOrders:true,syncCatalog:true,
    customerAuth:{enabled:true,pepper:'testing-pepper-with-more-than-thirty-two-characters',
      sendOtp:async(email,code)=>{sent.push({email,code})}}});
  api.listen(0,'127.0.0.1'); await once(api,'listening');
  const base='http://127.0.0.1:'+api.address().port;
  const req=async(path,method='GET',input,token)=>{
    const r=await fetch(base+path,{method,headers:{'x-tuscanini-service-key':key,
      ...(input?{'content-type':'application/json'}:{}),
      ...(token?{'x-tuscanini-customer-session':token}:{})},
      body:input?JSON.stringify(input):undefined});
    return {status:r.status,body:await r.json()};
  };
  try{
    const email='buyer-'+randomUUID()+'@example.invalid';
    assert.equal((await req('/v1/customer/orders')).status,401);
    assert.equal((await req('/v1/customer/auth/verify','POST',{email,code:'000000'})).status,401);
    assert.equal((await req('/v1/customer/auth/request','POST',{email})).status,200);
    assert.equal(sent.length,1);
    assert.equal((await req('/v1/customer/auth/request','POST',{email})).status,200);
    assert.equal(sent.length,1,'resend cooldown');
    assert.equal((await req('/v1/customer/auth/verify','POST',{email,code:'111111'})).status,401);
    const signIn=await req('/v1/customer/auth/verify','POST',{email,code:sent[0].code});
    assert.equal(signIn.status,200,JSON.stringify(signIn.body));
    assert.equal(signIn.body.customer.email,email);
    const token=signIn.body.token;
    assert.equal((await req('/v1/customer/auth/session','GET',undefined,token)).status,200);
    assert.equal((await req('/v1/customer/addresses','GET',undefined,'bad')).status,401);
    const addr={label:'البيت',formatted_address:'شارع الجيش، بني سويف',latitude:29.07,longitude:31.09};
    const saved=await req('/v1/customer/addresses','POST',addr,token);
    assert.equal(saved.status,201,JSON.stringify(saved.body));
    assert.equal((await req('/v1/customer/addresses','GET',undefined,token)).body.addresses.length,1);
    assert.equal((await req('/v1/customer/orders','GET',undefined,token)).body.orders.length,0);
    assert.equal((await req('/v1/customer/addresses','DELETE',undefined,'invalid')).status,401);
    const del=await req('/v1/customer/addresses/'+saved.body.address.id,'DELETE',undefined,token);
    assert.equal(del.body.ok,true);
    assert.equal((await req('/v1/customer/addresses','GET',undefined,token)).body.addresses.length,0);
    assert.equal((await req('/v1/customer/auth/logout','POST',{},token)).status,200);
    assert.equal((await req('/v1/customer/auth/session','GET',undefined,token)).status,401);
  }finally{await new Promise((resolve,reject)=>api.close(e=>e?reject(e):resolve()));await pool.end();}
});
