import Link from 'next/link';

/** Site-wide authored public footer. Checkout/staff information stays literal. */
export function ExperienceFooter() {
  return <footer className="t-footer">
    <div className="t-shell t-footer__inner">
      <Link href="/" className="t-footer__word" lang="en" dir="ltr" aria-label="توسكانيني — الرئيسية">TUSCANINI.</Link>
      <div>
        <span>توسكانيني / شارع البحر — سور نادي توليب — بني سويف</span>
        <nav aria-label="روابط تذييل الموقع">
          <Link href="/menu">المنيو</Link>
          <Link href="/offers">العروض</Link>
          <Link href="/cart">السلة</Link>
          <Link href="/about">الحكاية</Link>
          <Link href="/contact">التواصل</Link>
          <Link href="/reviews">الآراء</Link>
          <Link href="/complaints">المساعدة</Link>
        </nav>
      </div>
    </div>
  </footer>;
}
