'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import type { MenuItem } from '@/types/menu';

type ProductCustomizationModalProps = {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
};

export function ProductCustomizationModal({ item, isOpen, onClose }: ProductCustomizationModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (!item) {
      return;
    }

    setSelectedSize(item.sizes?.[0]?.id ?? '');
    setSelectedAddons([]);
    setQuantity(1);
    setNotes('');
  }, [item]);

  const selectedSizeData = useMemo(() => {
    if (!item) {
      return null;
    }

    const size = item.sizes?.find((entry) => entry.id === selectedSize);
    if (!size) {
      return null;
    }

    return {
      id: size.id,
      label: size.label,
      price: size.price,
    };
  }, [item, selectedSize]);

  const selectedSizePrice = selectedSizeData?.price ?? item?.priceFrom ?? 0;

  const selectedAddonData = useMemo(() => {
    if (!item?.addons) {
      return [];
    }

    return item.addons
      .filter((addon) => selectedAddons.includes(addon.id))
      .map((addon) => ({ id: addon.id, label: addon.label, price: addon.price }));
  }, [item, selectedAddons]);

  const addonsTotal = useMemo(
    () => selectedAddonData.reduce((sum, addon) => sum + addon.price, 0),
    [selectedAddonData],
  );

  const unitPrice = selectedSizePrice + addonsTotal;
  const total = unitPrice * quantity;

  if (!isOpen || !item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-brand-white p-5 sm:max-w-lg sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-black text-brand-dark">تخصيص: {item.name}</h3>
          <button type="button" onClick={onClose} className="rounded-full border-2 border-brand-dark px-3 py-1 font-bold">
            إغلاق
          </button>
        </div>

        <section className="mb-4">
          <p className="mb-2 text-sm font-black text-brand-dark">اختر الحجم</p>
          <div className="space-y-2">
            {(item.sizes ?? []).map((size) => (
              <label key={size.id} className="flex cursor-pointer items-center justify-between rounded-xl border p-3">
                <span className="font-bold">{size.label}</span>
                <span className="text-sm font-black text-brand-red">{size.price} ج.م</span>
                <input
                  type="radio"
                  name="size"
                  checked={selectedSize === size.id}
                  onChange={() => setSelectedSize(size.id)}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <p className="mb-2 text-sm font-black text-brand-dark">إضافات</p>
          <div className="space-y-2">
            {(item.addons ?? []).length === 0 ? (
              <p className="text-sm text-brand-charcoal">لا توجد إضافات لهذا المنتج حاليًا.</p>
            ) : (
              (item.addons ?? []).map((addon) => (
                <label key={addon.id} className="flex cursor-pointer items-center justify-between rounded-xl border p-3">
                  <span className="font-bold">{addon.label}</span>
                  <span className="text-sm font-black text-brand-red">+{addon.price} ج.م</span>
                  <input
                    type="checkbox"
                    checked={selectedAddons.includes(addon.id)}
                    onChange={(event) => {
                      if (event.target.checked) {
                        setSelectedAddons((current) => [...current, addon.id]);
                        return;
                      }
                      setSelectedAddons((current) => current.filter((id) => id !== addon.id));
                    }}
                  />
                </label>
              ))
            )}
          </div>
        </section>

        <section className="mb-4">
          <p className="mb-2 text-sm font-black text-brand-dark">الكمية</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              className="rounded-lg border-2 border-brand-dark px-3 py-1 font-black"
            >
              -
            </button>
            <span className="min-w-8 text-center text-lg font-black">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((current) => current + 1)}
              className="rounded-lg border-2 border-brand-dark px-3 py-1 font-black"
            >
              +
            </button>
          </div>
        </section>

        <section className="mb-4">
          <label htmlFor="notes" className="mb-2 block text-sm font-black text-brand-dark">
            ملاحظات خاصة
          </label>
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="مثال: بدون بصل / زيادة صوص"
            className="w-full rounded-xl border p-3 text-sm focus:border-brand-red focus:outline-none"
          />
        </section>

        <button
          type="button"
          className="btn-primary w-full"
          onClick={() => {
            addItem({
              productId: item.id,
              productName: item.name,
              selectedSize: selectedSizeData,
              selectedAddons: selectedAddonData,
              quantity,
              itemNotes: notes.trim(),
              unitPrice,
            });
            onClose();
          }}
        >
          إضافة إلى السلة - {total} ج.م
        </button>
      </div>
    </div>
  );
}
