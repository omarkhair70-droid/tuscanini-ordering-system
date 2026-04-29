import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { ValidatedOrderItem } from '@/lib/orders/order-validation';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type AdminClient = ReturnType<typeof getSupabaseServerAdminClient>;
export type ResolvedOrderItemIds = { kind: 'product'; productId: string; sizeId: string | null; addonIds: string[] } | { kind: 'offer'; offerId: string; offerTitle: string; offerPrice: number };

async function resolveProductIdOrThrow(admin: AdminClient, incomingId: string, itemIndex: number): Promise<string> { const idField = UUID_PATTERN.test(incomingId) ? 'id' : 'legacy_id'; const { data, error } = await admin.from('products').select('id').eq(idField, incomingId).maybeSingle(); if (error || !data?.id) throw new Error(`معرّف الصنف رقم ${itemIndex + 1} غير صالح.`); return data.id; }
async function resolveSizeIdOrThrow(admin: AdminClient, incomingId: string, resolvedProductId: string, itemIndex: number): Promise<string> { const idField = UUID_PATTERN.test(incomingId) ? 'id' : 'legacy_id'; const { data, error } = await admin.from('product_sizes').select('id, product_id').eq(idField, incomingId).maybeSingle(); if (error || !data?.id || data.product_id !== resolvedProductId) throw new Error(`معرّف الحجم للصنف رقم ${itemIndex + 1} غير صالح.`); return data.id; }
async function resolveAddonIdOrThrow(admin: AdminClient, incomingId: string, resolvedProductId: string, itemIndex: number, addonIndex: number): Promise<string> { const idField = UUID_PATTERN.test(incomingId) ? 'id' : 'legacy_id'; const { data, error } = await admin.from('product_addons').select('id').eq(idField, incomingId).maybeSingle(); if (error || !data?.id) throw new Error(`معرّف الإضافة رقم ${addonIndex + 1} للصنف رقم ${itemIndex + 1} غير صالح.`); const link = await admin.from('product_addon_links').select('addon_id').eq('product_id', resolvedProductId).eq('addon_id', data.id).maybeSingle(); if (link.error || !link.data?.addon_id) throw new Error(`الإضافة رقم ${addonIndex + 1} للصنف رقم ${itemIndex + 1} غير صالحة.`); return data.id; }

async function resolveOfferOrThrow(admin: AdminClient, incomingId: string, itemIndex: number): Promise<{ offerId: string; offerTitle: string; offerPrice: number }> {
  const { data, error } = await admin.from('offers').select('id, title_ar, offer_price, is_active, starts_at, ends_at').eq('id', incomingId).maybeSingle();
  if (error || !data) throw new Error(`العرض رقم ${itemIndex + 1} غير متاح الآن.`);
  const now = Date.now();
  const starts = data.starts_at ? new Date(data.starts_at).getTime() : null;
  const ends = data.ends_at ? new Date(data.ends_at).getTime() : null;
  const activeWindow = (!starts || starts <= now) && (!ends || ends > now);
  const price = data.offer_price === null ? null : Number(data.offer_price);
  if (!data.is_active || !activeWindow || price === null || !Number.isFinite(price)) throw new Error('العرض غير متاح للطلب الآن.');
  return { offerId: data.id, offerTitle: data.title_ar, offerPrice: price };
}

export async function resolveOrderItemIdsOrThrow(admin: AdminClient, item: ValidatedOrderItem, itemIndex: number): Promise<ResolvedOrderItemIds> {
  if (item.kind === 'offer') return { kind: 'offer', ...(await resolveOfferOrThrow(admin, item.offerId, itemIndex)) };
  const resolvedProductId = await resolveProductIdOrThrow(admin, item.productId, itemIndex);
  const resolvedSizeId = item.selectedSize ? await resolveSizeIdOrThrow(admin, item.selectedSize.id, resolvedProductId, itemIndex) : null;
  const addonIds: string[] = [];
  for (let addonIndex = 0; addonIndex < item.selectedAddons.length; addonIndex += 1) addonIds.push(await resolveAddonIdOrThrow(admin, item.selectedAddons[addonIndex].id, resolvedProductId, itemIndex, addonIndex));
  return { kind: 'product', productId: resolvedProductId, sizeId: resolvedSizeId, addonIds };
}
