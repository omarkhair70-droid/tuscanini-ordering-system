import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {once} from 'node:events';
import test from 'node:test';
import {createPool} from '../dist/db.js';
import {createOrderApi} from '../dist/server.js';

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
        address:'PRIVATE OLD DELIVERY ADDRESS',orderType:'pickup',generalNotes:''},
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
