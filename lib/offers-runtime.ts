import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import {nativeContentEnabled,fetchNativePublicOffers} from '@/lib/oracle-order-api';
import type { PublicOffer } from '@/types/offers';

type OfferRow = {
  id: string;
  title_ar: string;
  description_ar: string | null;
  badge_ar: string | null;
  price_text: string | null;
  offer_price: number | string | null;
  starts_at: string | null;
  ends_at: string | null;
};

const toNumber = (value: number | string | null): number | null => {
  if (value === null) return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function mapOffer(row: OfferRow): PublicOffer {
  return {
    id: row.id,
    titleAr: row.title_ar,
    descriptionAr: row.description_ar,
    badgeAr: row.badge_ar,
    priceText: row.price_text,
    offerPrice: toNumber(row.offer_price),
  };
}

function isOfferInActiveWindow(nowMs: number, startsAt: string | null, endsAt: string | null): boolean {
  const startsMs = startsAt ? new Date(startsAt).getTime() : null;
  const endsMs = endsAt ? new Date(endsAt).getTime() : null;

  if (startsMs !== null && Number.isFinite(startsMs) && startsMs > nowMs) return false;
  if (endsMs !== null && Number.isFinite(endsMs) && endsMs <= nowMs) return false;

  return true;
}

export async function getActivePublicOffers(limit?: number, options?: { throwOnError?: boolean }): Promise<PublicOffer[]> {
  if(nativeContentEnabled()){
    try{
      const content=await fetchNativePublicOffers();
      const items=content.map(o=>{
        if(typeof o.id!=='string'||typeof o.title_ar!=='string')
          throw new Error('Invalid native offer.');
        const cents=o.offer_price_cents;
        return {
          id:o.id,titleAr:o.title_ar,
          descriptionAr:typeof o.description_ar==='string'?o.description_ar:null,
          badgeAr:typeof o.badge_ar==='string'?o.badge_ar:null,
          priceText:typeof o.price_text==='string'?o.price_text:null,
          offerPrice:typeof cents==='number'&&Number.isInteger(cents)&&cents>=0?cents/100:null,
        } satisfies PublicOffer;
      });
      return typeof limit==='number'&&limit>0?items.slice(0,limit):items;
    }catch(error){
      if(options?.throwOnError)throw error;
      return [];
    }
  }
  const supabase = getSupabaseServerAdminClient();
  const { data, error } = await supabase
    .from('offers')
    .select('id, title_ar, description_ar, badge_ar, price_text, offer_price, starts_at, ends_at')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    // Editorial Offers page must distinguish a failed live data read from
    // a genuinely empty list. Other legacy callers retain their fallback.
    if (options?.throwOnError) throw new Error('Failed to verify active restaurant offers');
    return [];
  }

  const nowMs = Date.now();
  const filtered = ((data ?? []) as OfferRow[])
    .filter((row) => isOfferInActiveWindow(nowMs, row.starts_at, row.ends_at))
    .map(mapOffer);

  if (typeof limit === 'number' && limit > 0) {
    return filtered.slice(0, limit);
  }

  return filtered;
}
