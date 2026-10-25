'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('ar-EG', { maximumFractionDigits: 2 }).format(value);

/**
 * Compact branded handoff from Menu selection to the same Cart journey.
 * Client cart prices are estimates; only the server may validate live prices.
 */
export function FloatingCartCta() {
  const { itemsCount, subtotal } = useCart();
  if (itemsCount < 1) return null;

  return (
    <div className="t-floating-cart-cta pointer-events-none fixed inset-x-0 bottom-[max(12px,env(safe-area-inset-bottom))] z-30 px-3 md:hidden" dir="rtl">
      <Link href="/cart"
        aria-label={`راجع سلتك: ${itemsCount} قطعة، إجمالي الأصناف التقديري ${formatMoney(subtotal)} جنيه`}
        className="pointer-events-auto mx-auto flex min-h-[63px] max-w-[600px] items-center justify-between gap-3 border-2 border-[#f5cd4e] bg-[#171511] px-4 py-3 text-[#fff8e8] shadow-[0_15px_38px_rgba(0,0,0,0.24)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#2676e0]"
      >
        <span className="flex min-w-0 flex-col gap-1">
          <strong className="text-[15px] font-black">راجع طلبك <span aria-hidden="true">↗</span></strong>
          <small className="text-[11px] font-bold text-[#e4d8c2]">{itemsCount} قطعة في السلة</small>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <small className="text-[10px] font-bold text-[#f5cd4e]">إجمالي تقديري</small>
          <strong className="text-[16px] font-black tabular-nums">{formatMoney(subtotal)} ج.م</strong>
        </span>
      </Link>
    </div>
  );
}
