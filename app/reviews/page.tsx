import type { Metadata } from 'next';
import Link from 'next/link';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';
import '../rebirth-home.css';
import '../rebirth-feedback.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'شارك رأيك | توسكانيني — بني سويف',
  description: 'تواصل مع توسكانيني وشارك رأيك عن التجربة مباشرة، من غير تقييمات مفبركة.',
};

function whatsappLink(raw: string): string | null {
  const digits=raw.replace(/\D/g,'');
  const intl=digits.startsWith('0') ? `20${digits.slice(1)}` : digits;
  if (!/^\d{10,15}$/.test(intl)) return null;
  return `https://wa.me/${intl}?text=${encodeURIComponent('مرحبًا توسكانيني 👋\nحابب أشارك رأيي عن التجربة.')}`;
}

export default async function ReviewsPage() {
  const settings=await getRuntimePublicSiteSettings();
  const outbound=whatsappLink(settings.whatsappOrderNumber);
  return <div className="t-page t-feedback-page t-reviews-page" dir="rtl">
    <a className="t-skip" href="#t-feedback-main">انتقل لمشاركة الرأي</a>
    <ExperienceHeader />
    <main id="t-feedback-main">
      <section className="t-feedback-hero t-shell" aria-labelledby="t-feedback-title">
        <div className="t-feedback-hero__meta"><span>توسكانيني / صوتك مهم</span><span lang="en">REAL PEOPLE / REAL WORDS</span></div>
        <div className="t-feedback-hero__content">
          <span className="t-index">01 / YOUR OWN WORDS</span>
          <h1 id="t-feedback-title">قولنا<br/><em>رأيك.</em></h1>
          <div className="t-feedback-hero__aside">
            <span lang="en" className="t-feedback-hero__mark" aria-hidden="true">“</span>
            <p>جربت أكل توسكانيني؟ رأيك يهم، سواء عجبتك التجربة أو في حاجة شايف إنها محتاجة تتظبط.</p>
            <a href="#t-reviews-action">شارك رأيك <span aria-hidden="true">↓</span></a>
          </div>
        </div>
      </section>
      <section className="t-reviews-explanation t-shell" aria-labelledby="t-reviews-heading" id="t-reviews-action">
        <span className="t-index">02 / NO INVENTED RATINGS</span>
        <div>
          <h2 id="t-reviews-heading">من غير كلام<br/><em>على لسان حد.</em></h2>
          <p>إحنا مش بنعرض مراجعات داخل الموقع حاليًا، ومش هنحط اقتباسات أو نجوم من غير مصدر واضح. لكن تقدر توصل رأيك للمطعم مباشرة.</p>
          <div className="t-reviews-explanation__actions">
            {outbound ? <a className="t-reviews-explanation__cta" href={outbound} target="_blank" rel="noopener noreferrer">ابعت رأيك على واتساب <span aria-hidden="true">↗</span></a> : <Link className="t-reviews-explanation__cta" href="/contact">تواصل مع المطعم <span aria-hidden="true">↗</span></Link>}
            <Link href="/complaints">لو عندك مشكلة عايز تتابعها <span aria-hidden="true">↗</span></Link>
          </div>
          <p className="t-reviews-explanation__note">الزر بيفتح رسالة واتساب عندك؛ إرسال الرسالة بيتم من تطبيقك، مش تلقائيًا من الموقع.</p>
        </div>
      </section>
    </main>
    <ExperienceFooter />
  </div>;
}
