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

export default async function ReviewsPage() {
  const settings = await getRuntimePublicSiteSettings();
  const whatsappUrl = `https://wa.me/${normalizeWhatsappNumber(settings.whatsappOrderNumber)}?text=${encodeURIComponent(
    'مرحبًا توسكانيني 👋\nحابب أشارك رأيي عن التجربة.',
  )}`;

  return (
    <div className="safe-bottom-mobile space-y-6">
      <PageHero title="آراء العملاء" subtitle="مساحة مخصصة لآراء العملاء هتظهر هنا بشكل منظم قريبًا." />

      <section className="surface-card">
        <h2 className="text-xl font-black">مساحة آراء العملاء قريبًا 💬</h2>
        <p className="mt-3 text-sm leading-7 text-brand-charcoal">
          حاليًا لا يتم عرض أو تخزين أي مراجعات داخل الموقع. بعد الانتهاء من النسخة الرسمية، هنوفر تجربة أوضح لعرض آراء
          العملاء بشكل منظم.
        </p>
        <p className="mt-2 text-sm leading-7 text-brand-charcoal">
          تحب تشاركنا رأيك الآن؟ ابعتلنا مباشرة على واتساب، ورأيك يهمنا جدًا في تحسين التجربة.
        </p>

        <div className="mt-4">
          <Link href={whatsappUrl} target="_blank" className="btn-primary w-full sm:w-auto">
            أرسل رأيك عبر واتساب
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-brand-charcoal/35 bg-brand-white p-4 text-sm text-brand-charcoal">
        <p className="font-semibold text-brand-dark">بدون مراجعات معروضة حاليًا.</p>
        <p className="mt-1 leading-6">اختيار مقصود — لا تقييمات مفبركة أو منسوخة.</p>
      </section>
    </div>
  );
}
