import 'server-only';

import type { OrderType } from '@/types/cart';

const hasMaxTwoDecimals = (value: number): boolean => Number.isInteger(value * 100);

const parseNumberOrThrow = (value: unknown, fieldLabelAr: string): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  throw new Error(`${fieldLabelAr} غير صالح.`);
};

const parseMoneyOrThrow = (value: unknown, fieldLabelAr: string): number => {
  const numeric = parseNumberOrThrow(value, fieldLabelAr);

  if (numeric < 0) {
    throw new Error(`${fieldLabelAr} يجب ألا يكون أقل من صفر.`);
  }

  if (!hasMaxTwoDecimals(numeric)) {
    throw new Error(`${fieldLabelAr} يجب ألا يحتوي أكثر من منزلتين عشريتين.`);
  }

  return numeric;
};

const assertObjectOrThrow = (payload: unknown, message = 'بيانات الطلب غير صالحة.'): Record<string, unknown> => {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    throw new Error(message);
  }

  return payload as Record<string, unknown>;
};

const parseStringOrThrow = (value: unknown, fieldLabelAr: string): string => {
  if (typeof value !== 'string') {
    throw new Error(`${fieldLabelAr} مطلوب.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldLabelAr} مطلوب.`);
  }

  return normalized;
};

const parseOptionalString = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

const normalizePhoneDigits = (rawPhone: string): string => rawPhone.replace(/\D/g, '');

const parsePhoneOrThrow = (value: unknown): string => {
  if (typeof value !== 'string') {
    throw new Error('رقم الهاتف مطلوب لإرسال الطلب.');
  }

  const digits = normalizePhoneDigits(value);
  if (!/^01\d{9}$/.test(digits)) {
    throw new Error('رقم الهاتف يجب أن يكون رقم موبايل مصري صحيح (11 رقم ويبدأ بـ 01).');
  }

  return digits;
};

const parseOrderTypeOrThrow = (value: unknown): OrderType => {
  if (value === 'delivery' || value === 'pickup') {
    return value;
  }

  throw new Error('نوع الطلب غير صالح.');
};

const parseIdStringOrThrow = (value: unknown, fieldLabelAr: string): string => {
  if (typeof value !== 'string') {
    throw new Error(`${fieldLabelAr} غير صالح.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldLabelAr} غير صالح.`);
  }

  return normalized;
};

const roundMoney = (value: number): number => Math.round(value * 100) / 100;

export type ValidatedOrderItemAddon = {
  id: string;
  label: string;
  price: number;
};

export type ValidatedOrderItemSize = {
  id: string;
  label: string;
  price: number;
};

export type ValidatedOrderItem = {
  lineId: string;
  productId: string;
  productName: string;
  selectedSize: ValidatedOrderItemSize | null;
  selectedAddons: ValidatedOrderItemAddon[];
  quantity: number;
  itemNotes: string;
  unitPrice: number;
  totalItemPrice: number;
};

export type ValidatedOrderCustomer = {
  name: string;
  phone: string;
  address: string;
  orderType: OrderType;
  generalNotes: string;
};

export type ValidatedOrderPayload = {
  customer: ValidatedOrderCustomer;
  items: ValidatedOrderItem[];
  subtotal: number;
  tableReference: string | null;
};

const TABLE_REFERENCE_MAX_LENGTH = 40;
const TABLE_REFERENCE_PATTERN = /^[\p{Script=Arabic}\p{Script=Latin}\p{Number}_\- ]+$/u;

const parseTableReferenceOrThrow = (value: unknown): string | null => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error('مرجع الطاولة غير صالح.');
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  if (normalized.length > TABLE_REFERENCE_MAX_LENGTH) {
    throw new Error(`مرجع الطاولة يجب ألا يزيد عن ${TABLE_REFERENCE_MAX_LENGTH} حرفًا.`);
  }

  if (!TABLE_REFERENCE_PATTERN.test(normalized)) {
    throw new Error('مرجع الطاولة غير صالح. المسموح: عربي/إنجليزي/أرقام/مسافات/-/_.');
  }

  return normalized;
};

const parseSelectedSizeOrThrow = (value: unknown): ValidatedOrderItemSize | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const payload = assertObjectOrThrow(value, 'بيانات الحجم غير صالحة.');

  return {
    id: parseIdStringOrThrow(payload.id, 'معرّف الحجم'),
    label: parseStringOrThrow(payload.label, 'اسم الحجم'),
    price: parseMoneyOrThrow(payload.price, 'سعر الحجم'),
  };
};

const parseSelectedAddonsOrThrow = (value: unknown): ValidatedOrderItemAddon[] => {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error('الإضافات غير صالحة.');
  }

  return value.map((addon, index) => {
    const payload = assertObjectOrThrow(addon, `بيانات الإضافة رقم ${index + 1} غير صالحة.`);

    return {
      id: parseIdStringOrThrow(payload.id, `معرّف الإضافة رقم ${index + 1}`),
      label: parseStringOrThrow(payload.label, `اسم الإضافة رقم ${index + 1}`),
      price: parseMoneyOrThrow(payload.price, `سعر الإضافة رقم ${index + 1}`),
    };
  });
};

const parseQuantityOrThrow = (value: unknown): number => {
  const numeric = parseNumberOrThrow(value, 'الكمية');
  if (!Number.isInteger(numeric) || numeric < 1) {
    throw new Error('الكمية يجب أن تكون رقمًا صحيحًا أكبر من صفر.');
  }

  return numeric;
};

const parseItemOrThrow = (value: unknown, index: number): ValidatedOrderItem => {
  const payload = assertObjectOrThrow(value, `بيانات الصنف رقم ${index + 1} غير صالحة.`);

  const lineId = typeof payload.lineId === 'string' ? payload.lineId.trim() : '';
  if (!lineId) {
    throw new Error(`lineId للصنف رقم ${index + 1} غير صالح.`);
  }

  const quantity = parseQuantityOrThrow(payload.quantity);
  const unitPrice = parseMoneyOrThrow(payload.unitPrice, `سعر الصنف رقم ${index + 1}`);
  const totalItemPrice = parseMoneyOrThrow(payload.totalItemPrice, `إجمالي الصنف رقم ${index + 1}`);

  const expectedTotal = roundMoney(unitPrice * quantity);
  if (roundMoney(totalItemPrice) !== expectedTotal) {
    throw new Error(`إجمالي الصنف رقم ${index + 1} غير متطابق مع السعر والكمية.`);
  }

  return {
    lineId,
    productId: parseIdStringOrThrow(payload.productId, `معرّف الصنف رقم ${index + 1}`),
    productName: parseStringOrThrow(payload.productName, `اسم الصنف رقم ${index + 1}`),
    selectedSize: parseSelectedSizeOrThrow(payload.selectedSize),
    selectedAddons: parseSelectedAddonsOrThrow(payload.selectedAddons),
    quantity,
    itemNotes: parseOptionalString(payload.itemNotes),
    unitPrice,
    totalItemPrice,
  };
};

export const parseCreateOrderPayloadOrThrow = (payload: unknown): ValidatedOrderPayload => {
  const body = assertObjectOrThrow(payload);
  const customerPayload = assertObjectOrThrow(body.customer, 'بيانات العميل غير صالحة.');

  const orderType = parseOrderTypeOrThrow(customerPayload.orderType);
  const name = parseStringOrThrow(customerPayload.name, 'الاسم');
  const phone = parsePhoneOrThrow(customerPayload.phone);
  const address = parseOptionalString(customerPayload.address);

  if (orderType === 'delivery' && !address) {
    throw new Error('العنوان مطلوب في حالة الدليفري.');
  }

  const itemsPayload = body.items;
  if (!Array.isArray(itemsPayload) || itemsPayload.length === 0) {
    throw new Error('السلة فارغة.');
  }

  const items = itemsPayload.map((item, index) => parseItemOrThrow(item, index));
  const providedSubtotal = parseMoneyOrThrow(body.subtotal, 'الإجمالي الفرعي');
  const tableReference = parseTableReferenceOrThrow(body.tableReference);

  const computedSubtotal = roundMoney(items.reduce((sum, item) => sum + item.totalItemPrice, 0));
  if (computedSubtotal !== roundMoney(providedSubtotal)) {
    throw new Error('الإجمالي الفرعي غير متطابق مع عناصر السلة.');
  }

  return {
    customer: {
      name,
      phone,
      address,
      orderType,
      generalNotes: parseOptionalString(customerPayload.generalNotes),
    },
    items,
    subtotal: computedSubtotal,
    tableReference,
  };
};
