'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';

export function FloatingCartCta() {
  const { itemsCount, subtotal } = useCart();

  if (itemsCount < 1) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[4.9rem] z-30 px-4 md:hidden">
      <Link
        href="/cart"
        className="pointer-events-auto flex items-center justify-between rounded-xl2 border border-brand-red/20 bg-brand-white px-4 py-3 text-brand-dark shadow-[0_10px_20px_rgba(18,18,18,0.1)]"
      >
        <span className="text-sm font-extrabold text-brand-red">عرض السلة</span>
        <span className="text-xs font-bold text-brand-charcoal">{itemsCount} قطعة</span>
        <span className="text-sm font-black text-brand-dark">{subtotal} ج.م</span>
      </Link>
    </div>
  );
}
