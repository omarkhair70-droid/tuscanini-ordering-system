import Link from 'next/link';
import { publicRoutes } from '@/lib/routes';

const desktopRoutes = publicRoutes.filter((route) => route.href !== '/cart');

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-brand-yellow bg-brand-red text-brand-white">
      <div className="container-tight flex items-center justify-between py-3">
        <Link href="/" className="text-xl font-black tracking-tight">
          توسكانيني
        </Link>
        <Link href="/cart" className="rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-dark">
          السلة
        </Link>
      </div>
      <nav className="container-tight hidden gap-2 overflow-x-auto pb-3 md:flex" aria-label="روابط الصفحات">
        {desktopRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="shrink-0 rounded-full border border-brand-white/40 px-3 py-1 text-xs font-bold"
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
