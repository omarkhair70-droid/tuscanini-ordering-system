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
            <p className="t-overline">توسكانيني / بني سويف</p>
            <h1 id="t-hero-title"><span>بص</span><em>جوه.</em></h1>
            <p className="t-hero__voice"><span>توسكانيني</span><strong>الكريب بيتكلم.</strong></p>
            <p className="t-hero__sub">كريب، بيتزا، وساندوتشات تتشاف قبل ما تتطلب. اختار اللي فتح نفسك.</p>
            <div className="t-hero__actions">
              <Link className="t-button t-button--dark" href="/menu">افتح المنيو <span aria-hidden="true">↗</span></Link>
              <a className="t-text-link" href="#t-main-story">شوف الحكاية <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="t-hero__visual">
            <span className="t-hero__underprint" lang="en" aria-hidden="true">TUSCANINI</span>
            <div className="t-hero__backplate"><FoodPhoto id="TSC-07" priority /></div>
            <FoodPhoto id="TSC-09" priority className="t-hero__photo" />
            <div className="t-hero__stamp" aria-hidden="true"><span>من قلب</span><span>بني سويف</span></div>
            <span className="t-hero__photo-label">شوف الحشو</span>
            <span className="t-hero__visualnote">توسكانيني / كريب</span>
          </div>
        </div>
        <div className="t-hero__bottom"><span>انزل واتفرّج</span><span aria-hidden="true">↓</span><span>توسكانيني / بني سويف</span></div>
      </section>

      <div className="t-ticker" role="img" aria-label="توسكانيني، كريب وبيتزا وساندوتشات">
        <div className="t-ticker__track" aria-hidden="true">
          <div className="t-ticker__set"><span>CREPE</span><b aria-hidden="true">✳</b> <span>PIZZA</span><b aria-hidden="true">✳</b> <span>SANDWICHES</span><b aria-hidden="true">✳</b> <span>TUSCANINI</span><b aria-hidden="true">✳</b></div>
          <div className="t-ticker__set"><span>CREPE</span><b aria-hidden="true">✳</b> <span>PIZZA</span><b aria-hidden="true">✳</b> <span>SANDWICHES</span><b aria-hidden="true">✳</b> <span>TUSCANINI</span><b aria-hidden="true">✳</b></div>
        </div>
      </div>

      <main id="t-main-story" className="t-home-story">
        <FoodExploration />

        <MaterialReveal />

        <PackagingChapter />

        <PlaceChapter />
      </main>

      <ExperienceFooter />


      <Link href="/menu" className="t-mobile-order">اطلب من المنيو <span aria-hidden="true">↗</span></Link>
    </div>
  );
}
