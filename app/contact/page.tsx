import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { siteConfig } from '@/lib/site-config';

function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `20${digits.slice(1)}`;
  }
  return digits;
}

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${normalizeWhatsappNumber(siteConfig.whatsappOrderNumber)}`;

  return (
    <div className="space-y-6">
      <PageHero title="اتصل بنا" subtitle="اطلب الآن أو تواصل معنا مباشرة." />

      <section className="rounded-2xl border p-4 text-sm">
        <h2 className="text-lg font-black">بيانات التواصل</h2>

        <p className="mt-3 font-bold">العنوان:</p>
        <p>{siteConfig.addressAr}</p>

        <p className="mt-3 font-bold">أرقام التليفون:</p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link href={`tel:${siteConfig.phonePrimary}`} className="btn-secondary bg-brand-white text-center">
            اتصال {siteConfig.phonePrimary}
          </Link>
          <Link href={`tel:${siteConfig.phoneSecondary}`} className="btn-secondary bg-brand-white text-center">
            اتصال {siteConfig.phoneSecondary}
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link href={whatsappUrl} target="_blank" className="btn-primary text-center">
            اطلب عبر واتساب
          </Link>
          <Link href={siteConfig.facebook} target="_blank" className="btn-secondary bg-brand-white text-center">
            صفحة فيسبوك
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border-2 border-dashed border-brand-charcoal/30 bg-brand-white p-4 text-sm">
        <h2 className="text-lg font-black">الخريطة</h2>
        <p className="mt-2 text-brand-charcoal">الخريطة هتتضاف بعد تأكيد اللوكيشن</p>
      </section>

      <section className="rounded-2xl border-2 border-dashed border-brand-charcoal/30 bg-brand-white p-4 text-sm">
        <h2 className="text-lg font-black">معلومات إضافية</h2>
        <p className="mt-2 text-brand-charcoal">ساعات العمل هتتضاف بعد التأكيد.</p>
        <p className="mt-1 text-brand-charcoal">سياسة التوصيل هتتضاف بعد التأكيد.</p>
      </section>
    </div>
  );
}
