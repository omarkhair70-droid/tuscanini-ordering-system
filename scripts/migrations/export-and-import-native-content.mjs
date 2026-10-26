#!/usr/bin/env node
/**
 * One-time Tuscanini-owned content transfer. Read-only by default.
 * Requires operator-supplied env variables in a trusted shell, never in chat.
 * Never prints credentials, contact numbers, offer titles or private data.
 *
 * Usage: node scripts/migrations/export-and-import-native-content.mjs
 *        node scripts/migrations/export-and-import-native-content.mjs --apply
 * Apply additionally requires TUSCANINI_NATIVE_CONTENT_IMPORT_CONFIRMED=yes
 * and Coolify CONTENT_IMPORT_ENABLED=yes temporarily.
 */
const apply=process.argv.includes('--apply');
if(process.argv.some(arg=>arg!=='--apply'&&arg!==process.argv[0]&&arg!==process.argv[1]))
  throw Error('Unexpected argument. Only --apply is supported.');
const source=process.env.NEXT_PUBLIC_SUPABASE_URL;
const sourceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
const target=process.env.ORDER_API_ORIGIN;
const key=process.env.ORDER_API_SERVICE_KEY;
if(!source||!sourceKey||!target||!key)
  throw Error('Missing source/target environment configuration.');
const sourceUrl=new URL(source);
const targetUrl=new URL(target);
if(sourceUrl.protocol!=='https:'||targetUrl.protocol!=='https:'||
   targetUrl.username||targetUrl.password||targetUrl.search||targetUrl.hash||
   !targetUrl.pathname.endsWith('/')||key.length<32)
  throw Error('Invalid endpoints or service key length.');
if(apply&&process.env.TUSCANINI_NATIVE_CONTENT_IMPORT_CONFIRMED!=='yes')
  throw Error('Explicit TUSCANINI_NATIVE_CONTENT_IMPORT_CONFIRMED=yes required for writes.');
async function readSource(table,columns,offset){
  const url=new URL('/rest/v1/'+table,sourceUrl);
  url.searchParams.set('select',columns);
  url.searchParams.set('order',table==='offers'?'created_at.asc':'id.asc');
  url.searchParams.set('limit','100');
  url.searchParams.set('offset',String(offset));
  const response=await fetch(url,{
    headers:{apikey:sourceKey,Authorization:'Bearer '+sourceKey},
    signal:AbortSignal.timeout(10000),
  });
  if(!response.ok)throw Error('Legacy export request failed: '+table+' status '+response.status);
  const data=await response.json();
  if(!Array.isArray(data))throw Error('Unexpected legacy export shape.');
  return data;
}
async function allRows(table,columns){
  const all=[];
  for(let offset=0;offset<=500;offset+=100){
    const rows=await readSource(table,columns,offset);
    all.push(...rows);
    if(rows.length<100)return all;
  }
  throw Error('Source exceeds import limit. Run explicit migration review.');
}
async function native(path,method='GET',payload){
  const url=new URL('v1/content/'+path,targetUrl);
  const response=await fetch(url,{
    method,headers:{'x-tuscanini-service-key':key,
      ...(payload===undefined?{}:{'content-type':'application/json'})},
    body:payload===undefined?undefined:JSON.stringify(payload),
    signal:AbortSignal.timeout(12000),
  });
  const result=await response.json().catch(()=>null);
  if(!response.ok)throw Error('Native content API failed: '+path+' status '+response.status);
  if(!result||typeof result!=='object')throw Error('Unexpected native response');
  return result;
}
const legacySettings=await allRows('site_settings',
  'id,is_ordering_open,whatsapp_order_number,phone_primary,phone_secondary,address_ar,facebook_url');
const legacyOffers=await allRows('offers',
  'id,title_ar,description_ar,badge_ar,price_text,offer_price,is_active,sort_order,starts_at,ends_at,created_at');
if(legacySettings.length!==1||Number(legacySettings[0].id)!==1)
  throw Error('Expected exactly one legacy settings record id=1; no write.');
const config=legacySettings[0];
const settings={
  is_ordering_open:config.is_ordering_open,
  whatsapp_order_number:config.whatsapp_order_number,
  phone_primary:config.phone_primary,
  phone_secondary:config.phone_secondary??null,
  address_ar:config.address_ar,
  facebook_url:config.facebook_url??null,
};
const ids=new Set();
const offers=legacyOffers.map(value=>{
  const id=String(value.id??'');
  if(!id||ids.has(id))throw Error('Unexpected or duplicate source offer ID');
  ids.add(id);
  const n=value.offer_price===null?null:Number(value.offer_price);
  if(n!==null&&(!Number.isFinite(n)||n<0||n>20000||
    Math.abs(Math.round(n*100)-n*100)>0.001))
    throw Error('Invalid source offer price precision');
  return {
    id,title_ar:value.title_ar,description_ar:value.description_ar??null,
    badge_ar:value.badge_ar??null,price_text:value.price_text??null,
    offer_price_cents:n===null?null:Math.round(n*100),
    is_active:value.is_active,sort_order:value.sort_order,
    starts_at:value.starts_at??null,ends_at:value.ends_at??null,
  };
});
const status=await native('status');
console.log(JSON.stringify({mode:apply?'apply':'dry-run',sourceSiteRows:legacySettings.length,
  sourceOffers:offers.length,targetSettingsReady:status.settings_ready,
  targetTotalOffers:status.total_offers},null,2));
if(!apply){
  console.log('No writes performed. Verify source data out-of-band and run with --apply once approved.');
  process.exit(0);
}
if(status.settings_ready||status.total_offers!==0)
  throw Error('Target already has content. Stop and reconcile manually; never overwrite blindly.');
await native('site-settings/import','POST',settings);
await native('offers/import','POST',{offers});
const after=await native('status');
if(!after.settings_ready||after.total_offers!==offers.length)
  throw Error('Native content parity failed. Do not enable public cutover.');
console.log(JSON.stringify({importedSettings:true,verifiedOfferCount:after.total_offers,
  nextAction:'Review owner-facing offers and switch TUSCANINI_NATIVE_CONTENT_ENABLED in preview only.'},null,2));
