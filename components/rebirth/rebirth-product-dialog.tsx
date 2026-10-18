'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import type { MenuItem } from '@/types/menu';

type Props = {
  item: MenuItem | null;
  onClose: () => void;
  priceSource?: 'previous' | 'live';
};

/**
 * Native top-layer <dialog> supplies modal focus containment, Esc handling and
 * focus restoration without a JS-powered fake overlay. No unverified product photo.
 * Uses the real CartProvider contract. Previously recorded prices are passed
 * unchanged when the owner-directed historical menu is selected; the
 * restaurant server independently checks current database records on submit.
 */
export function RebirthProductDialog({ item, onClose, priceSource = 'previous' }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { addItem } = useCart();
  const [sizeId, setSizeId] = useState('');
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!item) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    setSizeId(item.sizes?.[0]?.id ?? '');
    setAddonIds([]);
    setQuantity(1);
    setNotes('');
    dialog.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previous;
    };
  }, [item]);

  const selectedSize = useMemo(() => item?.sizes?.find(x=>x.id===sizeId) ?? null, [item,sizeId]);
  const selectedAddons = useMemo(() => item?.addons?.filter(x=>addonIds.includes(x.id)) ?? [], [item,addonIds]);
  const unitPrice = (selectedSize?.price ?? item?.priceFrom ?? 0) + selectedAddons.reduce((acc,x)=>acc+x.price,0);
  const totalPrice = unitPrice * quantity;
  if (!item) return null;

  const unavailable = item.availability === 'unavailable';
  const invalidPrice = !Number.isFinite(unitPrice) || unitPrice <= 0 || quantity > 50;
  const cannotAdd = unavailable || invalidPrice || Boolean(item.sizes?.length && !selectedSize);

  const addToCart = () => {
    if (cannotAdd) return;
    addItem({
      productId: item.id,
      productName: item.name,
      selectedSize: selectedSize ? {id:selectedSize.id,label:selectedSize.label,price:selectedSize.price} : null,
      selectedAddons: selectedAddons.map(x=>({id:x.id,label:x.label,price:x.price})),
      quantity,
      itemNotes: notes.trim(),
      unitPrice,
    });
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="t-product-dialog"
      dir="rtl"
      aria-labelledby="t-product-title"
      aria-describedby="t-product-summary"
      onClose={onClose}
      onClick={(event) => { if (event.target === dialogRef.current) onClose(); }}
    >
      <div className="t-product-dialog__sheet">
        <header className="t-product-dialog__header">
          <div><span className="t-product-dialog__eyebrow">ORDER DETAILS / TUSCANINI</span><h2 id="t-product-title">{item.name}</h2></div>
          <button type="button" className="t-product-dialog__close" onClick={onClose} aria-label="إغلاق تفاصيل المنتج">×</button>
        </header>
        <div className="t-product-dialog__body">
          <p id="t-product-summary">{item.description || 'اختار التفاصيل المناسبة لطلبك.'}</p>
          {priceSource === 'previous' && <p className="t-product-dialog__price-notice">الأسعار المعروضة هي أسعار منيو توسكانيني السابق. إجمالي الأصناف هنا محسوب منها؛ تأكيد الطلب الفعلي والتوافر بيرجعوا للمطعم.</p>}
          {item.sizes && item.sizes.length > 0 && (
            <fieldset className="t-product-dialog__section">
              <legend>01 — الحجم</legend>
              <div className="t-product-dialog__options">
                {item.sizes.map(size=> (
                  <label key={size.id}>
                    <input type="radio" name="rebirth-product-size" checked={sizeId===size.id} onChange={()=>setSizeId(size.id)} />
                    <span>{size.label}</span><strong>{size.price} ج.م</strong>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          {item.addons && item.addons.length > 0 && (
            <fieldset className="t-product-dialog__section">
              <legend>02 — إضافات على مزاجك</legend>
              <div className="t-product-dialog__options">
                {item.addons.map(addon => (
                  <label key={addon.id}>
                    <input type="checkbox" checked={addonIds.includes(addon.id)} onChange={event=>setAddonIds(current=>event.target.checked?[...current,addon.id]:current.filter(id=>id!==addon.id))} />
                    <span>{addon.label}</span><strong>+{addon.price} ج.م</strong>
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <div className="t-product-dialog__section">
            <label className="t-product-dialog__legend" htmlFor="rebirth-product-notes">ملاحظات خاصة</label>
            <textarea id="rebirth-product-notes" maxLength={500} rows={3} placeholder="مثال: بدون بصل" value={notes} onChange={e=>setNotes(e.target.value)} />
          </div>
          <div className="t-product-dialog__quantity">
            <span>الكمية</span>
            <div role="group" aria-label="اختر الكمية">
              <button type="button" onClick={()=>setQuantity(x=>Math.max(1,x-1))} disabled={quantity<=1} aria-label="تقليل الكمية">−</button>
              <output aria-live="polite">{quantity}</output>
              <button type="button" onClick={()=>setQuantity(x=>Math.min(50,x+1))} disabled={quantity>=50} aria-label="زيادة الكمية">+</button>
            </div>
          </div>
        </div>
        <footer className="t-product-dialog__footer">
          <div><span>الإجمالي قبل التوصيل</span><strong>{totalPrice.toFixed(2)} ج.م</strong></div>
          <button type="button" disabled={cannotAdd} onClick={addToCart}>{unavailable ? 'الصنف مش متاح' : 'ضيف للسلة ↗'}</button>
        </footer>
      </div>
    </dialog>
  );
}
