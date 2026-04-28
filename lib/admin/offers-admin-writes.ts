import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { OfferMutationPayload } from '@/lib/admin/offers-admin-validation';

export async function createOfferOrThrow(payload: OfferMutationPayload): Promise<void> {
  const supabase = getSupabaseServerAdminClient();
  const { error } = await supabase.from('offers').insert(payload);
  if (error) throw new Error(`تعذر إنشاء العرض: ${error.message}`);
}

export async function updateOfferOrThrow(id: string, payload: OfferMutationPayload): Promise<void> {
  const supabase = getSupabaseServerAdminClient();
  const { data, error } = await supabase.from('offers').update(payload).eq('id', id).select('id').maybeSingle();
  if (error) throw new Error(`تعذر تحديث العرض: ${error.message}`);
  if (!data) throw new Error('العرض غير موجود.');
}

export async function setOfferActiveStateOrThrow(id: string, isActive: boolean): Promise<void> {
  const supabase = getSupabaseServerAdminClient();
  const { data, error } = await supabase
    .from('offers')
    .update({ is_active: isActive })
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) throw new Error(`تعذر تعديل حالة العرض: ${error.message}`);
  if (!data) throw new Error('العرض غير موجود.');
}
