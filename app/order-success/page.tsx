import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';

type OrderSuccessPageProps = {
  searchParams?: Promise<{
    ref?: string;
    table?: string;
  }>;
};

function normalizeWhatsappNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `20${digits.slice(1)}`;
  }
  return digits;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const orderReference = typeof resolvedSearchParams?.ref === 'string' ? resolvedSearchParams.ref.trim() : '';
  const tableReference = typeof resolvedSearchParams?.table === 'string' ? resolvedSearchParams.table.trim() : '';

  const settings = await getRuntimePublicSiteSettings();
  const normalizedWhatsappNumber = normalizeWhatsappNumber(settings.whatsappOrderNumber);
  const whatsappUrl = normalizedWhatsappNumber ? `https://wa.me/${normalizedWhatsappNumber}` : null;

  return (
    <div className="space-y-6">
      <PageHero title="تم استلام طلبك" subtitle="شكرًا لطلبك من توسكانيني ❤️" />

      <section className="rounded-3xl border-2 border-brand-dark bg-brand-white p-5 shadow-punch sm:p-6">
        <div className="space-y-3">
          <p className="text-lg font-black text-brand-dark sm:text-xl">تم استلام طلبك</p>
          <p className="rounded-xl border border-brand-dark/20 bg-brand-yellow/30 px-3 py-2 text-sm font-bold text-brand-dark sm:text-base">
            طلبك في انتظار تأكيد المطعم
          </p>

          {orderReference ? (
            <div className="rounded-xl border border-brand-dark/20 bg-brand-white px-4 py-3">
              <p className="text-xs font-bold text-brand-charcoal">مرجع الطلب</p>
              <p className="mt-1 text-base font-black text-brand-red sm:text-lg">{orderReference}</p>
            </div>
          ) : null}

          {tableReference ? (
            <div className="rounded-xl border border-brand-dark/20 bg-brand-white px-4 py-3">
              <p className="text-xs font-bold text-brand-charcoal">مرجع الطاولة</p>
              <p className="mt-1 text-base font-black text-brand-dark sm:text-lg">{tableReference}</p>
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link href="/menu" className="btn-primary w-full text-center">
            العودة إلى المنيو
          </Link>

          {whatsappUrl ? (
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary w-full bg-brand-white text-center">
              متابعة عبر واتساب
            </Link>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-brand-dark/20 bg-brand-white p-4 sm:p-5">
        <h2 className="text-base font-black text-brand-dark sm:text-lg">الخطوات التالية</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm font-bold text-brand-charcoal sm:text-base">
          <li>سيتم التواصل معك لتأكيد تفاصيل الطلب.</li>
          <li>لو طلبك دليفري، يُفضّل إرسال اللوكيشن على واتساب لتسريع التأكيد.</li>
          <li>بعد التأكيد، يبدأ المطعم في تجهيز الطلب.</li>
        </ul>
      </section>
    </div>
  );
}
