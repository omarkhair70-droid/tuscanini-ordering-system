import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-brand-dark py-8 text-brand-white">
      <div className="container-tight space-y-2 text-sm">
        <p className="text-lg font-black">{siteConfig.nameAr}</p>
        <p>{siteConfig.addressAr}</p>
        <p>
          {siteConfig.phonePrimary} - {siteConfig.phoneSecondary}
        </p>
        <Link href={siteConfig.facebook} target="_blank" className="text-brand-yellow underline">
          Facebook
        </Link>
      </div>
    </footer>
  );
}
