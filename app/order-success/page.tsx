import Link from 'next/link';
import { PageHero } from '@/components/shared/page-hero';
import { OrderTrackingCard } from '@/components/order-success/order-tracking-card';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';
import { buildWhatsappFollowupMessage, buildWhatsappOrderUrl } from '@/lib/whatsapp';

type OrderSuccessPageProps = {
  searchParams?: Promise<{
    orderId?: string;
    ref?: string;
    table?: string;
  }>;
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const orderId = typeof resolvedSearchParams?.orderId === 'string' ? resolvedSearchParams.orderId.trim() : '';
  const orderReference = typeof resolvedSearchParams?.ref === 'string' ? resolvedSearchParams.ref.trim() : '';
  const tableReference = typeof resolvedSearchParams?.table === 'string' ? resolvedSearchParams.table.trim() : '';

  const settings = await getRuntimePublicSiteSettings();
  const referenceForFollowup = orderReference || orderId;
  const followupMessage = referenceForFollowup ? buildWhatsappFollowupMessage(referenceForFollowup, tableReference || null) : '';
  const whatsappUrl = referenceForFollowup ? buildWhatsappOrderUrl(followupMessage, settings.whatsappOrderNumber) : null;

  return (
    <div className="space-y-6">
      <PageHero title="تم استلام طلبك" subtitle="شكرًا لطلبك من توسكانيني ❤️" />

      {orderId ? (
        <OrderTrackingCard orderId={orderId} fallbackReference={orderReference} fallbackTableReference={tableReference} />
      ) : (
        <section className="rounded-3xl border border-brand-dark/10 bg-brand-white p-5 shadow-[0_10px_24px_rgba(18,18,18,0.05)] sm:p-6">
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
        </section>
      )}

      <section className="rounded-2xl border border-brand-dark/10 bg-brand-white p-4 shadow-[0_8px_20px_rgba(18,18,18,0.04)] sm:p-5">
        <h2 className="text-base font-black text-brand-dark sm:text-lg">الخطوات التالية</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm font-bold text-brand-charcoal sm:text-base">
          <li>سيتم التواصل معك لتأكيد تفاصيل الطلب.</li>
          <li>لو طلبك دليفري، يُفضّل إرسال اللوكيشن على واتساب لتسريع التأكيد.</li>
          <li>بعد التأكيد، يبدأ المطعم في تجهيز الطلب.</li>
        </ul>
      </section>

      <section className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Link href="/menu" className="btn-primary min-h-11 w-full text-center">
          العودة إلى المنيو
        </Link>

        {whatsappUrl ? (
          <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-11 w-full text-center">
            متابعة عبر واتساب
          </Link>
        ) : null}
      </section>
    </div>
  );
}
