import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { RebirthOfferAction } from '@/components/rebirth/rebirth-offer-action';
import { getActivePublicOffers } from '@/lib/offers-runtime';
import type { PublicOffer } from '@/types/offers';
import '../rebirth-home.css';
import '../rebirth-offers.css';

export const dynamic='force-dynamic';
export const revalidate=0;
export const metadata:Metadata={title:'العروض | توسكانيني',description:'العروض الرسمية المتاحة حاليًا من توسكانيني، وشروطها وأسعارها.'};

export default async function OffersPage() {
  let offers:PublicOffer[]=[];
  let sourceError=false;
  try{offers=await getActivePublicOffers()}catch{sourceError=true}
  return (
    <div className="t-page t-offers-page" dir="rtl">
      <a className="t-skip" href="#t-offers-list">انتقل للعروض</a>
      <ExperienceHeader/>
      <main>
        <header className="t-offers-hero t-shell">
          <div className="t-offers-hero__meta"><span>OFFERS / THE REAL ONES</span><span>توسكانيني — بني سويف</span></div>
          <div className="t-offers-hero__title">
            <div className="t-offers-hero__words">
              <span className="t-index">OFFERS / WHEN THEY'RE REAL</span>
              <h1>على<br/><em>الجاهز.</em></h1>
              <p>العروض اللي متاحة دلوقتي بس. من غير خصم قديم ولا سعر مش مؤكد.</p>
            </div>
            <figure className="t-offers-hero__photo">
              <Image src="/images/rebirth/food-11.jpg" alt="صورة أصلية لوجبة من توسكانيني بجانب عبوات الطعام، ليست صورة لعرض معين" fill priority sizes="(max-width: 720px) 88vw, 36vw" />
              <figcaption>صورة من المطعم — مش صورة عرض محدد</figcaption>
              <span className="t-offers-hero__photo-index" lang="en" aria-hidden="true">TSC / 11</span>
            </figure>
          </div>
          <div className="t-offers-hero__foot"><span>{sourceError ? 'تعذر التحقق من العروض' : offers.length ? `${offers.length} عرض متاح` : 'مفيش عروض سارية مؤكدة دلوقتي'}</span><Link href="/menu">روح للمنيو ↗</Link></div>
        </header>
        <section className="t-shell t-offers-list" id="t-offers-list" aria-labelledby="t-offers-heading">
          <div className="t-offers-list__heading"><span className="t-index">01 — FROM THE RESTAURANT</span><h2 id="t-offers-heading">اللي متاح.</h2></div>
          {sourceError ? (
            <div className="t-offers-empty" role="status"><h3>مش قادرين نتحقق من العروض.</h3><p>مفيش أي عرض أو سعر هنخمنه. جرّب المنيو أو تواصل مع المطعم.</p><Link href="/contact">تواصل معانا ↗</Link></div>
          ) : offers.length ? (
            <div className="t-offers-grid">{offers.map((offer,index)=>(
              <article key={offer.id} className="t-offers-card" id={`offer-${offer.id}`}>
                <div className="t-offers-card__top"><span lang="en">OFFER / {String(index+1).padStart(2,'0')}</span>{offer.badgeAr&&<span>{offer.badgeAr}</span>}</div>
                <h3>{offer.titleAr}</h3>
                {offer.descriptionAr&&<p className="t-offers-card__description">{offer.descriptionAr}</p>}
                {typeof offer.offerPrice==='number' ? <div className="t-offers-card__buy">
                  <div><small>سعر العرض الحالي</small><strong>{offer.offerPrice.toLocaleString('ar-EG')} ج.م</strong></div>
                  <RebirthOfferAction id={offer.id} title={offer.titleAr} price={offer.offerPrice}/>
                </div> : <p className="t-offers-card__terms">للتفاصيل والسعر النهائي، اسأل المطعم قبل الطلب. {offer.priceText??''}</p>}
              </article>
            ))}</div>
          ) : (
            <div className="t-offers-empty" role="status">
              <span className="t-index">NO ACTIVE OFFERS</span><h3>مفيش عروض<br/>مؤكدة دلوقتي.</h3>
              <p>بنظهر هنا العروض السارية بس. تقدر تشوف الأصناف المتاحة في المنيو.</p><Link href="/menu">افتح المنيو ↗</Link>
            </div>
          )}
        </section>
      </main>
      <ExperienceFooter />
    </div>
  );
}
