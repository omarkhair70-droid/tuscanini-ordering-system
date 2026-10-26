import assert from 'node:assert/strict';
import {randomUUID,generateKeyPairSync,sign} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {once} from 'node:events';
import test from 'node:test';
import {createPool} from '../dist/db.js';
import {createOrderApi} from '../dist/server.js';
import {listOwnedCustomerOrders} from '../dist/customer-orders.js';
import {googleCustomerSession,verifyGoogleIdToken} from '../dist/google-auth.js';

test('dedicated Tuscanini service has authenticated intake, durable orders and staff transitions',async()=>{
  assert.equal(process.env.PGDATABASE,'tuscanini_orders_ci','Run only on disposable CI database.');
  const pool=createPool();
  const key='ci-only-long-test-service-key-000000000000';
  const server=createOrderApi(pool,{serviceKey:key,acceptOrders:true,syncCatalog:true,contentImport:true,contentAdmin:true});
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
    assert.equal((await req('/v1/content/status','GET',undefined,false)).status,403,
      'No unauthenticated native-content or operator metadata');
    assert.equal((await req('/v1/content/site-settings','GET')).status,404,
      'Never return invented settings before the content import');
    const initialContent=await req('/v1/content/status');
    assert.equal(initialContent.body.settings_ready,false);
    const settings={
      is_ordering_open:true,whatsapp_order_number:'01001234567',
      phone_primary:'01101234567',phone_secondary:null,
      address_ar:'شارع اختبار، بني سويف',facebook_url:'https://facebook.com/example'
    };
    assert.equal((await req('/v1/content/site-settings/import','POST',{
      ...settings,nonexistent_field:'unsafe',
    })).status,400,'Site settings reject unexpected parameters');
    const savedSettings=await req('/v1/content/site-settings/import','POST',settings);
    assert.equal(savedSettings.status,200,JSON.stringify(savedSettings.body));
    assert.equal(savedSettings.body.settings.phone_primary,settings.phone_primary);
    assert.equal((await req('/v1/content/site-settings')).body.settings.address_ar,settings.address_ar);
    const offerA={id:'native-content-001',title_ar:'عرض تحقق',description_ar:'اختبار داخلي',
      badge_ar:'خاص',price_text:null,offer_price_cents:15000,is_active:true,
      sort_order:1,starts_at:null,ends_at:null};
    const offerB={...offerA,id:'native-content-002',title_ar:'عرض غير نشط',is_active:false};
    assert.equal((await req('/v1/content/offers/import','POST',{
      offers:[offerA,offerA],
    })).status,400,'Duplicate offers must be rejected atomically');
    const importedOffers=await req('/v1/content/offers/import','POST',{offers:[offerA,offerB]});
    assert.equal(importedOffers.status,200,JSON.stringify(importedOffers.body));
    const publishedOffers=await req('/v1/content/offers');
    assert.equal(publishedOffers.body.offers.length,1);
    assert.equal(publishedOffers.body.offers[0].offer_price_cents,15000);
    const nativeStatus=await req('/v1/content/status');
    assert.equal(nativeStatus.body.settings_ready,true);
    assert.equal(nativeStatus.body.total_offers,2);
    assert.equal(nativeStatus.body.active_offers,1);
    assert.equal((await req('/v1/content/admin/offers','GET',undefined,false)).status,403,
      'Unauthenticated browsers can never read merchant editing data');
    const allAdminOffers=await req('/v1/content/admin/offers');
    assert.equal(allAdminOffers.status,200);
    assert.equal(allAdminOffers.body.offers.length,2,'Admin sees inactive offers');
    const changedSettings={...settings,address_ar:'مدخل جديد'};
    assert.equal((await req('/v1/content/admin/site-settings','POST',changedSettings)).status,200);
    assert.equal((await req('/v1/content/site-settings')).body.settings.address_ar,'مدخل جديد');
    const invalid=await req('/v1/content/admin/offers','POST',
      {title_ar:'سعر غير صالح',description_ar:null,badge_ar:null,price_text:null,
        offer_price_cents:-2,is_active:true,sort_order:1,starts_at:null,ends_at:null});
    assert.equal(invalid.status,400,'Merchant must not publish invalid amount');
    const createPayload={
      title_ar:'عرض جديد',description_ar:'وصف',badge_ar:'محدود',price_text:null,
      offer_price_cents:4999,is_active:false,sort_order:10,starts_at:null,ends_at:null,
    };
    const newOffer=await req('/v1/content/admin/offers','POST',createPayload);
    assert.equal(newOffer.status,201,JSON.stringify(newOffer.body));
    const id=newOffer.body.id;
    assert.match(id,/^[0-9a-f-]{36}$/);
    assert.equal((await req('/v1/content/offers')).body.offers.length,1,
      'Saving draft cannot secretly publish it');
    assert.equal((await req('/v1/content/admin/offers/'+id+'/active','POST',
      {is_active:true})).status,200);
    const edited=await req('/v1/content/admin/offers/'+id,'POST',{
      ...createPayload,title_ar:'عرض معدل',is_active:true,
    });
    assert.equal(edited.status,200);
    assert.equal((await req('/v1/content/offers')).body.offers.length,2);
    assert.equal((await req('/v1/content/admin/offers/'+id+'/active','POST',
      {is_active:false,extra:'unsafe'})).status,400);
    assert.equal((await req('/v1/content/admin/offers/'+id+'/active','POST',
      {is_active:false})).status,200);
    assert.equal((await req('/v1/content/offers')).body.offers.length,1);
    assert.equal((await req('/v1/content/admin/offers')).body.offers.length,3,
      'Never delete offer history just by disabling a promotion');
    // Updating display content never mutates order rows or site intake flags.
    assert.equal((await pool.query('SELECT count(*)::int AS n FROM tuscanini.orders')).rows[0].n,0);
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

test('Google OpenID signed identity creates one private Oracle owner; forged and mismatched claims rejected',async()=>{
  assert.equal(process.env.PGDATABASE,'tuscanini_orders_ci');
  const pool=createPool();
  const clientId='tuscanini-ci-test.apps.googleusercontent.com';
  const nonce='ci-nonce-'+randomUUID().replaceAll('-','');
  const subject='google-sub-'+randomUUID();
  const email='google-'+randomUUID()+'@example.invalid';
  const {publicKey,privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
  const jwk=publicKey.export({format:'jwk'});
  const kid='ci-key-01';
  const keyFetch=async()=>new Response(JSON.stringify({keys:[{...jwk,kid,use:'sig',alg:'RS256'}]}),
    {status:200,headers:{'Content-Type':'application/json'}});
  const issue=(claims,signing=privateKey)=>{
    const header=Buffer.from(JSON.stringify({alg:'RS256',kid,typ:'JWT'})).toString('base64url');
    const payload=Buffer.from(JSON.stringify({iss:'https://accounts.google.com',aud:clientId,
      sub:subject,email,email_verified:true,nonce,
      exp:Math.floor(Date.now()/1000)+3500,iat:Math.floor(Date.now()/1000),...claims})).toString('base64url');
    const part=header+'.'+payload;
    return part+'.'+sign('RSA-SHA256',Buffer.from(part),signing).toString('base64url');
  };
  try{
    const settings={enabled:true,clientId};
    const login=await googleCustomerSession(pool,settings,issue({}),nonce,keyFetch);
    assert.ok(login.customer.id);
    assert.equal(login.customer.email,email);
    assert.match(login.token,/^[A-Za-z0-9_-]{43}$/);
    const again=await googleCustomerSession(pool,settings,issue({}),nonce,keyFetch);
    assert.equal(again.customer.id,login.customer.id,'stable subject returns same Oracle owner');
    const count=await pool.query('SELECT count(*)::int AS n FROM tuscanini.customer_google_identities WHERE google_subject=$1',[subject]);
    assert.equal(count.rows[0].n,1,'identity unique by Google sub');
    await assert.rejects(()=>verifyGoogleIdToken(issue({aud:'malicious.apps.googleusercontent.com'}),clientId,nonce,keyFetch),/Invalid Google sign-in/);
    await assert.rejects(()=>verifyGoogleIdToken(issue({exp:1}),clientId,nonce,keyFetch),/Invalid Google sign-in/);
    await assert.rejects(()=>verifyGoogleIdToken(issue({email_verified:false}),clientId,nonce,keyFetch),/Invalid Google sign-in/);
    await assert.rejects(()=>verifyGoogleIdToken(issue({nonce:'other-nonce'}),clientId,nonce,keyFetch),/Invalid Google sign-in/);
    await assert.rejects(()=>verifyGoogleIdToken(issue({}),clientId,'different-nonce-'+randomUUID(),keyFetch),/Invalid Google sign-in/);
    const forged=issue({}).split('.');
    forged[1]=Buffer.from(JSON.stringify({email:'evil@example.invalid'})).toString('base64url');
    await assert.rejects(()=>verifyGoogleIdToken(forged.join('.'),clientId,nonce,keyFetch),/Invalid Google sign-in/);
    // No silent takeover of a previously owned, unlinked email.
    const existingEmail='existing-'+randomUUID()+'@example.invalid';
    await pool.query('INSERT INTO tuscanini.customer_accounts(email) VALUES($1)',[existingEmail]);
    await assert.rejects(()=>googleCustomerSession(pool,settings,issue({
      sub:'new-google-sub-'+randomUUID(),email:existingEmail}),nonce,keyFetch),
      e=>e.status===409,'Google must not silently claim pre-existing OTP accounts by email');
  }finally{await pool.end()}
});
