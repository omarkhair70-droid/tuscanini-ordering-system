import Link from 'next/link';
import { getLocalStudioOrigin } from '@/lib/studio-bridge';
import {oraclePreviewEnabled} from '@/lib/oracle-order-api';
import { OperatorPress } from '@/components/studio/operator-press';
import '../../studio.css';
import '../../operator-press.css';

export const dynamic='force-dynamic';
export default function OperatorOrdersPage(){
  const publicDemo=!getLocalStudioOrigin()&&!oraclePreviewEnabled();
  // Demo is open by default. Preview with reviewed Oracle env settings
  // shows actual orders after passkey entry, no synthetic tickets.
  // Production never exposes the localhost operator service or customer data.
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
      <OperatorPress publicDemo={publicDemo}/>
    </main>
  </div>;
}
