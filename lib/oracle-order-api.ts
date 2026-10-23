import 'server-only';
import {createHash,timingSafeEqual} from 'node:crypto';
import type {ValidatedOrderPayload} from '@/lib/orders/order-validation';

/** Preview-only until explicit signoff. The production main website is untouched. */
export function oraclePreviewEnabled():boolean{
  return process.env.VERCEL_ENV==='preview' && process.env.ORDER_BACKEND==='oracle';
}
export class OracleOrderError extends Error{
  constructor(message:string,public status:number){super(message);}
}
function connection(){
  const raw=process.env.ORDER_API_ORIGIN??'';
  const serviceKey=process.env.ORDER_API_SERVICE_KEY??'';
  let url:URL;
  try{url=new URL(raw)}catch{throw new OracleOrderError('خدمة الطلبات مش متجهزة بعد.',503)}
  if(url.protocol!=='https:'||url.pathname!=='/'||url.search||url.hash||url.username||url.password||
    url.port&&!['443'].includes(url.port)||serviceKey.length<32){
    throw new OracleOrderError('خدمة الطلبات مش متجهزة بعد.',503);
  }
  return {url,serviceKey};
}
export function operatorPasskeyAllowed(request:Request):boolean{
  const expected=process.env.TUSCANINI_OPERATOR_KEY??'';
  const actual=request.headers.get('x-studio-operator-key')??'';
  if(expected.length<24||actual.length<24||actual.length>256)return false;
  return timingSafeEqual(createHash('sha256').update(expected).digest(),
    createHash('sha256').update(actual).digest());
}
async function call(path:string,method:'GET'|'POST'='GET',payload?:unknown):Promise<Record<string,unknown>>{
  const {url,serviceKey}=connection();
  const destination=new URL(path.replace(/^\//,''),url);
  const reply=await fetch(destination,{method,cache:'no-store',
    headers:{'x-tuscanini-service-key':serviceKey,...(payload===undefined?{}:{'content-type':'application/json'})},
    body:payload===undefined?undefined:JSON.stringify(payload),signal:AbortSignal.timeout(10000)});
  let json:unknown;
  try{json=await reply.json()}catch{throw new OracleOrderError('خدمة الطلبات مش متاحة دلوقتي.',503)}
  if(!json||typeof json!=='object'||Array.isArray(json))throw new OracleOrderError('استجابة الطلب مش واضحة.',502);
  const response=json as Record<string,unknown>;
  if(!reply.ok){
    const publicMessage=reply.status===503?'تسجيل الطلبات غير متاح حاليًا.':
      reply.status===409?'الطلب اتغير أو مكرر، راجع البيانات وحاول تاني.':
      reply.status===400?'تفاصيل الأوردر محتاجة مراجعة.':
      reply.status===404?'الطلب غير موجود.':'تعذّر التواصل مع المطعم.';
    throw new OracleOrderError(publicMessage,reply.status>=500?503:reply.status);
  }
  return response;
}
export async function submitOracleOrder(requestKey:string,payload:ValidatedOrderPayload){
  if(!/^studio-[a-z0-9-]{12,70}$/i.test(requestKey))throw new OracleOrderError('مفتاح تسجيل الطلب غير صالح.',400);
  if(payload.items.some(item=>item.kind==='offer'))throw new OracleOrderError(
    'العروض مش مفعّلة في نظام الطلبات الجديد لسه.',409);
  const items=payload.items.map(item=>{
    if(item.kind!=='product')throw new OracleOrderError('صنف غير مدعوم.',400);
    return {kind:'product' as const,productId:item.productId,sizeId:item.selectedSize?.id??null,
      addonIds:item.selectedAddons.map(a=>a.id),quantity:item.quantity,itemNotes:item.itemNotes};
  });
  const data=await call('/v1/orders','POST',{
    requestKey,items,customer:payload.customer,tableReference:payload.tableReference,
  });
  if(typeof data.id!=='string'||typeof data.subtotal_cents!=='string')
    throw new OracleOrderError('تعذّر تأكيد حفظ الطلب.',502);
  return {id:data.id,subtotal:Number(data.subtotal_cents)/100};
}
export async function trackOracleOrder(orderId:string){
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId))
    throw new OracleOrderError('معرّف الطلب غير صالح.',400);
  const data=await call('/v1/orders/'+encodeURIComponent(orderId)+'/track');
  const o=data.order as Record<string,unknown>|undefined;
  if(!o||typeof o.status!=='string')throw new OracleOrderError('تعذّر قراءة حالة الطلب.',502);
  const statuses:Record<string,string>={
    received:'جديد',accepted:'جديد',preparing:'جاري التحضير',
    ready:'جاهز للاستلام',delivered:'تم التسليم',rejected:'ملغي',
  };
  if(!(o.status in statuses))throw new OracleOrderError('حالة غير مدعومة.',502);
  return {
    orderNumber:null,reference:'#'+orderId.slice(0,8).toUpperCase(),
    status:statuses[o.status],confirmationStatus:o.status==='received'?'pending':o.status==='rejected'?'rejected':'confirmed',
    tableReference:typeof o.table_reference==='string'?o.table_reference:null,
    createdAt:String(o.created_at??''),orderType:o.order_type==='delivery'?'delivery' as const:'pickup' as const,
    totalEstimate:Number(o.subtotal_cents)/100,
  };
}
export async function fetchOracleInbox(){
  const data=await call('/v1/operator/orders');
  return {orders:data.orders};
}
export async function changeOracleOrder(orderId:string,action:string){
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId)||
    !['accept','reject','start','ready','deliver'].includes(action))
    throw new OracleOrderError('إجراء مش متاح.',400);
  return call('/v1/operator/orders/'+encodeURIComponent(orderId)+'/action','POST',{action});
}
