import { NextResponse } from 'next/server';

import {
  parseProductPatchPayloadOrThrow,
  validateUuidOrThrow,
} from '@/lib/admin/menu-admin-validation';
import {
  updateProductAvailabilityById,
  updateProductBadgeTextById,
  updateProductBadgeVariantById,
  updateProductIsActiveById,
  updateProductPriceFromById,
} from '@/lib/admin/menu-admin-writes';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    validateUuidOrThrow(id, 'معرّف المنتج');

    const body = await request.json();
    const payload = parseProductPatchPayloadOrThrow(body);

    if (payload.field === 'availability') {
      await updateProductAvailabilityById(id, payload.value);
    } else if (payload.field === 'price_from') {
      await updateProductPriceFromById(id, payload.value);
    } else if (payload.field === 'product_badge_ar') {
      await updateProductBadgeTextById(id, payload.value);
    } else if (payload.field === 'product_badge_variant') {
      await updateProductBadgeVariantById(id, payload.value);
    } else {
      await updateProductIsActiveById(id, payload.value);
    }

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر تنفيذ تعديل المنتج.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
