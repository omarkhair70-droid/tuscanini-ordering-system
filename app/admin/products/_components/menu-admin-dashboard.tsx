'use client';

import { useMemo, useState } from 'react';

import type { AdminMenuDashboardData } from '@/types/admin-menu';

type MenuAdminDashboardProps = {
  data: AdminMenuDashboardData;
};

type ProductAvailability = 'available' | 'limited' | 'unavailable';

type FlashMessage = {
  type: 'success' | 'error';
  text: string;
};

function formatMoney(value: number): string {
  return `${value.toFixed(2)} ج.م`;
}

function toNumberOrFallback(value: string | undefined, fallback: number): number {
  if (!value || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${
        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
      }`}
    >
      {isActive ? 'نشط' : 'غير نشط'}
    </span>
  );
}

function AvailabilityLabel({ value }: { value: string }) {
  const label = value === 'available' ? 'متاح' : value === 'limited' ? 'متاح بكمية محدودة' : 'غير متاح';

  return <span className="text-sm font-semibold text-slate-800">{label}</span>;
}

function SectionCard({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-black text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{count}</span>
      </div>
      {children}
    </section>
  );
}

async function patchJson(url: string, payload: Record<string, unknown>) {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok || !body.ok) {
    throw new Error(body.error ?? 'تعذر حفظ التعديل.');
  }
}

export function MenuAdminDashboard({ data }: MenuAdminDashboardProps) {
  const [availabilityById, setAvailabilityById] = useState<Record<string, ProductAvailability>>(
    Object.fromEntries(
      data.products.map((row) => [
        row.id,
        row.availability === 'available' || row.availability === 'limited' || row.availability === 'unavailable'
          ? row.availability
          : 'available',
      ]),
    ),
  );
  const [productPriceById, setProductPriceById] = useState<Record<string, string>>(
    Object.fromEntries(data.products.map((row) => [row.id, row.priceFrom.toFixed(2)])),
  );
  const [isActiveById, setIsActiveById] = useState<Record<string, boolean>>(
    Object.fromEntries(data.products.map((row) => [row.id, row.isActive])),
  );
  const [sizePriceById, setSizePriceById] = useState<Record<string, string>>(
    Object.fromEntries(data.sizes.map((row) => [row.id, row.price.toFixed(2)])),
  );
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [flashByKey, setFlashByKey] = useState<Record<string, FlashMessage>>({});

  const pendingLabel = useMemo(() => (pendingKey ? 'جارٍ الحفظ...' : ''), [pendingKey]);

  const setFlash = (key: string, message: FlashMessage) => {
    setFlashByKey((previous) => ({ ...previous, [key]: message }));
  };

  const clearFlash = (key: string) => {
    setFlashByKey((previous) => {
      const copy = { ...previous };
      delete copy[key];
      return copy;
    });
  };

  const handleAvailabilitySave = async (productId: string) => {
    const key = `product-availability-${productId}`;
    if (!window.confirm('تأكيد تعديل حالة التوفر لهذا المنتج؟')) {
      return;
    }

    clearFlash(key);
    setPendingKey(key);

    try {
      await patchJson(`/admin/products/api/products/${productId}`, { availability: availabilityById[productId] });
      setFlash(key, { type: 'success', text: 'تم تحديث حالة التوفر بنجاح.' });
    } catch (error: unknown) {
      setFlash(key, { type: 'error', text: error instanceof Error ? error.message : 'تعذر تحديث حالة التوفر.' });
    } finally {
      setPendingKey(null);
    }
  };

  const handleProductPriceSave = async (productId: string) => {
    const key = `product-price-${productId}`;
    if (!window.confirm('تأكيد تعديل السعر يبدأ من لهذا المنتج؟')) {
      return;
    }

    clearFlash(key);
    setPendingKey(key);

    try {
      await patchJson(`/admin/products/api/products/${productId}`, { price_from: productPriceById[productId] });
      setFlash(key, { type: 'success', text: 'تم تحديث السعر بنجاح.' });
    } catch (error: unknown) {
      setFlash(key, { type: 'error', text: error instanceof Error ? error.message : 'تعذر تحديث السعر.' });
    } finally {
      setPendingKey(null);
    }
  };

  const handleProductActiveToggle = async (productId: string) => {
    const key = `product-active-${productId}`;
    const nextValue = !isActiveById[productId];

    if (!window.confirm(`تأكيد ${nextValue ? 'تفعيل' : 'إيقاف'} هذا المنتج؟`)) {
      return;
    }

    clearFlash(key);
    setPendingKey(key);

    try {
      await patchJson(`/admin/products/api/products/${productId}`, { is_active: nextValue });
      setIsActiveById((previous) => ({ ...previous, [productId]: nextValue }));
      setFlash(key, { type: 'success', text: 'تم تحديث حالة المنتج بنجاح.' });
    } catch (error: unknown) {
      setFlash(key, { type: 'error', text: error instanceof Error ? error.message : 'تعذر تحديث حالة المنتج.' });
    } finally {
      setPendingKey(null);
    }
  };

  const handleSizePriceSave = async (sizeId: string) => {
    const key = `size-price-${sizeId}`;
    if (!window.confirm('تأكيد تعديل سعر هذا الحجم؟')) {
      return;
    }

    clearFlash(key);
    setPendingKey(key);

    try {
      await patchJson(`/admin/products/api/product-sizes/${sizeId}/price`, { price: sizePriceById[sizeId] });
      setFlash(key, { type: 'success', text: 'تم تحديث سعر الحجم بنجاح.' });
    } catch (error: unknown) {
      setFlash(key, { type: 'error', text: error instanceof Error ? error.message : 'تعذر تحديث سعر الحجم.' });
    } finally {
      setPendingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-black text-slate-900">لوحة إدارة المنيو (تعديل آمن محدود)</h1>
        <p className="text-sm text-slate-700">التعديلات المتاحة: التوفر، السعر يبدأ من، حالة التفعيل، وسعر الحجم فقط.</p>
      </header>

      <SectionCard title="التصنيفات" count={data.categories.length}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">الاسم</th>
                <th className="px-3 py-2 font-bold">Slug</th>
                <th className="px-3 py-2 font-bold">الترتيب</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {data.categories.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-none">
                  <td className="px-3 py-2 font-semibold text-slate-900">{row.nameAr}</td>
                  <td className="px-3 py-2 text-xs text-slate-600">{row.slug}</td>
                  <td className="px-3 py-2">{row.sortOrder}</td>
                  <td className="px-3 py-2">
                    <StatusBadge isActive={row.isActive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="المنتجات" count={data.products.length}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">اسم المنتج</th>
                <th className="px-3 py-2 font-bold">التصنيف</th>
                <th className="px-3 py-2 font-bold">التوفر</th>
                <th className="px-3 py-2 font-bold">السعر يبدأ من</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
                <th className="px-3 py-2 font-bold">آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((row) => {
                const availabilityKey = `product-availability-${row.id}`;
                const productPriceKey = `product-price-${row.id}`;
                const productActiveKey = `product-active-${row.id}`;

                return (
                  <tr key={row.id} className="border-b border-slate-100 last:border-none align-top">
                    <td className="px-3 py-2 font-semibold text-slate-900">{row.nameAr}</td>
                    <td className="px-3 py-2 text-slate-700">{row.categoryNameAr}</td>
                    <td className="px-3 py-2">
                      <div className="space-y-2">
                        <AvailabilityLabel value={availabilityById[row.id]} />
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value={availabilityById[row.id]}
                            onChange={(event) =>
                              setAvailabilityById((previous) => ({
                                ...previous,
                                [row.id]: event.target.value as ProductAvailability,
                              }))
                            }
                            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm"
                          >
                            <option value="available">متاح</option>
                            <option value="limited">متاح بكمية محدودة</option>
                            <option value="unavailable">غير متاح</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => void handleAvailabilitySave(row.id)}
                            disabled={pendingKey === availabilityKey}
                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold transition hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {pendingKey === availabilityKey ? 'جارٍ الحفظ...' : 'حفظ'}
                          </button>
                        </div>
                        {flashByKey[availabilityKey] ? (
                          <p
                            className={`text-xs font-semibold ${
                              flashByKey[availabilityKey].type === 'success' ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {flashByKey[availabilityKey].text}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-2">
                        <p className="font-semibold">{formatMoney(toNumberOrFallback(productPriceById[row.id], row.priceFrom))}</p>
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={productPriceById[row.id]}
                            onChange={(event) =>
                              setProductPriceById((previous) => ({
                                ...previous,
                                [row.id]: event.target.value,
                              }))
                            }
                            className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-left"
                          />
                          <button
                            type="button"
                            onClick={() => void handleProductPriceSave(row.id)}
                            disabled={pendingKey === productPriceKey}
                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold transition hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {pendingKey === productPriceKey ? 'جارٍ الحفظ...' : 'حفظ'}
                          </button>
                        </div>
                        {flashByKey[productPriceKey] ? (
                          <p
                            className={`text-xs font-semibold ${
                              flashByKey[productPriceKey].type === 'success' ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {flashByKey[productPriceKey].text}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="space-y-2">
                        <StatusBadge isActive={isActiveById[row.id]} />
                        <button
                          type="button"
                          onClick={() => void handleProductActiveToggle(row.id)}
                          disabled={pendingKey === productActiveKey}
                          className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold transition hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {pendingKey === productActiveKey
                            ? 'جارٍ الحفظ...'
                            : isActiveById[row.id]
                              ? 'إيقاف المنتج'
                              : 'تفعيل المنتج'}
                        </button>
                        {flashByKey[productActiveKey] ? (
                          <p
                            className={`text-xs font-semibold ${
                              flashByKey[productActiveKey].type === 'success' ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {flashByKey[productActiveKey].text}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">{formatDate(row.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="أحجام المنتجات" count={data.sizes.length}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">المنتج</th>
                <th className="px-3 py-2 font-bold">الحجم</th>
                <th className="px-3 py-2 font-bold">السعر</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
                <th className="px-3 py-2 font-bold">آخر تحديث</th>
              </tr>
            </thead>
            <tbody>
              {data.sizes.map((row) => {
                const sizePriceKey = `size-price-${row.id}`;

                return (
                  <tr key={row.id} className="border-b border-slate-100 last:border-none align-top">
                    <td className="px-3 py-2 font-semibold text-slate-900">{row.productNameAr}</td>
                    <td className="px-3 py-2 text-slate-700">{row.labelAr}</td>
                    <td className="px-3 py-2">
                      <div className="space-y-2">
                        <p className="font-semibold">{formatMoney(toNumberOrFallback(sizePriceById[row.id], row.price))}</p>
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={sizePriceById[row.id]}
                            onChange={(event) =>
                              setSizePriceById((previous) => ({
                                ...previous,
                                [row.id]: event.target.value,
                              }))
                            }
                            className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-left"
                          />
                          <button
                            type="button"
                            onClick={() => void handleSizePriceSave(row.id)}
                            disabled={pendingKey === sizePriceKey}
                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold transition hover:border-brand-red hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {pendingKey === sizePriceKey ? 'جارٍ الحفظ...' : 'حفظ'}
                          </button>
                        </div>
                        {flashByKey[sizePriceKey] ? (
                          <p
                            className={`text-xs font-semibold ${
                              flashByKey[sizePriceKey].type === 'success' ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {flashByKey[sizePriceKey].text}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge isActive={row.isActive} />
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">{formatDate(row.updatedAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="الإضافات" count={data.addons.length}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-bold">اسم الإضافة</th>
                <th className="px-3 py-2 font-bold">السعر</th>
                <th className="px-3 py-2 font-bold">الحالة</th>
                <th className="px-3 py-2 font-bold">مرات الاستخدام</th>
              </tr>
            </thead>
            <tbody>
              {data.addons.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-none">
                  <td className="px-3 py-2 font-semibold text-slate-900">{row.labelAr}</td>
                  <td className="px-3 py-2 font-semibold">{formatMoney(row.price)}</td>
                  <td className="px-3 py-2">
                    <StatusBadge isActive={row.isActive} />
                  </td>
                  <td className="px-3 py-2 text-slate-700">{row.usageCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {pendingLabel ? <p className="text-xs font-semibold text-slate-500">{pendingLabel}</p> : null}
    </div>
  );
}
