import type { Pool } from 'pg';

/** Protected, first-party content persistence; never reachable without the
 * existing server-to-server service key. No cross-system credentials here. */
export class ContentError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name='ContentError';
  }
}
type NativeSiteSettings = {
  is_ordering_open:boolean;
  whatsapp_order_number:string;
  phone_primary:string;
  phone_secondary:string|null;
  address_ar:string;
  facebook_url:string|null;
  updated_at:string;
};
type NativeOffer = {
  id:string;title_ar:string;description_ar:string|null;badge_ar:string|null;
  price_text:string|null;offer_price_cents:number|null;is_active:boolean;
  sort_order:number;starts_at:string|null;ends_at:string|null;
  created_at:string;updated_at:string;
};
const own=(obj:Record<string,unknown>,key:string)=>Object.prototype.hasOwnProperty.call(obj,key);
const object=(value:unknown):Record<string,unknown>=>{
  if(!value||typeof value!=='object'||Array.isArray(value))
    throw new ContentError('Expected JSON object.',400);
  return value as Record<string,unknown>;
};
function strict(input:Record<string,unknown>,keys:readonly string[]) {
  if(Object.keys(input).some(key=>!keys.includes(key)) || keys.some(key=>!own(input,key)))
    throw new ContentError('Incorrect field set.',400);
}
function required(raw:unknown,max:number):string{
  if(typeof raw!=='string'||!raw.trim()||raw.trim().length>max)
    throw new ContentError('Invalid required text.',400);
  return raw.trim();
}
function optional(raw:unknown,max:number):string|null{
  if(raw===null||raw==='')return null;
  if(typeof raw!=='string'||raw.trim().length>max)
    throw new ContentError('Invalid optional text.',400);
  return raw.trim()||null;
}
function phone(raw:unknown,needed:boolean):string|null{
  const normalized=typeof raw==='string'?raw.replace(/\D/g,''):raw;
  if((raw===null||raw==='')&&!needed)return null;
  if(typeof normalized!=='string'||!/^01\d{9}$/.test(normalized))
    throw new ContentError('Invalid Egyptian mobile number.',400);
  return normalized;
}
function url(raw:unknown):string|null{
  const value=optional(raw,500);
  if(!value)return null;
  let parsed:URL;
  try{parsed=new URL(value)}catch{throw new ContentError('Invalid URL.',400);}
  if(!['https:','http:'].includes(parsed.protocol)||parsed.username||parsed.password)
    throw new ContentError('Invalid public URL.',400);
  return parsed.toString();
}
const siteFields=['is_ordering_open','whatsapp_order_number','phone_primary',
  'phone_secondary','address_ar','facebook_url'] as const;
function validateSite(raw:unknown){
  const d=object(raw);
  strict(d,siteFields);
  if(typeof d.is_ordering_open!=='boolean')
    throw new ContentError('Invalid opening preference.',400);
  return {
    is_ordering_open:d.is_ordering_open,
    whatsapp_order_number:phone(d.whatsapp_order_number,true)!,
    phone_primary:phone(d.phone_primary,true)!,
    phone_secondary:phone(d.phone_secondary,false),
    address_ar:required(d.address_ar,280),
    facebook_url:url(d.facebook_url),
  };
}
export async function readNativeSiteSettings(pool:Pool):Promise<NativeSiteSettings>{
  const data=await pool.query<NativeSiteSettings>(
    'SELECT id,is_ordering_open,whatsapp_order_number,phone_primary,phone_secondary,address_ar,facebook_url,updated_at FROM tuscanini.site_settings WHERE id=1');
  if(!data.rows[0])throw new ContentError('Site settings not imported.',404);
  return data.rows[0];
}
export async function upsertNativeSiteSettings(pool:Pool,input:unknown):Promise<NativeSiteSettings>{
  const s=validateSite(input);
  await pool.query(`INSERT INTO tuscanini.site_settings
    (id,is_ordering_open,whatsapp_order_number,phone_primary,phone_secondary,address_ar,facebook_url)
    VALUES (1,$1,$2,$3,$4,$5,$6)
    ON CONFLICT (id) DO UPDATE SET
      is_ordering_open=EXCLUDED.is_ordering_open,
      whatsapp_order_number=EXCLUDED.whatsapp_order_number,
      phone_primary=EXCLUDED.phone_primary,
      phone_secondary=EXCLUDED.phone_secondary,
      address_ar=EXCLUDED.address_ar,
      facebook_url=EXCLUDED.facebook_url,
      updated_at=now()`,[
    s.is_ordering_open,s.whatsapp_order_number,s.phone_primary,
    s.phone_secondary,s.address_ar,s.facebook_url
  ]);
  return readNativeSiteSettings(pool);
}
const offerFields=['id','title_ar','description_ar','badge_ar','price_text',
  'offer_price_cents','is_active','sort_order','starts_at','ends_at'] as const;
function timestamp(input:unknown):string|null{
  if(input===null)return null;
  if(typeof input!=='string'||input.length>50||Number.isNaN(Date.parse(input)))
    throw new ContentError('Invalid offer date.',400);
  return new Date(input).toISOString();
}
function offer(raw:unknown){
  const v=object(raw);
  strict(v,offerFields);
  const id=required(v.id,80);
  if(!/^[a-zA-Z0-9_-]{4,80}$/.test(id))throw new ContentError('Invalid offer ID.',400);
  if(typeof v.is_active!=='boolean'||!Number.isSafeInteger(v.sort_order)||
    Number(v.sort_order)<0||Number(v.sort_order)>99999)
    throw new ContentError('Invalid offer state.',400);
  if(v.offer_price_cents!==null && (!Number.isSafeInteger(v.offer_price_cents)||
    Number(v.offer_price_cents)<0||Number(v.offer_price_cents)>2_000_000))
    throw new ContentError('Invalid offer price.',400);
  const starts=timestamp(v.starts_at),ends=timestamp(v.ends_at);
  if(starts&&ends&&starts>=ends)throw new ContentError('Invalid offer window.',400);
  return {
    id,title_ar:required(v.title_ar,180),description_ar:optional(v.description_ar,3000),
    badge_ar:optional(v.badge_ar,100),price_text:optional(v.price_text,200),
    offer_price_cents:v.offer_price_cents as number|null,
    is_active:v.is_active,sort_order:v.sort_order as number,
    starts_at:starts,ends_at:ends,
  };
}
/** Explicit and complete import after a verified export. It runs only when
 * CONTENT_IMPORT_ENABLED=yes and the trusted service key is presented.
 * Existing rows are not deleted: no historical offer or ID is destroyed. */
export async function importNativeOffers(pool:Pool,input:unknown):Promise<number>{
  const data=object(input);
  strict(data,['offers']);
  if(!Array.isArray(data.offers)||data.offers.length>200)
    throw new ContentError('Invalid offer import size.',400);
  const offers=data.offers.map(offer);
  if(new Set(offers.map(v=>v.id)).size!==offers.length)
    throw new ContentError('Duplicate offer ID.',400);
  const client=await pool.connect();
  try {
    await client.query('BEGIN');
    for(const o of offers){
      await client.query(`INSERT INTO tuscanini.offers
        (id,title_ar,description_ar,badge_ar,price_text,offer_price_cents,
         is_active,sort_order,starts_at,ends_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (id) DO UPDATE SET
          title_ar=EXCLUDED.title_ar,description_ar=EXCLUDED.description_ar,
          badge_ar=EXCLUDED.badge_ar,price_text=EXCLUDED.price_text,
          offer_price_cents=EXCLUDED.offer_price_cents,
          is_active=EXCLUDED.is_active,sort_order=EXCLUDED.sort_order,
          starts_at=EXCLUDED.starts_at,ends_at=EXCLUDED.ends_at,updated_at=now()`,[
        o.id,o.title_ar,o.description_ar,o.badge_ar,o.price_text,
        o.offer_price_cents,o.is_active,o.sort_order,o.starts_at,o.ends_at
      ]);
    }
    await client.query('COMMIT');
    return offers.length;
  }catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}
}
export async function readNativePublicOffers(pool:Pool):Promise<NativeOffer[]>{
  const data=await pool.query<NativeOffer>(`SELECT id,title_ar,description_ar,badge_ar,
    price_text,offer_price_cents,is_active,sort_order,starts_at,ends_at,created_at,updated_at
    FROM tuscanini.offers WHERE is_active=TRUE
      AND (starts_at IS NULL OR starts_at<=now())
      AND (ends_at IS NULL OR ends_at>now())
    ORDER BY sort_order ASC,created_at DESC,id ASC LIMIT 200`);
  return data.rows;
}
export async function readNativeContentStatus(pool:Pool){
  const result=await pool.query<{
    settings_ready:boolean;total_offers:number;active_offers:number
  }>(`SELECT EXISTS(SELECT 1 FROM tuscanini.site_settings WHERE id=1) AS settings_ready,
    (SELECT count(*)::int FROM tuscanini.offers) AS total_offers,
    (SELECT count(*)::int FROM tuscanini.offers WHERE is_active=TRUE
      AND (starts_at IS NULL OR starts_at<=now()) AND (ends_at IS NULL OR ends_at>now()))
      AS active_offers`);
  return result.rows[0];
}
