import Image from 'next/image';
import Link from 'next/link';

/** Real physical restaurant evidence, not a fictional production or delivery ritual. */
export function PackagingChapter() {
  return (
    <section className="t-packaging" aria-labelledby="t-packaging-title">
      <div className="t-packaging__photo">
        <Image
          src="/images/rebirth/food-08.jpg"
          alt="ساندوتشات توسكانيني بجانب العلب الحمراء وورق التغليف المطبوع الحقيقي"
          fill loading="eager" sizes="(max-width: 760px) 100vw, 50vw"
          className="t-packaging__photo-img"
        />
        <span className="t-packaging__photo-label" lang="en">TSC-08 / ACTUAL TUSCANINI PACKAGING</span>
      </div>
      <div className="t-packaging__content">
        <div className="t-packaging__eyebrow">
          <span className="t-index">04 / THE OBJECT</span>
          <span lang="en">FOOD. HANDS. WRAPPING.</span>
        </div>
        <h2 id="t-packaging-title">مش بس<br/><em>اللقمة.</em><br/>العلبة كمان.</h2>
        <div className="t-packaging__bottom">
          <p>العلبة الحمرا، وورق التغليف المطبوع، والأكل قدامك. تفاصيل بتكمّل الإحساس حتى قبل أول لقمة.</p>
          <Link href="/menu">شوف الأكل كله <span aria-hidden="true">↗</span></Link>
        </div>
        <span className="t-packaging__ghost" lang="en" aria-hidden="true">04</span>
      </div>
    </section>
  );
}

export function PlaceChapter() {
  return (
    <section className="t-place-final" aria-labelledby="t-place-final-title">
      <div className="t-place-final__copy">
        <span className="t-index">06 / THE PLACE — BENI SUEF</span>
        <h2 id="t-place-final-title">الحكاية<br/>في بني<br/><em>سويف.</em></h2>
        <p>شارع البحر، سور نادي توليب، بني سويف.</p>
        <div className="t-place-final__links">
          <Link href="/contact">المكان والتواصل <span aria-hidden="true">↗</span></Link>
          <Link href="/offers">العروض الحالية <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="t-place-final__art" aria-hidden="true">
        <span className="t-place-final__orbit">TUSCANINI / BENI SUEF /</span>
        <span className="t-place-final__stamp">BNS<br/><small>EGYPT</small></span>
      </div>
    </section>
  );
}
