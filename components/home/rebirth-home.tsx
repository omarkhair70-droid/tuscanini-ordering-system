import Link from 'next/link';
import type { ReactNode } from 'react';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { FoodExploration } from '@/components/rebirth/food-exploration';

const foodFamilies = [
  {
    id: '01',
    name: 'الكريب',
    english: 'THE FOLD',
    note: 'الحشوة بتقول الباقي.',
    href: '/menu?category=crepe-tuscanini',
    photo: 't-card--crepe',
  },
  {
    id: '02',
    name: 'البيتزا',
    english: 'THE WHOLE',
    note: 'اختيارات تتقسم وتتشارك.',
    href: '/menu?category=pizza-tuscanini',
    photo: 't-card--pizza',
  },
  {
    id: '03',
    name: 'الساندوتشات',
    english: 'THE HOLD',
    note: 'لقمة على أصولها.',
    href: '/menu?category=sandwiches-french',
    photo: 't-card--sandwich',
  },
];

export function RebirthHome({ activeOrderSlot }: { activeOrderSlot?: ReactNode }) {
  return (
    <div className="t-page" dir="rtl">
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
            <h1 id="t-hero-title"><span>بُصّ</span><em>جُوَّه.</em></h1>
            <p className="t-hero__sub">أول لقمة بتبدأ من العين. اكتشف تفاصيل أكلك، واختار اللي على مزاجك.</p>
            <div className="t-hero__actions">
              <Link className="t-button t-button--dark" href="/menu">افتح المنيو <span aria-hidden="true">↗</span></Link>
              <a className="t-text-link" href="#t-main-story">شوف الحكاية <span aria-hidden="true">↓</span></a>
            </div>
          </div>
          <div className="t-hero__visual" aria-hidden="true">
            <div className="t-hero__photo t-photo t-photo--hero">
              <span className="t-photo__fallback">THE INSIDE<br/>IS THE EVENT</span>
            </div>
            <div className="t-hero__stamp" lang="en"><span>REAL FOOD.</span><span>REAL CRAVING.</span></div>
            <span className="t-hero__visualnote">01 / FOOD IN FOCUS</span>
          </div>
        </div>
        <div className="t-hero__bottom"><span>SCROLL TO EXPLORE</span><span aria-hidden="true">↓</span><span>توسكانيني / بني سويف</span></div>
      </section>

      <div className="t-ticker" aria-hidden="true"><div>CREPE <span>✳</span> PIZZA <span>✳</span> MORE THAN MEETS THE EYE <span>✳</span> TUSCANINI <span>✳</span></div></div>

      <main id="t-main-story" className="t-home-story">
        <section className="t-intro t-shell" aria-labelledby="t-intro-title">
          <span className="t-index">01 — THE FOOD</span>
          <div>
            <h2 id="t-intro-title">الحكاية مش<br/><em>بس من برّه.</em></h2>
            <p>كل كريب، وكل بيتزا، وكل ساندوتش له شكل وحكاية مختلفة. مش محتاج تحفظ أسماء كتير؛ اختار اللي يشهيك، والتفاصيل موجودة في المنيو.</p>
          </div>
        </section>

        <FoodExploration />

        <section className="t-detail" aria-labelledby="t-detail-title">
          <div className="t-detail__visual t-photo" aria-hidden="true"><span>IN DETAIL / 02</span></div>
          <div className="t-detail__content">
            <span className="t-index">04 — A CLOSER LOOK</span>
            <h2 id="t-detail-title">اللي جُوّه<br/><em>يفرق.</em></h2>
            <p>الاختيار مش مجرد اسم أو صورة. في المنيو هتلاقي الأصناف والأحجام والإضافات المتاحة، عشان تختار على أساس واضح.</p>
            <Link className="t-button t-button--outline" href="/menu">شوف كل الاختيارات <span aria-hidden="true">↗</span></Link>
          </div>
        </section>

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

        <section className="t-ending t-shell">
          <div className="t-ending__offer">
            <span className="t-index">06 — WHAT'S ON</span>
            <h2>العروض<br/><em>على مزاجك.</em></h2>
            <p>شوف العروض المتاحة وشروط كل عرض من صفحتها.</p>
            <Link href="/offers" className="t-text-link">شوف العروض <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="t-ending__place">
            <span className="t-index">FIND US / BENI SUEF</span>
            <p>توسكانيني، شارع البحر<br/>سور نادي توليب، بني سويف.</p>
            <Link href="/contact" className="t-text-link">تواصل معانا <span aria-hidden="true">↗</span></Link>
          </div>
        </section>
      </main>

      <footer className="t-footer">
        <div className="t-shell t-footer__inner">
          <span className="t-footer__word" lang="en">TUSCANINI.</span>
          <div><span>توسكانيني — بني سويف</span><nav aria-label="روابط التذييل"><Link href="/menu">المنيو</Link><Link href="/cart">السلة</Link><Link href="/reviews">الآراء</Link><Link href="/contact">تواصل</Link></nav></div>
        </div>
      </footer>

      <Link href="/menu" className="t-mobile-order">اطلب من المنيو <span aria-hidden="true">↗</span></Link>
    </div>
  );
}
