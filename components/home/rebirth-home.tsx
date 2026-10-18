import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { FoodExploration, FoodPhoto } from '@/components/rebirth/food-exploration';
import { MaterialReveal } from '@/components/rebirth/material-reveal';
import { PackagingChapter, PlaceChapter } from '@/components/rebirth/physical-chapters';

export function RebirthHome({ activeOrderSlot }: { activeOrderSlot?: ReactNode }) {
  return (
    <div className="t-page t-home-page" dir="rtl">
      <a className="t-skip" href="#t-main-story">تخطَّ المقدمة وانتقل للمحتوى</a>

      <ExperienceHeader />
      <div className="t-active-order-slot">{activeOrderSlot}</div>

      <section className="t-hero" aria-labelledby="t-hero-title">
        <div className="t-hero__headerline">
          <span>TUSCANINI / BENI SUEF</span><span>شارع البحر — سور نادي توليب</span>
        </div>
        <div className="t-hero__grid">
          <div className="t-hero__words">
            <p className="t-overline">مش كل الحكاية من برّه</p>
            <h1 id="t-hero-title"><span>بص</span><em>جوه.</em></h1>
            <p className="t-hero__sub">أول لقمة بتبدأ من العين. اكتشف تفاصيل أكلك، واختار اللي على مزاجك.</p>
            <div className="t-hero__actions">
              <Link className="t-button t-button--dark" href="/menu">افتح المنيو <span aria-hidden="true">↗</span></Link>
              <a className="t-text-link" href="#t-main-story">شوف الحكاية <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="t-hero__visual">
            <span className="t-hero__underprint" lang="en" aria-hidden="true">TUSCANINI</span>
            <div className="t-hero__backplate"><FoodPhoto id="TSC-06" priority /></div>
            <FoodPhoto id="TSC-09" priority className="t-hero__photo" />
            <div className="t-hero__stamp" lang="en" aria-hidden="true"><span>REAL FOOD.</span><span>REAL CRAVING.</span></div>
            <span className="t-hero__photo-label" lang="en">REAL / NOT RENDERED</span>
            <span className="t-hero__photo-facts">صور حقيقية من توسكانيني</span>
            <span className="t-hero__visualnote">01 / FOOD IN FOCUS</span>
          </div>
        </div>
        <div className="t-hero__bottom"><span>SCROLL TO EXPLORE</span><span aria-hidden="true">↓</span><span>توسكانيني / بني سويف</span></div>
      </section>

      <div className="t-ticker" role="img" aria-label="توسكانيني، كريب وبيتزا وساندوتشات">
        <div className="t-ticker__track" aria-hidden="true">
          <div className="t-ticker__set"><span>CREPE</span><b aria-hidden="true">✳</b> <span>PIZZA</span><b aria-hidden="true">✳</b> <span>SANDWICHES</span><b aria-hidden="true">✳</b> <span>TUSCANINI</span><b aria-hidden="true">✳</b></div>
          <div className="t-ticker__set"><span>CREPE</span><b aria-hidden="true">✳</b> <span>PIZZA</span><b aria-hidden="true">✳</b> <span>SANDWICHES</span><b aria-hidden="true">✳</b> <span>TUSCANINI</span><b aria-hidden="true">✳</b></div>
        </div>
      </div>

      <main id="t-main-story" className="t-home-story">
        <section className="t-intro t-shell" aria-labelledby="t-intro-title">
          <span className="t-index">01 — THE FOOD</span>
          <div>
            <h2 id="t-intro-title">الحكاية مش<br/><em>بس من برّه.</em></h2>
            <p>كل كريب، وكل بيتزا، وكل ساندوتش له شكل وحكاية مختلفة. مش محتاج تحفظ أسماء كتير؛ اختار اللي يشهيك، والتفاصيل موجودة في المنيو.</p>
          </div>
        </section>

        <FoodExploration />

        <MaterialReveal />

        <PackagingChapter />

        <section className="t-quick t-shell" aria-labelledby="t-quick-title">
          <div className="t-quick__copy">
            <span className="t-index">05 — YOUR WAY</span>
            <h2 id="t-quick-title">عارف نفسك<br/><em>هتاكل إيه؟</em></h2>
            <p>ادخل على المنيو على طول. مش لازم تلف في كل التفاصيل عشان توصل لطلبك.</p>
            <div className="t-quick__actions">
              <Link href="/menu" className="t-button t-button--paper">روح للمنيو <span aria-hidden="true">↗</span></Link>
              <Link href="/food-finder" className="t-quick__secondary">محتار؟ جرّب اختيارات الأكل</Link>
            </div>
          </div>
          <div className="t-quick__art" aria-hidden="true"><span lang="en">GOOD FOOD<br/>NO DETOURS.</span></div>
        </section>

        <PlaceChapter />
      </main>

      <ExperienceFooter />


      <Link href="/menu" className="t-mobile-order">اطلب من المنيو <span aria-hidden="true">↗</span></Link>
    </div>
  );
}
