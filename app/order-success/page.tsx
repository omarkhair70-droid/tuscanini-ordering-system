import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import type { Metadata } from 'next';
import Link from 'next/link';
import { RebirthOrderTracking } from '@/components/rebirth/rebirth-order-tracking';
import { CustomerJourney } from '@/components/rebirth/customer-journey';
import '../rebirth-home.css';
import '../rebirth-checkout.css';
import '../rebirth-tracking.css';
import '../rebirth-customer-journey.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'متابعة الطلب | توسكانيني',
  description: 'شوف حالة طلبك المسجلة من المطعم، من انتظار التأكيد لحد الاستلام.',
  robots: { index: false, follow: false, noarchive: true },
};

type Props = { searchParams?: Promise<{ orderId?: string }> };

export default async function OrderSuccessPage({searchParams}: Props) {
  const query = searchParams ? await searchParams : {};
  const orderId = typeof query.orderId==='string' ? query.orderId.trim() : '';
  // Do not infer an order exists just because this route opens.
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId);
  return (
    <div className="t-page t-order-page" dir="rtl">
      <a className="t-skip" href="#t-order-content">انتقل إلى حالة الطلب</a>
      <ExperienceHeaderWrapper />
      <main id="t-order-content">
        <header className="t-order-hero t-shell">
          <span className="t-index">YOUR ORDER / TUSCANINI</span>
          <h1>تابع <em>طلبك.</em></h1>
          <p>هنا آخر حالة سجّلها المطعم لطلبك. الصفحة بتتحدّث تلقائيًا وهي مفتوحة.</p>
        </header>
        <div className="t-shell t-order-page__content">
          {valid && <CustomerJourney stage="tracking" />}
          {valid ? <RebirthOrderTracking orderId={orderId} /> :
            <section className="t-order-missing" role="status">
              <span className="t-index">ORDER LINK / TUSCANINI</span>
              <h2>مفيش رقم<br/>طلب صالح هنا.</h2>
              <p>افتح رابط المتابعة اللي ظهر لك بعد تسجيل طلبك، أو تواصل مع المطعم لو محتاج مساعدة.</p>
            </section>}
          <section className="t-order-next">
            <div><span className="t-index">CAN WE HELP?</span><h2>محتاج مساعدة؟</h2>
              <p>{valid
                ? 'لو عندك سؤال عن الاستلام أو تفاصيل الأوردر، كلم المطعم واذكر مرجع الطلب.'
                : 'لو رابط المتابعة مش شغال معاك، افتح المنيو أو تواصل مع المطعم.'}</p></div>
            <div className="t-order-next__links"><Link href="/menu">ارجع للمنيو ↗</Link><Link href="/contact">تواصل مع المطعم ↗</Link></div>
          </section>
        </div>
      </main>
      <ExperienceFooter />
    </div>
  );
}

import { ExperienceHeader } from '@/components/rebirth/experience-header';
function ExperienceHeaderWrapper() { return <ExperienceHeader />; }
