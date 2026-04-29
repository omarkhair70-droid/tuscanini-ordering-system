import 'server-only';

const MAX_DESCRIPTION_LENGTH = 600;
const MAX_BADGE_LENGTH = 60;
const MAX_PRICE_TEXT_LENGTH = 60;

export type OfferMutationPayload = {
  title_ar: string;
  description_ar: string | null;
  badge_ar: string | null;
  price_text: string | null;
  offer_price: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  sort_order: number;
};

function assertObject(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('بيانات العرض غير صالحة.');
  }

  return payload as Record<string, unknown>;
}

function parseRequiredString(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${field} مطلوب.`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${field} مطلوب.`);
  }
  return trimmed;
}

function parseOptionalString(value: unknown, field: string, maxLength: number): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new Error(`${field} غير صالح.`);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.length > maxLength) {
    throw new Error(`${field} يجب ألا يزيد عن ${maxLength} حرف.`);
  }
  return trimmed;
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('حالة التفعيل يجب أن تكون قيمة منطقية.');
}

function parseSortOrder(value: unknown): number {
  const raw = typeof value === 'string' ? value.trim() : value;
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isInteger(n)) throw new Error('ترتيب العرض يجب أن يكون رقمًا صحيحًا.');
  return n;
}

function parseOptionalMoney(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' && !value.trim()) return null;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error('سعر العرض غير صالح.');
  if (!Number.isInteger(n * 100)) throw new Error('سعر العرض يجب ألا يحتوي أكثر من منزلتين عشريتين.');
  return n;
}

function parseOptionalDate(value: unknown, field: string): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') throw new Error(`${field} غير صالح.`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  if (Number.isNaN(d.getTime())) throw new Error(`${field} يجب أن يكون تاريخًا صحيحًا.`);
  return d.toISOString();
}

export function parseOfferMutationPayloadOrThrow(payload: unknown): OfferMutationPayload {
  const body = assertObject(payload);
  const titleAr = parseRequiredString(body.title_ar, 'عنوان العرض');
  const descriptionAr = parseOptionalString(body.description_ar, 'وصف العرض', MAX_DESCRIPTION_LENGTH);
  const badgeAr = parseOptionalString(body.badge_ar, 'شارة العرض', MAX_BADGE_LENGTH);
  const priceText = parseOptionalString(body.price_text, 'نص السعر', MAX_PRICE_TEXT_LENGTH);
  const offerPrice = parseOptionalMoney(body.offer_price);
  const startsAt = parseOptionalDate(body.starts_at, 'تاريخ البداية');
  const endsAt = parseOptionalDate(body.ends_at, 'تاريخ النهاية');

  if (startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    throw new Error('تاريخ النهاية يجب أن يكون بعد تاريخ البداية.');
  }

  return {
    title_ar: titleAr,
    description_ar: descriptionAr,
    badge_ar: badgeAr,
    price_text: priceText,
    offer_price: offerPrice,
    starts_at: startsAt,
    ends_at: endsAt,
    is_active: parseBoolean(body.is_active),
    sort_order: parseSortOrder(body.sort_order),
  };
}

export function validateOfferIdOrThrow(id: string): void {
  if (!/^[0-9a-fA-F-]{36}$/.test(id)) {
    throw new Error('معرّف العرض غير صالح.');
  }
}
