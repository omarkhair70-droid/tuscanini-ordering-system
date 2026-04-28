import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { AdminOffer } from '@/types/offers';

type OfferRow = {
  id: string;
  title_ar: string;
  description_ar: string | null;
  badge_ar: string | null;
  price_text: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

function mapOffer(row: OfferRow): AdminOffer {
  return {
    id: row.id,
    titleAr: row.title_ar,
    descriptionAr: row.description_ar,
    badgeAr: row.badge_ar,
    priceText: row.price_text,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAdminOffersOrThrow(): Promise<AdminOffer[]> {
  const supabase = getSupabaseServerAdminClient();
  const { data, error } = await supabase
    .from('offers')
    .select('id, title_ar, description_ar, badge_ar, price_text, starts_at, ends_at, is_active, sort_order, created_at, updated_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw new Error(`تعذر تحميل العروض: ${error.message}`);

  return ((data ?? []) as OfferRow[]).map(mapOffer);
}
