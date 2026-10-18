import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import '../rebirth-home.css';
import '../rebirth-about.css';

export const metadata: Metadata = {
  title: 'الحكاية | توسكانيني — بني سويف',
  description: 'شوف ناس توسكانيني، صور الأكل والتغليف الحقيقي، ومكان المطعم في بني سويف.',
};

/**
 * Documentary restaurant story. The previous legacy About route asserted an
 * unconfirmed named four-founder narrative. It is deliberately NOT repeated.
 * These photos verify people handling/presenting food, physical branding and
 * the visible restaurant context; not founding history or a production process.
 */
export default function AboutPage() {
  return (
    <div className="t-page t-about-page" dir="rtl">
      <a className="t-skip" href="#t-about-main">انتقل لحكاية توسكانيني</a>
      <ExperienceHeader />
      <main id="t-about-main">
        <section className="t-about-hero t-shell" aria-labelledby="t-about-title">
          <div className="t-about-hero__meta">
            <span>توسكانيني / بني سويف</span>
            <span lang="en">THE PEOPLE / THE FOOD / THE PLACE</span>
          </div>
          <div className="t-about-hero__grid">
            <div className="t-about-hero__copy">
              <span className="t-index">مش مجرد صورة للأكل</span>
              <h1 id="t-about-title">ناس، أكل،<br/><em>ومكان.</em></h1>
              <p>هنا توسكانيني في بني سويف. أكل ظاهر على حقيقته، ناس بتقدمه، وتفاصيل تقدر تشوفها بعينك.</p>
              <div className="t-about-hero__links">
                <Link href="/menu">شوف المنيو <span aria-hidden="true">↗</span></Link>
                <Link href="/contact">المكان والتواصل <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <figure className="t-about-hero__photograph">
              <Image src="/images/rebirth/food-06.jpg" alt="شخص من توسكانيني يعرض مجموعة كريبات محشوة في المطعم" fill priority sizes="(max-width: 720px) 90vw, 40vw" />
              <figcaption><span lang="en">TSC-06</span> / من صور توسكانيني الحقيقية</figcaption>
            </figure>
          </div>
        </section>

        <section className="t-about-observed" aria-labelledby="t-about-observed-title">
          <div className="t-shell t-about-observed__heading">
            <span className="t-index">01 / FROM THE RESTAURANT</span>
            <div>
              <h2 id="t-about-observed-title">بص للتفاصيل.</h2>
              <p>الأكل اللي قدامك، الشعار اللي في المكان، والعلب المطبوعة. كل صورة هنا بتوريك جانب مختلف من توسكانيني.</p>
            </div>
          </div>
          <div className="t-about-observed__photos t-shell">
            <figure className="t-about-observed__scene t-about-observed__scene--place">
              <Image src="/images/rebirth/food-01.jpg" loading="eager" alt="مجموعة كريبات حقيقية أمام شعار توسكانيني داخل المكان" fill sizes="(max-width: 720px) 92vw, 55vw" />
              <figcaption><strong>في المكان</strong><span lang="en">TSC / 01</span></figcaption>
            </figure>
            <figure className="t-about-observed__scene t-about-observed__scene--wrap">
              <Image src="/images/rebirth/food-08.jpg" loading="eager" alt="ساندوتشات بجانب عبوات توسكانيني الحمراء وورق التغليف المطبوع" fill sizes="(max-width: 720px) 74vw, 34vw" />
              <figcaption><strong>على العلبة</strong><span lang="en">TSC / 08</span></figcaption>
            </figure>
          </div>
          <p className="t-about-observed__note t-shell">الصور من المطعم نفسه، ومش بديل عن وصف الصنف أو سعره في المنيو.</p>
        </section>

        <section className="t-about-visit" aria-labelledby="t-about-visit-title">
          <div className="t-about-visit__inner t-shell">
            <span className="t-index" lang="en">02 / BENI SUEF, EGYPT</span>
            <div>
              <h2 id="t-about-visit-title">مستنيينك في <em>بني سويف.</em></h2>
              <p>شارع البحر — سور نادي توليب.</p>
            </div>
            <Link href="/contact">شوف المكان والتواصل <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>
      <ExperienceFooter />
    </div>
  );
}
