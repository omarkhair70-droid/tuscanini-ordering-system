import 'server-only';
import { featuredItems } from '@/lib/mock-data';
import { getLocalStudioOrigin } from '@/lib/studio-bridge';
import type { ValidatedOrderPayload } from '@/lib/orders/order-validation';

type Product={
 productId:string;name:string;categorySlug:string;priceFromCents:number;available:boolean;
 sizes:Array<{id:string;label:string;price_cents:number}>;
 addons:Array<{id:string;label:string;price_cents:number}>;
};
let syncedAt=0, syncing:Promise<void>|null=null;
function priceCents(value:number):number {
  const cents=Math.round(value*100);
  if(!Number.isSafeInteger(cents)||cents<0)throw Error('Invalid authored menu price');
  return cents;
}
function catalog():Product[]{
  return featuredItems.map(item=>({
    productId:item.id,name:item.name,categorySlug:item.categorySlug,
    priceFromCents:priceCents(item.priceFrom),available:item.availability!=='unavailable',
    sizes:(item.sizes??[]).map(s=>({id:s.id,label:s.label,price_cents:priceCents(s.price)})),
    addons:(item.addons??[]).map(a=>({id:a.id,label:a.label,price_cents:priceCents(a.price)})),
  }));
}
async function call(path:string,body?:unknown,staff=false):Promise<Record<string,unknown>>{
  const origin=getLocalStudioOrigin();
  if(!origin)throw new Error('Studio is not running.');
  const headers:Record<string,string>={};
  if(body!==undefined)headers['Content-Type']='application/json';
  if(staff){
    headers['x-spike-role']='cashier';
    headers['x-spike-test-token']=process.env.TUSCANINI_STUDIO_BRIDGE_TOKEN!;
  }
  const response=await fetch(origin+path,{method:body===undefined?'GET':'POST',headers,
    body:body===undefined?undefined:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(10000)});
  let reply:Record<string,unknown>;
  try{reply=await response.json() as Record<string,unknown>;}catch{throw Error('Staging orders engine returned non-JSON.');}
  if(!response.ok)throw new StudioMenuError(typeof reply.error==='string'?reply.error:'Staging order failed.',response.status);
  return reply;
}
export class StudioMenuError extends Error{
 constructor(message:string,public status:number){super(message);}
}
async function ensureSynced(){
  if(Date.now()-syncedAt<60_000)return;
  if(!syncing){
    syncing=(async()=>{
      const products=catalog();
      const reply=await call('/api/studio/catalog/sync',{products},true);
      if(reply.count!==products.length)throw new Error('Staging menu import incomplete.');
      syncedAt=Date.now();
    })().finally(()=>{syncing=null;});
  }
  await syncing;
}
export async function submitStagedRebirthOrder(
  requestKey:string,payload:ValidatedOrderPayload,
):Promise<{id:string;subtotal_cents:string}>{
  if(!/^studio-[a-z0-9-]{12,70}$/i.test(requestKey))throw new StudioMenuError('Invalid retry key.',400);
  // Offers are a separate business contract and must not disappear silently.
  if(payload.items.some(x=>x.kind==='offer'))throw new StudioMenuError('العروض مش مفعلة للتجربة دي لسه. شيل العرض وجرّب أصناف المنيو.',409);
  await ensureSynced();
  const items=payload.items.map(item=>{
    if(item.kind!=='product')throw Error('Product required');
    return {kind:'product' as const,productId:item.productId,sizeId:item.selectedSize?.id??null,
      addonIds:item.selectedAddons.map(a=>a.id),quantity:item.quantity,itemNotes:item.itemNotes};
  });
  const reply=await call('/api/orders/menu',{requestKey,customer:payload.customer,items,tableReference:payload.tableReference});
  if(typeof reply.id!=='string'||typeof reply.subtotal_cents!=='string')throw Error('Invalid saved staging order');
  return {id:reply.id,subtotal_cents:reply.subtotal_cents};
}
export async function getStagedRebirthTracking(orderId:string){
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId))
    throw new StudioMenuError('معرّف الطلب غير صالح.',400);
  const order=await call('/api/orders/'+orderId+'/menu-tracking');
  const status=String(order.status??'');
  const map:Record<string,string>={
    received:'جديد',accepted:'جديد',preparing:'جاري التحضير',
    ready:'جاهز للاستلام',delivered:'تم التسليم',rejected:'ملغي',
  };
  if(!map[status])throw new Error('Unknown staging state');
  return {
    orderNumber:null,reference:'#'+orderId.slice(0,8).toUpperCase(),
    status:map[status],confirmationStatus:status==='received'?'pending':status==='rejected'?'rejected':'confirmed',
    tableReference:typeof order.table_reference==='string'?order.table_reference:null,
    createdAt:String(order.created_at??''),orderType:order.order_type==='delivery'?'delivery' as const:'pickup' as const,
    totalEstimate:Number(order.subtotal_cents)/100,
  };
}
