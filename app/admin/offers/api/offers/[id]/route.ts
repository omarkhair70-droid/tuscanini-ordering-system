import { NextResponse } from 'next/server';

import { parseOfferMutationPayloadOrThrow, validateOfferIdOrThrow } from '@/lib/admin/offers-admin-validation';
import { setOfferActiveStateOrThrow, updateOfferOrThrow } from '@/lib/admin/offers-admin-writes';

function redirectWithMessage(request: Request, message: string, isError: boolean): URL {
  const url = new URL('/admin/offers', request.url);
  url.searchParams.set(isError ? 'action_error' : 'action_success', message);
  return url;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    validateOfferIdOrThrow(id);
    const form = await request.formData();
    const intent = String(form.get('intent') ?? 'update');

    if (intent === 'toggle') {
      const isActive = form.get('is_active') === 'true';
      await setOfferActiveStateOrThrow(id, isActive);
      return NextResponse.redirect(redirectWithMessage(request, isActive ? 'تم تفعيل العرض.' : 'تم إلغاء تفعيل العرض.', false));
    }

    const payload = parseOfferMutationPayloadOrThrow({
      title_ar: form.get('title_ar'),
      description_ar: form.get('description_ar'),
      badge_ar: form.get('badge_ar'),
      offer_price: form.get('offer_price'),
      price_text: form.get('price_text'),
      starts_at: form.get('starts_at'),
      ends_at: form.get('ends_at'),
      sort_order: form.get('sort_order'),
      is_active: form.get('is_active') === 'true',
    });

    await updateOfferOrThrow(id, payload);
    return NextResponse.redirect(redirectWithMessage(request, 'تم حفظ العرض بنجاح.', false));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر تنفيذ العملية على العرض.';
    return NextResponse.redirect(redirectWithMessage(request, message, true));
  }
}
