import 'server-only';

export type ProductAvailability = 'available' | 'limited' | 'unavailable';
export type ProductBadgeVariant = 'default' | 'new' | 'popular' | 'recommended' | 'spicy' | 'offer' | 'limited';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PRODUCT_PATCH_KEYS = ['availability', 'price_from', 'is_active', 'product_badge_ar', 'product_badge_variant'] as const;

type ProductPatchKey = (typeof PRODUCT_PATCH_KEYS)[number];

export type ProductPatchPayload =
  | { field: 'availability'; value: ProductAvailability }
  | { field: 'price_from'; value: number }
  | { field: 'is_active'; value: boolean }
  | { field: 'product_badge_ar'; value: string | null }
  | { field: 'product_badge_variant'; value: ProductBadgeVariant | null };

export function isValidUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function validateUuidOrThrow(value: string, labelAr: string): void {
  if (!isValidUuid(value)) {
    throw new Error(`${labelAr} غير صالح.`);
  }
}

export function parseAvailabilityOrThrow(value: unknown): ProductAvailability {
  if (value === 'available' || value === 'limited' || value === 'unavailable') {
    return value;
  }

  throw new Error('قيمة التوفر غير مسموح بها.');
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new Error('السعر يجب أن يكون رقمًا صالحًا.');
}

function hasMaxTwoDecimals(value: number): boolean {
  return Number.isInteger(value * 100);
}

export function parsePriceOrThrow(value: unknown, fieldLabelAr: string): number {
  const numeric = parseNumber(value);

  if (numeric < 0) {
    throw new Error(`${fieldLabelAr} يجب ألا يكون أقل من صفر.`);
  }

  if (!hasMaxTwoDecimals(numeric)) {
    throw new Error(`${fieldLabelAr} يجب ألا يحتوي أكثر من منزلتين عشريتين.`);
  }

  return numeric;
}

export function parseBooleanOrThrow(value: unknown, fieldLabelAr: string): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`${fieldLabelAr} يجب أن تكون قيمة منطقية.`);
}

export function parseBadgeTextOrThrow(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error('نص الشارة يجب أن يكون نصًا صالحًا.');
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.length > 40) {
    throw new Error('نص الشارة يجب ألا يتجاوز 40 حرفًا.');
  }

  return trimmed;
}

export function parseBadgeVariantOrThrow(value: unknown): ProductBadgeVariant | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  if (
    value === 'default' ||
    value === 'new' ||
    value === 'popular' ||
    value === 'recommended' ||
    value === 'spicy' ||
    value === 'offer' ||
    value === 'limited'
  ) {
    return value;
  }

  throw new Error('نوع الشارة غير مسموح به.');
}

function assertObjectPayload(payload: unknown): Record<string, unknown> {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error('بيانات الطلب غير صالحة.');
  }

  return payload as Record<string, unknown>;
}

export function parseProductPatchPayloadOrThrow(payload: unknown): ProductPatchPayload {
  const body = assertObjectPayload(payload);
  const bodyKeys = Object.keys(body);
  const hasUnknownKey = bodyKeys.some((key) => !PRODUCT_PATCH_KEYS.includes(key as ProductPatchKey));
  if (hasUnknownKey) {
    throw new Error('الحقل المطلوب تعديله غير مسموح به.');
  }

  const keys = bodyKeys.filter((key): key is ProductPatchKey => PRODUCT_PATCH_KEYS.includes(key as ProductPatchKey));

  if (keys.length !== 1) {
    throw new Error('يجب إرسال حقل واحد فقط للتعديل في كل طلب.');
  }

  const key = keys[0];

  if (key === 'availability') {
    return {
      field: 'availability',
      value: parseAvailabilityOrThrow(body.availability),
    };
  }

  if (key === 'price_from') {
    return {
      field: 'price_from',
      value: parsePriceOrThrow(body.price_from, 'السعر يبدأ من'),
    };
  }

  if (key === 'product_badge_ar') {
    return {
      field: 'product_badge_ar',
      value: parseBadgeTextOrThrow(body.product_badge_ar),
    };
  }

  if (key === 'product_badge_variant') {
    return {
      field: 'product_badge_variant',
      value: parseBadgeVariantOrThrow(body.product_badge_variant),
    };
  }

  return {
    field: 'is_active',
    value: parseBooleanOrThrow(body.is_active, 'حالة التفعيل'),
  };
}
