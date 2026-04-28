import { NextResponse } from 'next/server';

import { parseOfferMutationPayloadOrThrow } from '@/lib/admin/offers-admin-validation';
import { createOfferOrThrow } from '@/lib/admin/offers-admin-writes';

function redirectWithMessage(request: Request, message: string, isError: boolean): URL {
  const url = new URL('/admin/offers', request.url);
  url.searchParams.set(isError ? 'action_error' : 'action_success', message);
  return url;
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const payload = parseOfferMutationPayloadOrThrow({
      title_ar: form.get('title_ar'),
      description_ar: form.get('description_ar'),
      badge_ar: form.get('badge_ar'),
      price_text: form.get('price_text'),
      starts_at: form.get('starts_at'),
      ends_at: form.get('ends_at'),
      sort_order: form.get('sort_order'),
      is_active: form.get('is_active') === 'true',
    });

    await createOfferOrThrow(payload);
    return NextResponse.redirect(redirectWithMessage(request, 'تم إنشاء العرض بنجاح.', false));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر إنشاء العرض.';
    return NextResponse.redirect(redirectWithMessage(request, message, true));
  }
}
