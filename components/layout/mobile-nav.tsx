import Link from 'next/link';

const nav = [
  { href: '/', label: 'الرئيسية' },
  { href: '/menu', label: 'المنيو' },
  { href: '/offers', label: 'العروض' },
  { href: '/food-finder', label: 'اختيارات' },
  { href: '/cart', label: 'السلة' },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t-4 border-brand-yellow bg-brand-white md:hidden">
      <ul className="grid grid-cols-5 text-center text-xs font-bold text-brand-dark">
        {nav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="block px-2 py-3">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
