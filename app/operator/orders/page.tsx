import Link from 'next/link';
import type { Metadata } from 'next';
import { getLocalStudioOrigin } from '@/lib/studio-bridge';
import {oracleOrdersEnabled} from '@/lib/oracle-order-api';
import { OperatorPress } from '@/components/studio/operator-press';
import '../../studio.css';
import '../../operator-press.css';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'شاشة طلبات المطعم | توسكانيني',robots:{index:false,follow:false,noarchive:true}};
export default function OperatorOrdersPage(){
  // Visual test fixtures are NEVER served to actual visitors or staff.
  // Explicit local CI opt-in only; production and regular previews fail closed.
  const internalDesignReview=process.env.TUSCANINI_INTERNAL_VISUAL_QA==='yes';
  const hasOrderBackend=Boolean(getLocalStudioOrigin())||oracleOrdersEnabled();
  const publicDemo=internalDesignReview&&!hasOrderBackend;
  if(!hasOrderBackend&&!publicDemo){
    return <div className="t-studio" dir="rtl">
      <header className="t-studio__top"><Link href="/" className="t-studio__logo">TUSCANINI.</Link>
        <span>ORDER ROOM / TUSCANINI</span><Link href="/contact">تواصل مع المطعم ↗</Link></header>
      <main className="op-page">
        <section className="op-unavailable" role="status" aria-labelledby="op-unavailable-title">
          <span lang="en">TUSCANINI / ORDERS</span>
          <h1 id="op-unavailable-title">شاشة الطلبات غير متاحة حاليًا.</h1>
          <p>استقبال الأوردرات من الموقع متوقف حاليًا. تقدر ترجع للموقع أو تتواصل مع المطعم.</p>
          <div><Link href="/">الرئيسية ↗</Link><Link href="/contact">طرق التواصل ↗</Link></div>
        </section>
      </main>
    </div>;
  }
  // This is a time-limited, explicitly authorized historical-menu import,
  // NOT an automatic publication of merchant-approved live prices.
  const canSyncCatalog=!publicDemo&&oracleOrdersEnabled()&&
    process.env.TUSCANINI_ALLOW_CATALOG_SYNC==='yes';
  // One operator screen in both Vercel environments. When Oracle is selected,
  // it shows the private authenticated real queue; otherwise the exact same
  // UI presents local synthetic examples, never real customer data.
  return <div className="t-studio" dir="rtl">
    <header className="t-studio__top"><Link href="/" className="t-studio__logo">TUSCANINI.</Link>
      <span>ORDER ROOM / OPERATOR</span><Link href={publicDemo?'/menu':'/studio'}>واجهة العميل ↗</Link></header>
    <main className="op-page">
      {publicDemo&&<p className="op-remote-preview" role="note">
        <strong>جرّب شاشة الأوردرات بنفسك.</strong>
        هنا ٢٠ أوردر تجريبي، تقدر تقبلهم وترفضهم وتحركهم من التحضير للتسليم،
        وتغيّر بين المسرح الرئيسي وشريط التذاكر. التعديلات في متصفحك بس؛
        مش أوردرات عملاء حقيقية.
      </p>}
      <OperatorPress publicDemo={publicDemo} allowDesignPreview={internalDesignReview} canSyncCatalog={canSyncCatalog}/>
    </main>
  </div>;
}
