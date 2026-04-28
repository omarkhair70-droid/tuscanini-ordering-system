'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';

export function FloatingCartCta() {
  const { itemsCount, subtotal } = useCart();

  if (itemsCount < 1) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[4.8rem] z-30 px-4 md:hidden">
      <Link
        href="/cart"
        className="pointer-events-auto flex items-center justify-between rounded-xl2 bg-brand-red px-4 py-3 text-brand-white shadow-[0_12px_24px_rgba(128,0,0,0.35)]"
      >
        <span className="text-sm font-extrabold">عرض السلة</span>
        <span className="text-xs font-bold">{itemsCount} قطعة</span>
        <span className="text-sm font-black">{subtotal} ج.م</span>
      </Link>
    </div>
  );
}
