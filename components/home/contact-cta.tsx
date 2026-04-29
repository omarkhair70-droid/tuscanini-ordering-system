import Link from 'next/link';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';

export async function ContactCta() {
  const settings = await getRuntimePublicSiteSettings();

  return (
    <section className="rounded-2xl border border-brand-dark/10 bg-brand-yellow/75 p-5 text-brand-dark shadow-[0_8px_18px_rgba(0,0,0,0.06)]">
      <h2 className="text-2xl font-black">جاهز تكمل طلبك؟</h2>
      <p className="mt-1 text-sm leading-6">اتصل بينا مباشرة أو ادخل صفحة التواصل واطلب على واتساب.</p>
      <p className="mt-2 text-sm font-extrabold">
        {settings.phonePrimary} - {settings.phoneSecondary}
      </p>
      <p className="mt-1 text-xs">{settings.addressAr}</p>
      <Link href="/contact" className="btn-secondary mt-4 bg-brand-white">
        اتصل أو اطلب الآن
      </Link>
    </section>
  );
}
