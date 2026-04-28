import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type { ValidatedOrderItem } from '@/lib/orders/order-validation';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type AdminClient = ReturnType<typeof getSupabaseServerAdminClient>;

type ProductRow = {
  id: string;
};

type ProductSizeRow = {
  id: string;
  product_id: string;
};

type ProductAddonRow = {
  id: string;
};

type ProductAddonLinkRow = {
  addon_id: string;
};

export type ResolvedOrderItemIds = {
  productId: string;
  sizeId: string | null;
  addonIds: string[];
};

async function resolveProductIdOrThrow(admin: AdminClient, incomingId: string, itemIndex: number): Promise<string> {
  if (UUID_PATTERN.test(incomingId)) {
    const { data, error } = await admin.from('products').select('id').eq('id', incomingId).maybeSingle<ProductRow>();
    if (error) {
      throw new Error(error.message);
    }
    if (data?.id) {
      return data.id;
    }
  }

  const { data, error } = await admin.from('products').select('id').eq('legacy_id', incomingId).maybeSingle<ProductRow>();

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error(`معرّف الصنف رقم ${itemIndex + 1} غير صالح.`);
  }

  return data.id;
}

async function resolveSizeIdOrThrow(
  admin: AdminClient,
  incomingId: string,
  resolvedProductId: string,
  itemIndex: number,
): Promise<string> {
  let data: ProductSizeRow | null = null;

  if (UUID_PATTERN.test(incomingId)) {
    const result = await admin.from('product_sizes').select('id, product_id').eq('id', incomingId).maybeSingle<ProductSizeRow>();
    if (result.error) {
      throw new Error(result.error.message);
    }
    data = result.data;
  }

  if (!data) {
    const result = await admin
      .from('product_sizes')
      .select('id, product_id')
      .eq('legacy_id', incomingId)
      .maybeSingle<ProductSizeRow>();

    if (result.error) {
      throw new Error(result.error.message);
    }

    data = result.data;
  }

  if (!data?.id || data.product_id !== resolvedProductId) {
    throw new Error(`معرّف الحجم للصنف رقم ${itemIndex + 1} غير صالح.`);
  }

  return data.id;
}

async function resolveAddonIdOrThrow(
  admin: AdminClient,
  incomingId: string,
  resolvedProductId: string,
  itemIndex: number,
  addonIndex: number,
): Promise<string> {
  let data: ProductAddonRow | null = null;

  if (UUID_PATTERN.test(incomingId)) {
    const result = await admin.from('product_addons').select('id').eq('id', incomingId).maybeSingle<ProductAddonRow>();
    if (result.error) {
      throw new Error(result.error.message);
    }
    data = result.data;
  }

  if (!data) {
    const result = await admin.from('product_addons').select('id').eq('legacy_id', incomingId).maybeSingle<ProductAddonRow>();
    if (result.error) {
      throw new Error(result.error.message);
    }
    data = result.data;
  }

  if (!data?.id) {
    throw new Error(`معرّف الإضافة رقم ${addonIndex + 1} للصنف رقم ${itemIndex + 1} غير صالح.`);
  }

  const linkResult = await admin
    .from('product_addon_links')
    .select('addon_id')
    .eq('product_id', resolvedProductId)
    .eq('addon_id', data.id)
    .maybeSingle<ProductAddonLinkRow>();

  if (linkResult.error) {
    throw new Error(linkResult.error.message);
  }

  if (!linkResult.data?.addon_id) {
    throw new Error(`الإضافة رقم ${addonIndex + 1} للصنف رقم ${itemIndex + 1} غير صالحة.`);
  }

  return data.id;
}

export async function resolveOrderItemIdsOrThrow(
  admin: AdminClient,
  item: ValidatedOrderItem,
  itemIndex: number,
): Promise<ResolvedOrderItemIds> {
  const resolvedProductId = await resolveProductIdOrThrow(admin, item.productId, itemIndex);

  const resolvedSizeId = item.selectedSize
    ? await resolveSizeIdOrThrow(admin, item.selectedSize.id, resolvedProductId, itemIndex)
    : null;

  const resolvedAddonIds: string[] = [];
  for (let addonIndex = 0; addonIndex < item.selectedAddons.length; addonIndex += 1) {
    const addon = item.selectedAddons[addonIndex];
    const resolvedAddonId = await resolveAddonIdOrThrow(admin, addon.id, resolvedProductId, itemIndex, addonIndex);
    resolvedAddonIds.push(resolvedAddonId);
  }

  return {
    productId: resolvedProductId,
    sizeId: resolvedSizeId,
    addonIds: resolvedAddonIds,
  };
}
