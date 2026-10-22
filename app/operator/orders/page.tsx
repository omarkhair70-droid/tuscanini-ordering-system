import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocalStudioOrigin } from '@/lib/studio-bridge';
import { OperatorPress } from '@/components/studio/operator-press';
import '../../studio.css';
import '../../operator-press.css';

export const dynamic='force-dynamic';
export default function OperatorOrdersPage(){
  if(!getLocalStudioOrigin())notFound();
  return <div className="t-studio" dir="rtl">
    <header className="t-studio__top"><Link href="/" className="t-studio__logo">TUSCANINI.</Link>
      <span>ORDER ROOM / OPERATOR</span><Link href="/studio">واجهة العميل ↗</Link></header>
    <main className="op-page"><OperatorPress /></main>
  </div>;
}
