import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { AdminOffer } from '@/types/offers';
import {nativeContentEnabled,callNativeContentAdmin} from '@/lib/oracle-order-api';

type OfferRow = {
  id: string;
  title_ar: string;
  description_ar: string | null;
  badge_ar: string | null;
  price_text: string | null;
  offer_price: number | string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

type OfferStatsRow = { offer_id: string | null; quantity: number; line_total: number | string; orders?: { created_at: string }[] };

const toNumber = (value: number | string | null | undefined): number => {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

function mapOffer(row: OfferRow): AdminOffer {
  return {
    id: row.id,
    titleAr: row.title_ar,
    descriptionAr: row.description_ar,
    badgeAr: row.badge_ar,
    priceText: row.price_text,
    offerPrice: row.offer_price === null ? null : toNumber(row.offer_price),
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAdminOffersOrThrow(): Promise<AdminOffer[]> {
  if(nativeContentEnabled()){
    const response=await callNativeContentAdmin('offers');
    if(!Array.isArray(response.offers))throw new Error('تعذرت قراءة عروض المطعم.');
    return response.offers.map(raw=>{
      const row=raw as Record<string,unknown>;
      if(typeof row.id!=='string'||typeof row.title_ar!=='string'||
         typeof row.is_active!=='boolean')
        throw new Error('عرض غير صالح في قاعدة بيانات المطعم.');
      const cents=row.offer_price_cents;
      const money=typeof cents==='number'&&Number.isInteger(cents)&&cents>=0?cents/100:null;
      return {
        id:row.id,titleAr:row.title_ar,
        descriptionAr:typeof row.description_ar==='string'?row.description_ar:null,
        badgeAr:typeof row.badge_ar==='string'?row.badge_ar:null,
        priceText:typeof row.price_text==='string'?row.price_text:null,
        offerPrice:money,startsAt:typeof row.starts_at==='string'?row.starts_at:null,
        endsAt:typeof row.ends_at==='string'?row.ends_at:null,
        isActive:row.is_active,sortOrder:typeof row.sort_order==='number'?row.sort_order:0,
        createdAt:String(row.created_at??''),updatedAt:String(row.updated_at??''),
        // The Oracle ordering engine currently rejects purchasable offer cart
        // lines, so do not invent corresponding sales records.
        soldToday:0,salesToday:0,totalSold:0,
      } satisfies AdminOffer;
    });
  }
  const supabase = getSupabaseServerAdminClient();
  const { data, error } = await supabase
    .from('offers')
    .select('id, title_ar, description_ar, badge_ar, price_text, offer_price, starts_at, ends_at, is_active, sort_order, created_at, updated_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error) throw new Error(`تعذر تحميل العروض: ${error.message}`);

  const offers = ((data ?? []) as OfferRow[]).map(mapOffer);
  const start = new Date(); start.setUTCHours(0,0,0,0);
  const end = new Date(start); end.setUTCDate(end.getUTCDate()+1);

  const { data: todayRows } = await supabase.from('order_items').select('offer_id, quantity, line_total, orders!inner(created_at)').eq('line_type', 'offer').gte('orders.created_at', start.toISOString()).lt('orders.created_at', end.toISOString());
  const { data: totalRows } = await supabase.from('order_items').select('offer_id, quantity, line_total').eq('line_type', 'offer');

  return offers.map((offer) => {
    const today = ((todayRows ?? []) as OfferStatsRow[]).filter((row) => row.offer_id === offer.id);
    const all = ((totalRows ?? []) as OfferStatsRow[]).filter((row) => row.offer_id === offer.id);
    return {
      ...offer,
      soldToday: today.reduce((s, r) => s + r.quantity, 0),
      salesToday: today.reduce((s, r) => s + toNumber(r.line_total), 0),
      totalSold: all.reduce((s, r) => s + r.quantity, 0),
    };
  });
}
