import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { ValidatedOrderItem } from '@/lib/orders/order-validation';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type AdminClient = ReturnType<typeof getSupabaseServerAdminClient>;

export type ResolvedOrderItemIds =
  | {
      kind: 'product';
      productId: string;
      productName: string;
      sizeId: string | null;
      sizeLabel: string | null;
      addonIds: string[];
      addons: { id: string; label: string; price: number }[];
      unitPrice: number;
    }
  | { kind: 'offer'; offerId: string; offerTitle: string; offerPrice: number; unitPrice: number };

function money(value: unknown, subject: string): number {
  const numberValue = Number(value);
  if (value === null || value === undefined || !Number.isFinite(numberValue) || numberValue < 0) {
    throw new Error(`السعر الحالي ل${subject} غير صالح.`);
  }
  return Math.round(numberValue * 100) / 100;
}
function toCents(value: number): number { return Math.round(value * 100); }
function samePrice(left: number, right: number): boolean { return toCents(left) === toCents(right); }
function lookupField(id: string) { return UUID_PATTERN.test(id) ? 'id' : 'legacy_id'; }

async function resolveProductId(admin: AdminClient, incomingId: string, index: number): Promise<string> {
  const { data, error } = await admin.from('products').select('id').eq(lookupField(incomingId), incomingId).maybeSingle();
  if (error || !data?.id) throw new Error(`الصنف رقم ${index + 1} غير موجود في المنيو الحالي.`);
  return data.id;
}

async function resolveOffer(admin: AdminClient, item: Extract<ValidatedOrderItem, {kind:'offer'}>, index: number): Promise<ResolvedOrderItemIds> {
  const { data, error } = await admin.from('offers')
    .select('id, title_ar, offer_price, is_active, starts_at, ends_at')
    .eq('id', item.offerId).maybeSingle();
  if (error || !data) throw new Error(`العرض رقم ${index + 1} غير متاح.`);
  const now = Date.now();
  const starts = data.starts_at ? new Date(data.starts_at).getTime() : null;
  const ends = data.ends_at ? new Date(data.ends_at).getTime() : null;
  if (!data.is_active || (starts !== null && starts > now) || (ends !== null && ends <= now)) {
    throw new Error('العرض مش متاح للطلب حاليًا.');
  }
  const offerPrice = money(data.offer_price, 'العرض');
  if (!samePrice(item.unitPrice, offerPrice)) {
    throw new Error('سعر العرض اتغير. برجاء تحديث السلة ومراجعة الإجمالي.');
  }
  return { kind: 'offer', offerId: data.id, offerTitle: data.title_ar, offerPrice, unitPrice: offerPrice };
}

/**
 * Trust item IDs from the client only as search keys, NEVER as authority over
 * unit price, product name, size or addon price. Recompute every unit price
 * against the active database rows prior to order creation.
 */
export async function resolveOrderItemIdsOrThrow(
  admin: AdminClient,
  item: ValidatedOrderItem,
  itemIndex: number,
): Promise<ResolvedOrderItemIds> {
  if (item.kind === 'offer') return resolveOffer(admin, item, itemIndex);

  const productId = await resolveProductId(admin, item.productId, itemIndex);
  const { data: product, error: productError } = await admin.from('products')
    .select('id, name_ar, base_price, price_from, availability, is_active')
    .eq('id', productId).maybeSingle();
  if (productError || !product?.id || !product.is_active || product.availability === 'unavailable') {
    throw new Error(`الصنف رقم ${itemIndex + 1} مش متاح حاليًا.`);
  }
  const { data: activeSizes, error: sizeListError } = await admin.from('product_sizes')
    .select('id').eq('product_id', productId).eq('is_active', true).limit(1);
  if (sizeListError) throw new Error('تعذر التحقق من أحجام المنتج.');
  if ((activeSizes?.length ?? 0) > 0 && !item.selectedSize) {
    throw new Error(`اختر حجم الصنف رقم ${itemIndex + 1}.`);
  }

  let sizeId: string | null = null;
  let sizeLabel: string | null = null;
  let basePrice: number;
  if (item.selectedSize) {
    const { data: size, error: sizeError } = await admin.from('product_sizes')
      .select('id, label_ar, price, product_id, is_active')
      .eq(lookupField(item.selectedSize.id), item.selectedSize.id).maybeSingle();
    if (sizeError || !size || size.product_id !== productId || !size.is_active) {
      throw new Error(`الحجم المحدد للصنف رقم ${itemIndex + 1} مش متاح.`);
    }
    sizeId = size.id;
    sizeLabel = size.label_ar;
    basePrice = money(size.price, 'الحجم');
  } else {
    basePrice = money(product.base_price ?? product.price_from, 'الصنف');
  }

  const addons: { id: string; label: string; price: number }[] = [];
  const seen = new Set<string>();
  for (let addonIndex = 0; addonIndex < item.selectedAddons.length; addonIndex += 1) {
    const addon = item.selectedAddons[addonIndex];
    const { data, error } = await admin.from('product_addons')
      .select('id, label_ar, price, is_active')
      .eq(lookupField(addon.id), addon.id).maybeSingle();
    if (error || !data?.id || !data.is_active || seen.has(data.id)) {
      throw new Error(`الإضافة رقم ${addonIndex + 1} غير صالحة للصنف رقم ${itemIndex + 1}.`);
    }
    const link = await admin.from('product_addon_links')
      .select('addon_id').eq('product_id', productId).eq('addon_id', data.id).maybeSingle();
    if (link.error || !link.data?.addon_id) throw new Error('الإضافة مش متاحة للمنتج المحدد.');
    seen.add(data.id);
    addons.push({ id: data.id, label: data.label_ar, price: money(data.price, 'الإضافة') });
  }
  const unitPrice = Math.round((basePrice + addons.reduce((sum,x)=>sum+x.price,0)) * 100) / 100;
  if (!samePrice(item.unitPrice, unitPrice)) {
    throw new Error('سعر أحد المنتجات اتغير. برجاء تحديث السلة قبل إرسال الطلب.');
  }
  return { kind: 'product', productId, productName: product.name_ar, sizeId, sizeLabel,
    addonIds: addons.map(x=>x.id), addons, unitPrice };
}
