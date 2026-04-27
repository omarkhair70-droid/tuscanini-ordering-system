import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export function ContactCta() {
  return (
    <section className="rounded-2xl bg-brand-yellow p-5 text-brand-dark">
      <h2 className="text-2xl font-black">اطلب أو كلّمنا فورًا</h2>
      <p className="mt-1 text-sm">{siteConfig.phonePrimary} - {siteConfig.phoneSecondary}</p>
      <p className="mt-1 text-xs">{siteConfig.addressAr}</p>
      <Link href="/contact" className="btn-secondary mt-4 bg-brand-white">
        صفحة التواصل
      </Link>
    </section>
  );
}
