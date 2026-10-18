import type { Metadata } from 'next';
import Link from 'next/link';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import { RebirthComplaintsForm } from '@/components/rebirth/rebirth-complaints-form';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';
import '../rebirth-home.css';
import '../rebirth-complaints.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'مساعدة وشكاوى | توسكانيني — بني سويف',
  description: 'تواصل مع توسكانيني بخصوص مشكلة في الطلب أو الخدمة عن طريق تجهيز رسالة واتساب مباشرة.',
};

export default async function ComplaintsPage() {
  const settings = await getRuntimePublicSiteSettings();
  return <div className="t-page t-complaints-page" dir="rtl">
    <a className="t-skip" href="#t-complaints-form">انتقل لنموذج الشكوى</a>
    <ExperienceHeader />
    <main>
      <header className="t-complaints-hero t-shell">
        <div className="t-complaints-hero__meta"><span>توسكانيني / مساعدة وشكاوى</span><span lang="en">HELP / NOT A PROMISE OF RESOLUTION</span></div>
        <div className="t-complaints-hero__grid">
          <div><span className="t-index">01 — TELL US WHAT HAPPENED</span><h1>حصلت<br/><em>مشكلة؟</em></h1></div>
          <div className="t-complaints-hero__aside">
            <p>قولنا إيه اللي حصل في الطلب أو الخدمة. هنجهزلك رسالة فيها التفاصيل علشان تبعتها للمطعم بنفسك على واتساب.</p>
            <a href="#t-complaints-form">اكتب التفاصيل <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </header>
      <section className="t-complaints-body t-shell" aria-labelledby="t-complaints-form-title">
        <div className="t-complaints-body__info">
          <span className="t-index" lang="en">02 — YOUR MESSAGE</span>
          <h2 id="t-complaints-form-title">كل التفاصيل<br/><em>تفرق.</em></h2>
          <p>مش هنقول إن الشكوى اتسجلت في نظام المطعم لمجرد إنك كتبتها هنا. الإرسال الفعلي بيتم من واتساب بعد ما تراجع الرسالة.</p>
          <div className="t-complaints-body__side-links">
            <Link href="/contact">عايز تتصل بالمطعم؟ <span aria-hidden="true">↗</span></Link>
            <Link href="/reviews">شارك رأيك عن التجربة <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <RebirthComplaintsForm whatsappNumber={settings.whatsappOrderNumber} />
      </section>
    </main>
    <ExperienceFooter />
  </div>;
}
