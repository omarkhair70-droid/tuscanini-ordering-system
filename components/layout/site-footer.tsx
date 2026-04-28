import Link from 'next/link';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';
import { siteConfig } from '@/lib/site-config';

const footerLinks = [
  { href: '/about', label: 'عن توسكانيني' },
  { href: '/reviews', label: 'آراء العملاء' },
  { href: '/complaints', label: 'الشكاوى' },
  { href: '/contact', label: 'اتصل بنا' },
];

export async function SiteFooter() {
  const settings = await getRuntimePublicSiteSettings();

  return (
    <footer className="mt-14 border-t border-brand-white/10 bg-brand-dark pb-32 pt-10 text-brand-white md:pb-10">
      <div className="container-tight space-y-4 text-sm">
        <p className="text-lg font-black">{siteConfig.nameAr}</p>
        <p>{settings.addressAr}</p>
        <p>
          {settings.phonePrimary} - {settings.phoneSecondary}
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

        <Link href={settings.facebookUrl} target="_blank" className="inline-block text-brand-yellow underline">
          Facebook
        </Link>
      </div>
    </footer>
  );
}
