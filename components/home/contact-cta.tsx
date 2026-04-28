import Link from 'next/link';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';

export async function ContactCta() {
  const settings = await getRuntimePublicSiteSettings();

  return (
    <section className="rounded-2xl bg-brand-yellow p-5 text-brand-dark">
      <h2 className="text-2xl font-black">جاهز تكمل طلبك؟</h2>
      <p className="mt-1 text-sm">اتصل بينا مباشرة أو ادخل صفحة التواصل واطلب على واتساب.</p>
      <p className="mt-2 text-sm font-bold">
        {settings.phonePrimary} - {settings.phoneSecondary}
      </p>
      <p className="mt-1 text-xs">{settings.addressAr}</p>
      <Link href="/contact" className="btn-secondary mt-4 bg-brand-white">
        اتصل أو اطلب الآن
      </Link>
    </section>
  );
}
