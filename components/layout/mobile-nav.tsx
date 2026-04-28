'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/cart-provider';

const nav = [
  { href: '/', label: 'الرئيسية' },
  { href: '/menu', label: 'المنيو' },
  { href: '/offers', label: 'العروض' },
  { href: '/food-finder', label: 'اختيارات' },
  { href: '/cart', label: 'السلة' },
];

export function MobileNav() {
  const { itemsCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-brand-dark/10 bg-brand-white/95 shadow-[0_-8px_20px_rgba(18,18,18,0.06)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5 text-center text-xs font-bold text-brand-dark">
        {nav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="relative block px-2 py-4">
              {item.label}
              {item.href === '/cart' && itemsCount > 0 ? (
                <span className="absolute end-2 top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] text-brand-white">
                  {itemsCount}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
