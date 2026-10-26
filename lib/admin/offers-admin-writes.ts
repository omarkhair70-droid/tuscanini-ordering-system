import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { OfferMutationPayload } from '@/lib/admin/offers-admin-validation';
import {nativeContentEnabled,callNativeContentAdmin} from '@/lib/oracle-order-api';

const toNativeOffer=(input:OfferMutationPayload)=>({
  title_ar:input.title_ar,description_ar:input.description_ar,
  badge_ar:input.badge_ar,price_text:input.price_text,
  offer_price_cents:input.offer_price===null?null:Math.round(input.offer_price*100),
  starts_at:input.starts_at,ends_at:input.ends_at,is_active:input.is_active,
  sort_order:input.sort_order,
});
export async function createOfferOrThrow(payload: OfferMutationPayload): Promise<void> {
  if(nativeContentEnabled()){
    await callNativeContentAdmin('offers','POST',toNativeOffer(payload));
    return;
  }
  const supabase = getSupabaseServerAdminClient();
  const { error } = await supabase.from('offers').insert(payload);
  if (error) throw new Error(`تعذر إنشاء العرض: ${error.message}`);
}

export async function updateOfferOrThrow(id: string, payload: OfferMutationPayload): Promise<void> {
  if(nativeContentEnabled()){
    await callNativeContentAdmin('offers/'+encodeURIComponent(id),'POST',toNativeOffer(payload));
    return;
  }
  const supabase = getSupabaseServerAdminClient();
  const { data, error } = await supabase.from('offers').update(payload).eq('id', id).select('id').maybeSingle();
  if (error) throw new Error(`تعذر تحديث العرض: ${error.message}`);
  if (!data) throw new Error('العرض غير موجود.');
}

export async function setOfferActiveStateOrThrow(id: string, isActive: boolean): Promise<void> {
  if(nativeContentEnabled()){
    await callNativeContentAdmin('offers/'+encodeURIComponent(id)+'/active','POST',{is_active:isActive});
    return;
  }
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
