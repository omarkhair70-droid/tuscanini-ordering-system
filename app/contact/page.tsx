import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { siteConfig } from '@/lib/site-config';

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <PageHero title="اتصل بنا" subtitle="تواصل معنا عبر الهاتف أو فيسبوك." />
      <div className="rounded-2xl border p-4 text-sm">
        <p className="font-bold">العنوان:</p>
        <p>{siteConfig.addressAr}</p>
        <p className="mt-2 font-bold">التليفون:</p>
        <p>{siteConfig.phonePrimary}</p>
        <p>{siteConfig.phoneSecondary}</p>
        <Link className="mt-3 inline-block text-brand-red underline" href={siteConfig.facebook} target="_blank">
          Facebook
        </Link>
      </div>
    </div>
  );
}
