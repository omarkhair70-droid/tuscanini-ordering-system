'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import { PageHero } from '@/components/shared/page-hero';
import { buildArabicWhatsappMessage, buildWhatsappOrderUrl } from '@/lib/whatsapp';

export default function CartPage() {
  const { items, customer, subtotal, updateItemQuantity, removeItem, clearCart, updateCustomer, isHydrated } = useCart();

  const whatsappUrl = useMemo(() => {
    if (!items.length) {
      return '';
    }

    const message = buildArabicWhatsappMessage({ items, customer, subtotal });
    return buildWhatsappOrderUrl(message);
  }, [items, customer, subtotal]);

  return (
    <div className="space-y-6">
      <PageHero title="السلة" subtitle="راجع الطلب واكمله وارسله مباشرة على واتساب." />

      {!isHydrated ? (
        <div className="rounded-2xl border-2 border-brand-dark bg-brand-white p-4 text-center font-bold">جاري تحميل السلة...</div>
      ) : null}

      {isHydrated && items.length === 0 ? (
        <section className="space-y-4 rounded-2xl border-2 border-dashed border-brand-dark bg-brand-white p-5 text-center">
          <p className="font-black text-brand-dark">السلة فارغة حاليًا.</p>
          <Link href="/menu" className="btn-primary inline-flex items-center">
            ابدأ الطلب من المنيو
          </Link>
        </section>
      ) : null}

      {isHydrated && items.length > 0 ? (
        <>
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
                onChange={(event) => updateCustomer({ name: event.target.value })}
                className="w-full rounded-xl border p-3 text-sm focus:border-brand-red focus:outline-none"
                placeholder="الاسم الكامل"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-black">الهاتف</span>
              <input
                type="tel"
                value={customer.phone}
                onChange={(event) => updateCustomer({ phone: event.target.value })}
                className="w-full rounded-xl border p-3 text-sm focus:border-brand-red focus:outline-none"
                placeholder="01xxxxxxxxx"
              />
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
                  onClick={() => updateCustomer({ orderType: 'pickup' })}
                  className={`rounded-xl border-2 px-3 py-2 text-sm font-black ${
                    customer.orderType === 'pickup' ? 'border-brand-red text-brand-red' : 'border-brand-dark/30'
                  }`}
                >
                  استلام
                </button>
              </div>
            </div>

            <label className="block space-y-1">
              <span className="text-sm font-black">العنوان</span>
              <textarea
                rows={2}
                value={customer.address}
                onChange={(event) => updateCustomer({ address: event.target.value })}
                className="w-full rounded-xl border p-3 text-sm focus:border-brand-red focus:outline-none"
                placeholder="العنوان بالتفصيل"
                disabled={customer.orderType === 'pickup'}
              />
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
          </section>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary block w-full text-center"
          >
            إرسال الطلب على واتساب
          </a>
        </>
      ) : null}
    </div>
  );
}
