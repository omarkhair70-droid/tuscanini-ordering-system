import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import type { Metadata } from 'next';
import Link from 'next/link';
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
          <div className="t-offers-hero__title"><h1>على<br/><em>الجاهز.</em></h1><div><span className="t-index">WHAT'S ACTUALLY ON</span><p>العروض اللي متاحة دلوقتي بس. مش بنوعدك بخصم قديم أو سعر مش مؤكد.</p></div></div>
          <div className="t-offers-hero__foot"><span>FRESH INFORMATION / NO MADE-UP CAMPAIGNS</span><Link href="/menu">روح للمنيو ↗</Link></div>
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
