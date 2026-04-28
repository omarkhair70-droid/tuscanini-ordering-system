import type { CartCustomerForm, CartItem } from '@/types/cart';

function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `20${digits.slice(1)}`;
  }
  return digits;
}

export function buildArabicWhatsappMessage(params: {
  items: CartItem[];
  customer: CartCustomerForm;
  subtotal: number;
  orderReference?: string | null;
  tableReference?: string | null;
}): string {
  const { items, customer, subtotal, orderReference, tableReference } = params;

  const lines: string[] = ['مرحبًا توسكانيني 👋', 'هذا طلبي، برجاء التأكيد:', '', '🧾 *ملخص الطلب*'];

  if (orderReference) {
    lines.push(`🔖 *مرجع الطلب:* ${orderReference}`, '');
  }

  if (tableReference) {
    lines.push(`🪑 *الطاولة:* ${tableReference}`, '');
  }

  items.forEach((item, index) => {
    const addons = item.selectedAddons.length
      ? item.selectedAddons.map((addon) => addon.label).join('، ')
      : 'بدون إضافات';

    lines.push(
      `#${index + 1} ${item.productName}`,
      `- الحجم: ${item.selectedSize?.label ?? 'بدون اختيار'}`,
      `- الإضافات: ${addons}`,
      `- الكمية: ${item.quantity}`,
      `- ملاحظات الصنف: ${item.itemNotes || 'لا يوجد'}`,
      `- إجمالي الصنف: ${item.totalItemPrice} ج.م`,
      '',
    );
  });

  lines.push(
    `💰 *الإجمالي الفرعي:* ${subtotal} ج.م`,
    '',
    '🟡 *حالة الطلب:* في انتظار تأكيد المطعم',
    'لا يبدأ التحضير إلا بعد تأكيد الطلب مع العميل',
    '',
    '👤 *بيانات العميل*',
    `- الاسم: ${customer.name || 'غير مذكور'}`,
    `- الهاتف: ${customer.phone || 'غير مذكور'}`,
    `- نوع الطلب: ${customer.orderType === 'delivery' ? 'دليفري' : 'استلام من الفرع'}`,
    `- العنوان: ${customer.orderType === 'delivery' ? customer.address || 'غير مذكور' : 'غير مطلوب (استلام)'}`,
    `- ملاحظات عامة: ${customer.generalNotes || 'لا يوجد'}`,
    '',
    'شكرًا لكم 🌹',
  );

  return lines.join('\n').trim();
}

export function buildWhatsappOrderUrl(message: string, whatsappOrderNumber: string): string {
  const phone = normalizeWhatsappNumber(whatsappOrderNumber);
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}

export function buildWhatsappFollowupMessage(reference: string, tableReference?: string | null): string {
  const lines = [`مرحبًا، أريد متابعة الطلب رقم ${reference}`];

  if (tableReference) {
    lines.push(`مرجع الطاولة: ${tableReference}`);
  }

  return lines.join('\n');
}
