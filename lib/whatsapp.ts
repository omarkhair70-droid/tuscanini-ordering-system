import { siteConfig } from '@/lib/site-config';
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
}): string {
  const { items, customer, subtotal } = params;

  const lines: string[] = [
    'مرحبًا توسكانيني 👋',
    'عايز أطلب الأوردر التالي:',
    '',
    '🧾 *تفاصيل الطلب*',
  ];

  items.forEach((item, index) => {
    const addons = item.selectedAddons.length
      ? item.selectedAddons.map((addon) => addon.label).join('، ')
      : 'بدون إضافات';

    lines.push(
      `${index + 1}) ${item.productName}`,
      `- الحجم: ${item.selectedSize?.label ?? 'بدون اختيار'}`,
      `- الإضافات: ${addons}`,
      `- الكمية: ${item.quantity}`,
      `- ملاحظات الصنف: ${item.itemNotes || 'لا يوجد'}`,
      `- سعر الصنف: ${item.totalItemPrice} ج.م`,
      '',
    );
  });

  lines.push(
    `💰 *الإجمالي الفرعي:* ${subtotal} ج.م`,
    '',
    '👤 *بيانات العميل*',
    `- الاسم: ${customer.name || 'غير مذكور'}`,
    `- الهاتف: ${customer.phone || 'غير مذكور'}`,
    `- نوع الطلب: ${customer.orderType === 'delivery' ? 'دليفري' : 'استلام من الفرع'}`,
    `- العنوان: ${customer.orderType === 'delivery' ? customer.address || 'غير مذكور' : 'غير مطلوب (استلام)'}`,
    `- ملاحظات عامة: ${customer.generalNotes || 'لا يوجد'}`,
  );

  return lines.join('\n').trim();
}

export function buildWhatsappOrderUrl(message: string): string {
  const phone = normalizeWhatsappNumber(siteConfig.whatsappOrderNumber);
  const text = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${text}`;
}
