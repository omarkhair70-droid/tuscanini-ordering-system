/** Full customer line snapshots for the disposable local Rebirth staging catalog. */
import { createHash } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { RequestKeyCollision, type RecordedOrder } from './orders.js';

type Choice={id:string;label:string;price_cents:number};
type CatalogRow={product_id:string;name:string;category_slug:string;price_from_cents:number;
  available:boolean;sizes:Choice[];addons:Choice[]};
type CreateLine={kind:'product';productId:string;sizeId:string|null;addonIds:string[];quantity:number;itemNotes:string};
type DeliveryLocation={lat:number;lng:number};
type Customer={name:string;phone:string;address:string;deliveryLocation:DeliveryLocation|null;
  orderType:'delivery'|'pickup';generalNotes:string};
export type MenuOrderPayload={requestKey:string;customer:Customer;items:CreateLine[];tableReference:string|null;expectedSubtotalCents:number};
export type MenuProductInput={
 productId:string;name:string;categorySlug:string;priceFromCents:number;available:boolean;
 sizes:Choice[];addons:Choice[];
};
function bad(message:string):never{throw new Error('Invalid menu choice: '+message)}
function short(x:unknown,max:number):x is string{return typeof x==='string'&&x.length<=max;}
function money(x:unknown):x is number{return typeof x==='number'&&Number.isSafeInteger(x)&&x>=0&&x<=2_000_000;}
function choice(x:unknown):x is Choice{
  if(!x||typeof x!=='object')return false;
  const c=x as Record<string,unknown>;
  return short(c.id,64)&&c.id.length>0&&short(c.label,100)&&c.label.length>0&&money(c.price_cents);
}
function validateCatalog(data:unknown):MenuProductInput[]{
  if(!Array.isArray(data)||data.length<1||data.length>180)bad('catalog size');
  const used=new Set<string>();
  return data.map((item:unknown)=>{
    if(!item||typeof item!=='object')bad('catalog row');
    const c=item as Record<string,unknown>;
    if(!short(c.productId,64)||!c.productId||!short(c.name,160)||!c.name||
       !short(c.categorySlug,60)||!c.categorySlug||!money(c.priceFromCents)||
       typeof c.available!=='boolean'||!Array.isArray(c.sizes)||!Array.isArray(c.addons)||
       c.sizes.length>15||c.addons.length>35||!c.sizes.every(choice)||!c.addons.every(choice)||
       used.has(c.productId))bad('catalog values');
    used.add(c.productId);
    if(new Set(c.sizes.map((v:Choice)=>v.id)).size!==c.sizes.length||
       new Set(c.addons.map((v:Choice)=>v.id)).size!==c.addons.length)bad('duplicate option id');
    return c as MenuProductInput;
  });
}
export async function syncMenuCatalog(pool:Pool,input:unknown):Promise<number>{
  const products=validateCatalog(input);
  const client=await pool.connect();
  try{
    await client.query('BEGIN');
    for(const p of products){
      await client.query(`INSERT INTO tuscanini.menu_catalog
        (product_id,name,category_slug,price_from_cents,sizes,addons,available)
        VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7)
        ON CONFLICT (product_id) DO UPDATE SET
        name=EXCLUDED.name,category_slug=EXCLUDED.category_slug,
        price_from_cents=EXCLUDED.price_from_cents,sizes=EXCLUDED.sizes,
        addons=EXCLUDED.addons,available=EXCLUDED.available`,
        [p.productId,p.name,p.categorySlug,p.priceFromCents,JSON.stringify(p.sizes),JSON.stringify(p.addons),p.available]);
    }
    await client.query('COMMIT');
    return products.length;
  }catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}
}
function parsePayload(raw:unknown):MenuOrderPayload{
  if(!raw||typeof raw!=='object'||Array.isArray(raw))bad('payload');
  const p=raw as Record<string,unknown>,customer=p.customer as Record<string,unknown>|null;
  if(!short(p.requestKey,80)||!/^studio-[a-z0-9-]{12,70}$/i.test(p.requestKey)||
    !customer||typeof customer!=='object'||
    !short(customer.name,100)||!customer.name.trim()||!short(customer.phone,20)||
    !/^01\d{9}$/.test(customer.phone)||!short(customer.address,300)||
    !short(customer.generalNotes,500)||
    (customer.orderType!=='delivery'&&customer.orderType!=='pickup')||
    (customer.orderType==='delivery'&&!customer.address.trim())||
    (p.tableReference!==null&&p.tableReference!==undefined&&!short(p.tableReference,40))||
    (!Number.isSafeInteger(p.expectedSubtotalCents)||Number(p.expectedSubtotalCents)<0||Number(p.expectedSubtotalCents)>20_000_000)||
    !Array.isArray(p.items)||p.items.length===0||p.items.length>30)bad('order contact or size');
  const lines=p.items as unknown[];
  for(const line of lines){
    if(!line||typeof line!=='object')bad('item');
    const v=line as Record<string,unknown>;
    if(v.kind!=='product'||!short(v.productId,64)||!v.productId||!Number.isInteger(v.quantity)||
       Number(v.quantity)<1||Number(v.quantity)>50||
       (v.sizeId!==null&&typeof v.sizeId!=='string')||
       (typeof v.sizeId==='string'&&v.sizeId.length>64)||
       !Array.isArray(v.addonIds)||v.addonIds.length>35||
       !v.addonIds.every(x=>typeof x==='string'&&x.length>0&&x.length<=64)||
       new Set(v.addonIds).size!==v.addonIds.length||!short(v.itemNotes,500))bad('line variant');
  }
  // The service enforces the same immutable Egypt coordinate bounds as Next
  // and stores this pair inside customer_snapshot, not just a free-text URL.
  let deliveryLocation:DeliveryLocation|null=null;
  if(customer.orderType==='delivery' && customer.deliveryLocation!==undefined &&
     customer.deliveryLocation!==null){
    if(typeof customer.deliveryLocation!=='object'||Array.isArray(customer.deliveryLocation))bad('delivery pin');
    const pin=customer.deliveryLocation as Record<string,unknown>;
    if(typeof pin.lat!=='number'||typeof pin.lng!=='number'||
       !Number.isFinite(pin.lat)||!Number.isFinite(pin.lng)||
       pin.lat<22||pin.lat>32||pin.lng<24||pin.lng>37)bad('delivery pin bounds');
    deliveryLocation={lat:Number(pin.lat.toFixed(6)),lng:Number(pin.lng.toFixed(6))};
  }
  const address=customer.orderType==='delivery'?String(customer.address).trim():'';
  return {requestKey:p.requestKey as string,customer:{
    ...(customer as Customer),address,deliveryLocation
  },items:lines as CreateLine[],tableReference:(p.tableReference as string|null)||null,
    expectedSubtotalCents:p.expectedSubtotalCents as number};
}
async function existing(pool:Pool,key:string,hash:string):Promise<RecordedOrder|null>{
  const r=await pool.query<RecordedOrder>('SELECT id,request_key,payload_sha256,status,subtotal_cents FROM tuscanini.orders WHERE request_key=$1',[key]);
  if(r.rows[0]&&r.rows[0].payload_sha256!==hash)throw new RequestKeyCollision();
  return r.rows[0]??null;
}
export async function submitMenuOrder(pool:Pool,input:unknown):Promise<RecordedOrder>{
  const order=parsePayload(input);
  // Canonical payload binds contact, notes, sizes, add-ons AND quantities to the retry key.
  const canonical={
    customer:order.customer,tableReference:order.tableReference,expectedSubtotalCents:order.expectedSubtotalCents,
    items:order.items.map(v=>({...v,addonIds:[...v.addonIds].sort()})),
  };
  const hash=createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
  const prior=await existing(pool,order.requestKey,hash);
  if(prior)return prior;
  const client:PoolClient=await pool.connect();
  try{
    await client.query('BEGIN');
    const lines=[];let total=0;
    const catalogRows=new Map<string,CatalogRow>();
    // Sorted lock order to avoid deadlocks when simultaneous multi-item orders arrive.
    for(const id of [...new Set(order.items.map(v=>v.productId))].sort()){
      const r=await client.query<CatalogRow>(
        'SELECT * FROM tuscanini.menu_catalog WHERE product_id=$1 AND available=TRUE FOR SHARE',[id]);
      const item=r.rows[0];if(!item)bad('Unavailable product '+id);
      catalogRows.set(id,item);
    }
    for(const item of order.items){
      const product=catalogRows.get(item.productId)!;
      const size=product.sizes.find(v=>v.id===item.sizeId);
      if(product.sizes.length>0&&!size)bad('Required size for '+item.productId);
      if(product.sizes.length===0&&item.sizeId!==null)bad('Unexpected size');
      const addons=item.addonIds.map(id=>{
        const addon=product.addons.find(v=>v.id===id);if(!addon)bad('Unknown addon '+id);return addon;
      });
      const unit=(size?.price_cents??product.price_from_cents)+addons.reduce((n,v)=>n+v.price_cents,0);
      const lineTotal=unit*item.quantity;total+=lineTotal;
      if(!Number.isSafeInteger(total)||total>20_000_000)bad('total overflow');
      lines.push({item,product,unit,lineTotal,selection:{size:size??null,addons,categorySlug:product.category_slug}});
    }
    // Customer confirms the amount shown in Cart. Do not persist a silently
    // higher/lower server-calculated total when the historical menu changed.
    if(total!==order.expectedSubtotalCents)bad('Cart subtotal changed; review the menu again');
    const head=await client.query<RecordedOrder>(`INSERT INTO tuscanini.orders
       (request_key,payload_sha256,status,subtotal_cents,customer_snapshot,order_type,table_reference)
       VALUES ($1,$2,'received',$3,$4::jsonb,$5,$6)
       RETURNING id,request_key,payload_sha256,status,subtotal_cents`,
       [order.requestKey,hash,total,JSON.stringify(order.customer),order.customer.orderType,order.tableReference]);
    const created=head.rows[0];if(!created)throw Error('Missing saved order');
    for(const line of lines){
      await client.query(`INSERT INTO tuscanini.order_line
        (order_id,sku_snapshot,name_snapshot,unit_price_cents,quantity,line_total_cents,
          selection_snapshot,notes_snapshot,category_snapshot)
        VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9)`,
        [created.id,line.product.product_id,line.product.name,line.unit,line.item.quantity,
          line.lineTotal,JSON.stringify(line.selection),line.item.itemNotes,line.product.category_slug]);
    }
    await client.query("INSERT INTO tuscanini.order_status_event(order_id,status,detail,actor_role,action) VALUES ($1,'received','New web order saved','system','receive')",[created.id]);
    await client.query("INSERT INTO tuscanini.outbox_event(order_id,kind,payload) VALUES ($1,'order.received',$2::jsonb)",
      [created.id,JSON.stringify({order_id:created.id,status:'received'})]);
    await client.query('COMMIT');
    return created;
  }catch(e){
    await client.query('ROLLBACK');
    if(e&&typeof e==='object'&&'code'in e&&(e as {code?:string}).code==='23505'){
      const same=await existing(pool,order.requestKey,hash);if(same)return same;
    }
    throw e;
  }finally{client.release()}
}
