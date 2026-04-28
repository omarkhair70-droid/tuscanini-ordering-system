import 'server-only';

const SETTINGS_PATCH_KEYS = [
  'is_ordering_open',
  'whatsapp_order_number',
  'phone_primary',
  'phone_secondary',
  'address_ar',
  'facebook_url',
] as const;

type SettingsPatchKey = (typeof SETTINGS_PATCH_KEYS)[number];

const MAX_ADDRESS_LENGTH = 280;

export type SiteSettingsUpdatePayload = {
  is_ordering_open: boolean;
  whatsapp_order_number: string;
  phone_primary: string;
  phone_secondary: string | null;
  address_ar: string;
  facebook_url: string | null;
};

function assertObjectPayload(payload: unknown): Record<string, unknown> {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('بيانات الإعدادات غير صالحة.');
  }

  return payload as Record<string, unknown>;
}

function normalizeEgyptianMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '');

  if (digits.startsWith('0020')) {
    return `0${digits.slice(4)}`;
  }

  if (digits.startsWith('20')) {
    return `0${digits.slice(2)}`;
  }

  return digits;
}

function parseRequiredEgyptianMobileOrThrow(value: unknown, fieldLabelAr: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldLabelAr} مطلوب.`);
  }

  const normalized = normalizeEgyptianMobile(value.trim());
  if (!/^01\d{9}$/.test(normalized)) {
    throw new Error(`${fieldLabelAr} يجب أن يكون رقم موبايل مصري صحيح (11 رقم ويبدأ بـ 01).`);
  }

  return normalized;
}

function parseOptionalEgyptianMobileOrThrow(value: unknown, fieldLabelAr: string): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error(`${fieldLabelAr} غير صالح.`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = normalizeEgyptianMobile(trimmed);
  if (!/^01\d{9}$/.test(normalized)) {
    throw new Error(`${fieldLabelAr} يجب أن يكون رقم موبايل مصري صحيح (11 رقم ويبدأ بـ 01).`);
  }

  return normalized;
}

function parseBooleanOnlyOrThrow(value: unknown, fieldLabelAr: string): boolean {
  if (typeof value !== 'boolean') {
    throw new Error(`${fieldLabelAr} يجب أن تكون قيمة منطقية.`);
  }

  return value;
}

function parseRequiredTrimmedStringOrThrow(value: unknown, fieldLabelAr: string, maxLength?: number): string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldLabelAr} مطلوب.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldLabelAr} مطلوب.`);
  }

  if (typeof maxLength === 'number' && normalized.length > maxLength) {
    throw new Error(`${fieldLabelAr} يجب ألا يزيد عن ${maxLength} حرف.`);
  }

  return normalized;
}

function parseOptionalHttpUrlOrThrow(value: unknown, fieldLabelAr: string): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error(`${fieldLabelAr} غير صالح.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`${fieldLabelAr} يجب أن يكون رابطًا صحيحًا.`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${fieldLabelAr} يجب أن يبدأ بـ http أو https.`);
  }

  return parsed.toString();
}

export function parseSiteSettingsUpdatePayloadOrThrow(payload: unknown): SiteSettingsUpdatePayload {
  const body = assertObjectPayload(payload);

  const bodyKeys = Object.keys(body);
  const hasUnknownKey = bodyKeys.some((key) => !SETTINGS_PATCH_KEYS.includes(key as SettingsPatchKey));
  if (hasUnknownKey) {
    throw new Error('يوجد حقل غير مسموح به داخل طلب تعديل الإعدادات.');
  }

  for (const key of SETTINGS_PATCH_KEYS) {
    if (!(key in body)) {
      throw new Error(`الحقل ${key} مطلوب.`);
    }
  }

  return {
    is_ordering_open: parseBooleanOnlyOrThrow(body.is_ordering_open, 'حالة استقبال الطلبات'),
    whatsapp_order_number: parseRequiredEgyptianMobileOrThrow(body.whatsapp_order_number, 'رقم واتساب الطلبات'),
    phone_primary: parseRequiredEgyptianMobileOrThrow(body.phone_primary, 'رقم الهاتف الأساسي'),
    phone_secondary: parseOptionalEgyptianMobileOrThrow(body.phone_secondary, 'رقم الهاتف الثانوي'),
    address_ar: parseRequiredTrimmedStringOrThrow(body.address_ar, 'العنوان', MAX_ADDRESS_LENGTH),
    facebook_url: parseOptionalHttpUrlOrThrow(body.facebook_url, 'رابط فيسبوك'),
  };
}
