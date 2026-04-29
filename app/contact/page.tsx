import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';

function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `20${digits.slice(1)}`;
  }
  return digits;
}

export default async function ContactPage() {
  const settings = await getRuntimePublicSiteSettings();
  const whatsappUrl = `https://wa.me/${normalizeWhatsappNumber(settings.whatsappOrderNumber)}`;

  return (
    <div className="safe-bottom-mobile space-y-6">
      <PageHero title="اتصل بنا" subtitle="اطلب الآن أو تواصل معنا مباشرة." />

      <section className="surface-card space-y-1 text-sm">
        <h2 className="text-lg font-black">بيانات التواصل</h2>

        <p className="mt-3 font-bold">العنوان:</p>
        <p>{settings.addressAr}</p>

        <p className="mt-3 font-bold">أرقام التليفون:</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link href={`tel:${settings.phonePrimary}`} className="btn-secondary bg-brand-white text-center">
            اتصال {settings.phonePrimary}
          </Link>
          <Link href={`tel:${settings.phoneSecondary}`} className="btn-secondary bg-brand-white text-center">
            اتصال {settings.phoneSecondary}
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link href={whatsappUrl} target="_blank" className="btn-primary text-center">
            اطلب عبر واتساب
          </Link>
          <Link href={settings.facebookUrl} target="_blank" className="btn-secondary bg-brand-white text-center">
            صفحة فيسبوك
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-brand-dark/10 bg-brand-white p-4 text-sm shadow-[0_8px_20px_rgba(18,18,18,0.04)]">
        <h2 className="text-lg font-black">الخريطة</h2>
        <p className="mt-2 leading-7 text-brand-charcoal">جارٍ تجهيز الخريطة الدقيقة للفرع. بمجرد اعتماد اللوكيشن النهائي هتظهر هنا مباشرة.</p>
      </section>

      <section className="rounded-2xl border border-brand-dark/10 bg-brand-white p-4 text-sm shadow-[0_8px_20px_rgba(18,18,18,0.04)]">
        <h2 className="text-lg font-black">معلومات إضافية</h2>
        <p className="mt-2 text-brand-charcoal">ساعات العمل هتتضاف بعد التأكيد.</p>
        <p className="mt-1 text-brand-charcoal">سياسة التوصيل هتتضاف بعد التأكيد.</p>
      </section>
    </div>
  );
}
