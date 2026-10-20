'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import type { MenuItem } from '@/types/menu';
import { ProductArtwork } from '@/components/rebirth/product-artwork';
import { getRepresentativeMenuPhoto } from '@/lib/rebirth/representative-menu-photos';
import { getGeneratedMenuPhoto } from '@/lib/rebirth/generated-menu-media';

type Props = {
  item: MenuItem | null;
  onClose: () => void;
  priceSource?: 'previous' | 'live';
  visualMode?:'art'|'representative';
  originRect?:{left:number;top:number;width:number;height:number}|null;
};

/**
 * Native top-layer <dialog> supplies modal focus containment, Esc handling and
 * focus restoration without a JS-powered fake overlay. No unverified product photo.
 * Uses the real CartProvider contract. Previously recorded prices are passed
 * unchanged when the owner-directed historical menu is selected; the
 * restaurant server independently checks current database records on submit.
 */
export function RebirthProductDialog({ item, onClose, priceSource = 'previous', visualMode='art', originRect=null }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closingRef = useRef(false);
  const returnAnimationRef = useRef<Animation | null>(null);
  const returnBridgeRef = useRef<HTMLElement | null>(null);
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
    closingRef.current = false;
    dialog.showModal();
    // Real shared-object FLIP: the selected image itself travels from the
    // clicked thumbnail to the native sheet. The animation is OPTIONAL:
    // no motion when disabled or if a browser lacks Web Animations.
    let bridge: HTMLElement | null = null;
    let destination: HTMLElement | null = null;
    let animation: Animation | null = null;
    if (originRect && window.matchMedia('(prefers-reduced-motion: no-preference)').matches &&
      typeof Element.prototype.animate === 'function') {
      destination = dialog.querySelector<HTMLElement>('.t-product-dialog__identity .t-product-art');
      if (destination) {
        const target = destination.getBoundingClientRect();
        if (target.width > 0 && target.height > 0 && originRect.width > 0 && originRect.height > 0) {
          dialog.dataset.motionTechnique = 'dom-flip';
          bridge = destination.cloneNode(true) as HTMLElement;
          bridge.dataset.motionBridge = 'true';
          bridge.setAttribute('aria-hidden', 'true');
          Object.assign(bridge.style, {
            position: 'fixed', left: originRect.left+'px', top: originRect.top+'px',
            width: originRect.width+'px', height: originRect.height+'px',
            pointerEvents:'none', zIndex:'99',
          });
          dialog.appendChild(bridge);
          destination.style.opacity = '0';
          const dx = target.left-originRect.left;
          const dy = target.top-originRect.top;
          const sx = target.width/originRect.width;
          const sy = target.height/originRect.height;
          animation = bridge.animate([
            { transform:'translate3d(0,0,0) scale(1,1)', opacity:0.98 },
            { transform:`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`, opacity:1 },
          ], {duration:390, easing:'cubic-bezier(.16,1,.3,1)', fill:'forwards'});
          const settle=()=>{
            if (destination) destination.style.opacity='';
            bridge?.remove();
            dialog.dataset.motionFinished = 'true';
          };
          animation.addEventListener('finish', settle, {once:true});
          animation.addEventListener('cancel', settle, {once:true});
        }
      }
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      animation?.cancel();
      returnAnimationRef.current?.cancel();
      returnBridgeRef.current?.remove();
      returnAnimationRef.current = null;
      returnBridgeRef.current = null;
      if (destination) destination.style.opacity = '';
      bridge?.remove();
      if (dialog.open) dialog.close();
      document.body.style.overflow = previous;
    };
  }, [item]);

  const selectedSize = useMemo(() => item?.sizes?.find(x=>x.id===sizeId) ?? null, [item,sizeId]);
  const selectedAddons = useMemo(() => item?.addons?.filter(x=>addonIds.includes(x.id)) ?? [], [item,addonIds]);
  const unitPrice = (selectedSize?.price ?? item?.priceFrom ?? 0) + selectedAddons.reduce((acc,x)=>acc+x.price,0);
  const totalPrice = unitPrice * quantity;
  if (!item) return null;

  const generated=visualMode==='representative'?getGeneratedMenuPhoto(item.id,item.name,item.categorySlug):null;
  const representative=visualMode==='representative'&&!generated?getRepresentativeMenuPhoto(item.id,item.categorySlug):null;
  const unavailable = item.availability === 'unavailable';
  const invalidPrice = !Number.isFinite(unitPrice) || unitPrice <= 0 || quantity > 50;
  const cannotAdd = unavailable || invalidPrice || Boolean(item.sizes?.length && !selectedSize);

  // Close with a measured return to the SAME visible source card. Native dialog
  // remains open/focus-contained until the optional 310ms reverse FLIP settles.
  // Escape, backdrop and the close button all use this single idempotent path.
  const closeProduct = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    const dialog = dialogRef.current;
    const source = Array.from(
      document.querySelectorAll<HTMLElement>('.t-menu-product__art-trigger .t-product-art[data-product-id]')
    ).find(node => node.dataset.productId === item.id);
    const trigger = source?.closest<HTMLButtonElement>('button');
    const finish = () => {
      returnAnimationRef.current = null;
      returnBridgeRef.current?.remove();
      returnBridgeRef.current = null;
      onClose();
      // Closing a native dialog should return keyboard users to their chosen
      // product even after the optional visual clone has finished its journey.
      if (trigger?.isConnected) requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
    };
    const destination = dialog?.querySelector<HTMLElement>('.t-product-dialog__identity .t-product-art');
    const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (!originRect || !source || !destination || !dialog ||
        !prefersMotion || typeof Element.prototype.animate !== 'function') {
      finish();
      return;
    }
    const target = source.getBoundingClientRect();
    const from = destination.getBoundingClientRect();
    // If filtering/navigation or viewport displacement moved the source away,
    // never animate an image into an offscreen, stale rectangle.
    const valid = target.width > 0 && target.height > 0 &&
      target.left >= 0 && target.top >= 0 &&
      target.right <= window.innerWidth && target.bottom <= window.innerHeight &&
      from.width > 0 && from.height > 0;
    if (!valid) {
      finish();
      return;
    }
    const bridge = destination.cloneNode(true) as HTMLElement;
    bridge.setAttribute('aria-hidden', 'true');
    bridge.dataset.motionBridge = 'return';
    Object.assign(bridge.style, {
      position: 'fixed', left: from.left + 'px', top: from.top + 'px',
      width: from.width + 'px', height: from.height + 'px',
      margin: '0', pointerEvents: 'none', zIndex: '99',
    });
    dialog.dataset.motionPhase = 'returning';
    dialog.appendChild(bridge);
    returnBridgeRef.current = bridge;
    destination.style.opacity = '0';
    const animation = bridge.animate([
      { transform: 'translate3d(0,0,0) scale(1,1)', opacity: 1 },
      {
        transform: `translate3d(${target.left-from.left}px,${target.top-from.top}px,0) scale(${target.width/from.width},${target.height/from.height})`,
        opacity: .96,
      },
    ], { duration: 310, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
    returnAnimationRef.current = animation;
    animation.addEventListener('finish', finish, { once: true });
  };

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
      onCancel={(event) => { event.preventDefault(); closeProduct(); }}
      onClick={(event) => { if (event.target === dialogRef.current) closeProduct(); }}
    >
      <div className="t-product-dialog__sheet">
        <header className="t-product-dialog__header">
          <div><span className="t-product-dialog__eyebrow">ORDER DETAILS / TUSCANINI</span><h2 id="t-product-title">{item.name}</h2></div>
          <button type="button" className="t-product-dialog__close" onClick={closeProduct} aria-label="إغلاق تفاصيل المنتج">×</button>
        </header>
        <div className="t-product-dialog__body">
          <div className="t-product-dialog__identity">
            <ProductArtwork item={item} size="large" visualMode={visualMode}/>
            <div className="t-product-dialog__identity-copy">
              <p id="t-product-summary">{item.description || 'اختار التفاصيل المناسبة لطلبك.'}</p>
              {priceSource === 'previous' && <p className="t-product-dialog__price-notice">{generated?'الصورة مولّدة بالذكاء الاصطناعي للتوضيح فقط، وليست صورة فعلية للصنف.':representative?'الصورة للتوضيح فقط وليست شكل أو مكونات الصنف من توسكانيني.':'الرسمة للتعبير عن الصنف وليست صورته الفعلية.'} الأسعار من منيو توسكانيني السابق؛ التوافر وتأكيد الطلب بيرجعوا للمطعم.</p>}
              {representative&&<a className="t-product-dialog__photo-credit" href={representative.page} target="_blank" rel="noopener noreferrer">مصدر الصورة التوضيحية: {representative.photographer} / Pexels ↗</a>}
            </div>
          </div>
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
