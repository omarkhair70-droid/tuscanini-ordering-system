import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

const footerLinks = [
  { href: '/about', label: 'عن توسكانيني' },
  { href: '/reviews', label: 'آراء العملاء' },
  { href: '/complaints', label: 'الشكاوى' },
  { href: '/contact', label: 'اتصل بنا' },
];

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-brand-dark pb-28 pt-8 text-brand-white md:pb-8">
      <div className="container-tight space-y-4 text-sm">
        <p className="text-lg font-black">{siteConfig.nameAr}</p>
        <p>{siteConfig.addressAr}</p>
        <p>
          {siteConfig.phonePrimary} - {siteConfig.phoneSecondary}
        </p>

        <nav aria-label="روابط مهمة" className="pt-1">
          <ul className="grid gap-2 sm:grid-cols-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-bold underline underline-offset-4">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href={siteConfig.facebook} target="_blank" className="inline-block text-brand-yellow underline">
          Facebook
        </Link>
      </div>
    </footer>
  );
}
