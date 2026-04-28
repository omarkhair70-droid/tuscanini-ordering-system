import { NextResponse } from 'next/server';

import { parsePriceOrThrow, validateUuidOrThrow } from '@/lib/admin/menu-admin-validation';
import { updateProductSizePriceById } from '@/lib/admin/menu-admin-writes';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    validateUuidOrThrow(id, 'معرّف الحجم');

    const body = (await request.json()) as { price?: unknown };
    const price = parsePriceOrThrow(body.price, 'سعر الحجم');

    await updateProductSizePriceById(id, price);

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر تنفيذ تعديل سعر الحجم.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
