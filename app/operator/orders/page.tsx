import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocalStudioOrigin } from '@/lib/studio-bridge';
import { StudioOrderRoom } from '@/components/studio/studio-order-room';
import '../../studio.css';

export const dynamic='force-dynamic';
export default function OperatorOrdersPage(){
  if(!getLocalStudioOrigin())notFound();
  return <div className="t-studio" dir="rtl">
    <header className="t-studio__top"><Link href="/" className="t-studio__logo">TUSCANINI.</Link>
      <span>ORDER ROOM / OPERATOR</span><Link href="/studio">واجهة العميل ↗</Link></header>
    <main className="t-studio__wrap"><div className="t-studio__intro"><span>02 / TABLET INBOX</span>
      <h1>الأوردرات تحت إيدك.</h1><p>استقبل أوردرات التجربة، اقبلها، ابدأ التحضير، وغيّر حالتها. العميل هيشوف التغييرات من نفس المحرك.</p>
    </div><StudioOrderRoom mode="operator"/></main>
  </div>;
}
