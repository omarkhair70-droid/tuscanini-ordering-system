import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocalStudioOrigin } from '@/lib/studio-bridge';
import { StudioOrderRoom } from '@/components/studio/studio-order-room';
import '../rebirth-home.css';
import '../rebirth-customer-journey.css';
import '../studio.css';

export const dynamic='force-dynamic';
export default function StudioPage(){
  if(!getLocalStudioOrigin())notFound();
  return <div className="t-studio" dir="rtl">
    <header className="t-studio__top"><Link href="/" className="t-studio__logo">TUSCANINI.</Link>
      <span>ONE ORDER / TWO WORLDS</span><Link href="/operator/orders">شاشة المطعم ↗</Link></header>
    <main className="t-studio__wrap"><div className="t-studio__intro"><span>01 / THE CUSTOMER EXPERIENCE</span>
      <h1>اختار. اطلب. عيش الحكاية.</h1>
      <p>دي رحلة تجريبية حقيقية متصلة بقاعدة بيانات محلية. هننقل نفس الربط لمنيو Rebirth الأصلي بعد ما نضبط الأحجام والإضافات.</p>
    </div><StudioOrderRoom mode="customer"/></main>
  </div>;
}
