import { NextResponse } from 'next/server';

import { parseSiteSettingsUpdatePayloadOrThrow } from '@/lib/admin/site-settings-validation';
import { updateSiteSettingsSingletonOrThrow } from '@/lib/admin/site-settings-writes';

type SettingsApiInput = {
  is_ordering_open?: unknown;
  whatsapp_order_number?: unknown;
  phone_primary?: unknown;
  phone_secondary?: unknown;
  address_ar?: unknown;
  facebook_url?: unknown;
};

function buildSettingsRedirectUrl(request: Request, message: string, isError: boolean): URL {
  const redirectUrl = new URL('/admin/settings', request.url);
  redirectUrl.searchParams.set(isError ? 'save_error' : 'save_success', message);
  return redirectUrl;
}

function parseBooleanInput(raw: unknown): unknown {
  if (typeof raw === 'boolean') {
    return raw;
  }

  if (raw === 'true') {
    return true;
  }

  if (raw === 'false') {
    return false;
  }

  return raw;
}

function toInputPayload(raw: SettingsApiInput): Record<string, unknown> {
  return {
    is_ordering_open: parseBooleanInput(raw.is_ordering_open),
    whatsapp_order_number: raw.whatsapp_order_number,
    phone_primary: raw.phone_primary,
    phone_secondary: raw.phone_secondary,
    address_ar: raw.address_ar,
    facebook_url: raw.facebook_url,
  };
}

async function parsePayloadFromRequest(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    const body = (await request.json()) as SettingsApiInput;
    return toInputPayload(body);
  }

  const form = await request.formData();
  return toInputPayload({
    is_ordering_open: form.get('is_ordering_open'),
    whatsapp_order_number: form.get('whatsapp_order_number'),
    phone_primary: form.get('phone_primary'),
    phone_secondary: form.get('phone_secondary'),
    address_ar: form.get('address_ar'),
    facebook_url: form.get('facebook_url'),
  });
}

export async function POST(request: Request) {
  try {
    const rawPayload = await parsePayloadFromRequest(request);
    const payload = parseSiteSettingsUpdatePayloadOrThrow(rawPayload);

    await updateSiteSettingsSingletonOrThrow(payload);

    const redirectUrl = buildSettingsRedirectUrl(request, 'تم حفظ إعدادات الموقع بنجاح.', false);
    return NextResponse.redirect(redirectUrl);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ الإعدادات الآن.';
    const redirectUrl = buildSettingsRedirectUrl(request, message, true);
    return NextResponse.redirect(redirectUrl);
  }
}

export async function PATCH(request: Request) {
  try {
    const rawPayload = await parsePayloadFromRequest(request);
    const payload = parseSiteSettingsUpdatePayloadOrThrow(rawPayload);

    await updateSiteSettingsSingletonOrThrow(payload);

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'تعذر حفظ الإعدادات الآن.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
