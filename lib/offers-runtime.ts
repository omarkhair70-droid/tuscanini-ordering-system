import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { PublicOffer } from '@/types/offers';

type OfferRow = {
  id: string;
  title_ar: string;
  description_ar: string | null;
  badge_ar: string | null;
  price_text: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

function mapOffer(row: OfferRow): PublicOffer {
  return {
    id: row.id,
    titleAr: row.title_ar,
    descriptionAr: row.description_ar,
    badgeAr: row.badge_ar,
    priceText: row.price_text,
  };
}

function isOfferInActiveWindow(nowMs: number, startsAt: string | null, endsAt: string | null): boolean {
  const startsMs = startsAt ? new Date(startsAt).getTime() : null;
  const endsMs = endsAt ? new Date(endsAt).getTime() : null;

  if (startsMs !== null && Number.isFinite(startsMs) && startsMs > nowMs) return false;
  if (endsMs !== null && Number.isFinite(endsMs) && endsMs <= nowMs) return false;

  return true;
}

export async function getActivePublicOffers(limit?: number): Promise<PublicOffer[]> {
  const supabase = getSupabaseServerAdminClient();
  const { data, error } = await supabase
    .from('offers')
    .select('id, title_ar, description_ar, badge_ar, price_text, starts_at, ends_at')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
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
