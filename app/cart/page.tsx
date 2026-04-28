'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import { PageHero } from '@/components/shared/page-hero';
import { buildArabicWhatsappMessage, buildWhatsappOrderUrl } from '@/lib/whatsapp';

type ValidationErrors = {
  name?: string;
  phone?: string;
  address?: string;
  confirmedAccurateDetails?: string;
};

type CreateOrderApiSuccess = {
  ok: true;
  orderId: string;
  orderNumber?: number | null;
  reference?: string;
};

type CreateOrderApiFailure = {
  ok: false;
  error?: string;
};

function isValidEgyptianMobile(rawPhone: string): boolean {
  const normalized = rawPhone.replace(/\D/g, '');
  return /^01\d{9}$/.test(normalized);
}

export default function CartPage() {
  const { items, customer, subtotal, updateItemQuantity, removeItem, clearCart, updateCustomer, isHydrated } = useCart();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [persistenceWarning, setPersistenceWarning] = useState('');

  const summary = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    return {
      totalItems,
      totalLines: items.length,
    };
  }, [items]);

  function validateBeforeSend(): ValidationErrors {
    const nextErrors: ValidationErrors = {};

    if (!customer.name.trim()) {
      nextErrors.name = 'الاسم مطلوب لإرسال الطلب.';
    }

    if (!customer.phone.trim()) {
      nextErrors.phone = 'رقم الهاتف مطلوب لإرسال الطلب.';
    } else if (!isValidEgyptianMobile(customer.phone)) {
      nextErrors.phone = 'رقم الهاتف يجب أن يكون رقم موبايل مصري صحيح (11 رقم ويبدأ بـ 01).';
    }

    if (customer.orderType === 'delivery' && !customer.address.trim()) {
      nextErrors.address = 'العنوان مطلوب في حالة الدليفري.';
    }

    if (!customer.confirmedAccurateDetails) {
      nextErrors.confirmedAccurateDetails = 'لازم تأكيد صحة البيانات قبل إرسال الطلب.';
    }

    return nextErrors;
  }

  async function handleSendWhatsapp() {
    const nextErrors = validateBeforeSend();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || items.length === 0) {
      return;
    }

    setPersistenceWarning('');
    setIsSubmitting(true);

    let orderReference: string | null = null;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer,
          items,
          subtotal,
        }),
      });

      const payload = (await response.json()) as CreateOrderApiSuccess | CreateOrderApiFailure;

      if (response.ok && payload.ok) {
        orderReference = payload.reference ?? (payload.orderNumber ? `#${payload.orderNumber}` : payload.orderId);
      } else {
        setPersistenceWarning('تعذر حفظ الطلب داخل النظام الآن، سيتم المتابعة على واتساب بشكل طبيعي.');
      }
    } catch {
      setPersistenceWarning('تعذر حفظ الطلب داخل النظام الآن، سيتم المتابعة على واتساب بشكل طبيعي.');
    }

    const message = buildArabicWhatsappMessage({ items, customer, subtotal, orderReference });
    const whatsappUrl = buildWhatsappOrderUrl(message);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setIsSubmitting(false);
  }

  return (
    <div className="space-y-6">
      <PageHero title="السلة" subtitle="راجع الطلب واكمله وارسله مباشرة على واتساب." />

      {!isHydrated ? (
        <div className="rounded-2xl border-2 border-brand-dark bg-brand-white p-4 text-center font-bold">جاري تحميل السلة...</div>
      ) : null}

      {isHydrated && items.length === 0 ? (
        <section className="space-y-4 rounded-2xl border-2 border-dashed border-brand-dark bg-brand-white p-6 text-center">
          <p className="text-lg font-black text-brand-dark">السلة فارغة حاليًا.</p>
          <p className="text-sm text-brand-charcoal">أضف أصنافك أولًا من المنيو، وبعدها راجع طلبك قبل الإرسال على واتساب.</p>
          <Link href="/menu" className="btn-primary inline-flex items-center">
            ابدأ الطلب من المنيو
          </Link>
        </section>
      ) : null}

      {isHydrated && items.length > 0 ? (
        <>
          <section className="rounded-2xl border-2 border-brand-dark bg-brand-white p-4">
            <div className="mb-3 flex items-center justify-between border-b border-brand-dark/20 pb-3">
              <h2 className="text-lg font-black text-brand-dark">ملخص الطلب</h2>
              <span className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-dark">{summary.totalItems} قطعة</span>
            </div>

            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div className="rounded-xl border border-brand-dark/20 p-3">
                <p className="text-brand-charcoal">عدد الأصناف</p>
                <p className="text-base font-black">{summary.totalLines}</p>
              </div>
              <div className="rounded-xl border border-brand-dark/20 p-3">
                <p className="text-brand-charcoal">عدد القطع</p>
                <p className="text-base font-black">{summary.totalItems}</p>
              </div>
              <div className="rounded-xl border border-brand-dark/20 p-3">
                <p className="text-brand-charcoal">الإجمالي الفرعي</p>
                <p className="text-base font-black text-brand-red">{subtotal} ج.م</p>
              </div>
            </div>

            <p className="mt-3 rounded-xl bg-brand-yellow/40 px-3 py-2 text-sm font-bold text-brand-dark">راجع طلبك قبل الإرسال.</p>
            <div className="mt-3 space-y-2">
              <p className="rounded-xl border border-brand-dark/20 bg-brand-white px-3 py-2 text-sm font-bold text-brand-dark">
                الطلب لا يبدأ تحضيره إلا بعد تأكيد المطعم مع العميل.
              </p>
              <p className="rounded-xl border border-brand-dark/20 bg-brand-white px-3 py-2 text-sm font-bold text-brand-dark">
                لو الطلب دليفري، ابعت اللوكيشن على واتساب بعد إرسال الطلب.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border-2 border-brand-dark bg-brand-white p-4">
            <h2 className="text-lg font-black text-brand-dark">الأصناف</h2>

            {items.map((item) => (
              <article key={item.lineId} className="rounded-xl border-2 border-brand-dark/20 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-brand-dark">{item.productName}</h3>
                    <p className="text-xs text-brand-charcoal">الحجم: {item.selectedSize?.label ?? 'بدون اختيار'}</p>
                    <p className="text-xs text-brand-charcoal">
                      الإضافات:{' '}
                      {item.selectedAddons.length ? item.selectedAddons.map((addon) => addon.label).join('، ') : 'بدون إضافات'}
                    </p>
                    <p className="text-xs text-brand-charcoal">ملاحظات: {item.itemNotes || 'لا يوجد'}</p>
                    <p className="mt-1 text-sm font-black text-brand-red">{item.totalItemPrice} ج.م</p>
                  </div>

                  <button
                    type="button"
                    className="rounded-lg border border-red-400 px-2 py-1 text-xs font-bold text-red-700"
                    onClick={() => removeItem(item.lineId)}
                  >
                    حذف
                  </button>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand-dark/30 p-1">
                  <button
                    type="button"
                    className="rounded px-2 py-1 font-black"
                    onClick={() => updateItemQuantity(item.lineId, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center font-black">{item.quantity}</span>
                  <button
                    type="button"
                    className="rounded px-2 py-1 font-black"
                    onClick={() => updateItemQuantity(item.lineId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}

            <div className="flex items-center justify-between border-t-2 border-dashed border-brand-dark/20 pt-3">
              <p className="font-black">الإجمالي الفرعي</p>
              <p className="text-lg font-black text-brand-red">{subtotal} ج.م</p>
            </div>

            <button type="button" onClick={clearCart} className="w-full rounded-xl border-2 border-brand-dark px-3 py-2 text-sm font-black">
              تفريغ السلة
            </button>
          </section>

          <section className="space-y-3 rounded-2xl border-2 border-brand-dark bg-brand-white p-4">
            <h2 className="text-lg font-black text-brand-dark">بيانات العميل</h2>

            <label className="block space-y-1">
              <span className="text-sm font-black">الاسم</span>
              <input
                type="text"
                value={customer.name}
                onChange={(event) => {
                  updateCustomer({ name: event.target.value });
                  if (errors.name) {
                    setErrors((current) => ({ ...current, name: undefined }));
                  }
                }}
                className={`w-full rounded-xl border p-3 text-sm focus:border-brand-red focus:outline-none ${errors.name ? 'border-red-500' : ''}`}
                placeholder="الاسم الكامل"
              />
              {errors.name ? <p className="text-xs font-bold text-red-700">{errors.name}</p> : null}
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-black">الهاتف</span>
              <input
                type="tel"
                value={customer.phone}
                onChange={(event) => {
                  updateCustomer({ phone: event.target.value });
                  if (errors.phone) {
                    setErrors((current) => ({ ...current, phone: undefined }));
                  }
                }}
                className={`w-full rounded-xl border p-3 text-sm focus:border-brand-red focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="01xxxxxxxxx"
              />
              {errors.phone ? <p className="text-xs font-bold text-red-700">{errors.phone}</p> : null}
            </label>

            <div className="space-y-2">
              <p className="text-sm font-black">نوع الطلب</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateCustomer({ orderType: 'delivery' })}
                  className={`rounded-xl border-2 px-3 py-2 text-sm font-black ${
                    customer.orderType === 'delivery' ? 'border-brand-red text-brand-red' : 'border-brand-dark/30'
                  }`}
                >
                  دليفري
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateCustomer({ orderType: 'pickup' });
                    setErrors((current) => ({ ...current, address: undefined }));
                  }}
                  className={`rounded-xl border-2 px-3 py-2 text-sm font-black ${
                    customer.orderType === 'pickup' ? 'border-brand-red text-brand-red' : 'border-brand-dark/30'
                  }`}
                >
                  استلام
                </button>
              </div>
            </div>

            <label className="block space-y-1">
              <span className="text-sm font-black">العنوان {customer.orderType === 'delivery' ? '(مطلوب للدليفري)' : '(غير مطلوب للاستلام)'}</span>
              <textarea
                rows={2}
                value={customer.address}
                onChange={(event) => {
                  updateCustomer({ address: event.target.value });
                  if (errors.address) {
                    setErrors((current) => ({ ...current, address: undefined }));
                  }
                }}
                className={`w-full rounded-xl border p-3 text-sm focus:border-brand-red focus:outline-none ${errors.address ? 'border-red-500' : ''}`}
                placeholder="العنوان بالتفصيل"
                disabled={customer.orderType === 'pickup'}
              />
              {errors.address ? <p className="text-xs font-bold text-red-700">{errors.address}</p> : null}
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-black">ملاحظات عامة</span>
              <textarea
                rows={3}
                value={customer.generalNotes}
                onChange={(event) => updateCustomer({ generalNotes: event.target.value })}
                className="w-full rounded-xl border p-3 text-sm focus:border-brand-red focus:outline-none"
                placeholder="أي ملاحظات إضافية على الطلب"
              />
            </label>

            <label className="flex items-start gap-2 rounded-xl border border-brand-dark/20 p-3">
              <input
                type="checkbox"
                checked={customer.confirmedAccurateDetails}
                onChange={(event) => {
                  updateCustomer({ confirmedAccurateDetails: event.target.checked });
                  if (errors.confirmedAccurateDetails) {
                    setErrors((current) => ({ ...current, confirmedAccurateDetails: undefined }));
                  }
                }}
                className="mt-1 h-4 w-4 accent-brand-red"
              />
              <span className="text-sm font-bold text-brand-dark">
                أؤكد أن بياناتي صحيحة وأن المطعم قد يتواصل معي لتأكيد الطلب.
              </span>
            </label>
            {errors.confirmedAccurateDetails ? <p className="text-xs font-bold text-red-700">{errors.confirmedAccurateDetails}</p> : null}
          </section>

          {persistenceWarning ? (
            <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800">{persistenceWarning}</p>
          ) : null}

          <button
            type="button"
            onClick={handleSendWhatsapp}
            className="btn-primary block w-full text-center disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!customer.confirmedAccurateDetails || isSubmitting}
          >
            {isSubmitting ? 'جاري تجهيز طلبك...' : 'إرسال الطلب على واتساب'}
          </button>
        </>
      ) : null}
    </div>
  );
}
