import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLocalStudioOrigin } from '@/lib/studio-bridge';
import { OperatorPress } from '@/components/studio/operator-press';
import '../../studio.css';
import '../../operator-press.css';

export const dynamic='force-dynamic';
export default function OperatorOrdersPage(){
  const localStudio=Boolean(getLocalStudioOrigin());
  // A Vercel branch Preview may show ONLY 20 synthetic, non-actionable
  // tickets. The live operator still needs a private staging connection
  // and never becomes public on the production deployment.
  const readOnlyPreview=!localStudio&&process.env.VERCEL_ENV==='preview';
  if(!localStudio&&!readOnlyPreview)notFound();
  return <div className="t-studio" dir="rtl">
    <header className="t-studio__top"><Link href="/" className="t-studio__logo">TUSCANINI.</Link>
      <span>{readOnlyPreview?'ORDER ROOM / DESIGN PREVIEW':'ORDER ROOM / OPERATOR'}</span>
      <Link href={readOnlyPreview?'/menu':'/studio'}>واجهة العميل ↗</Link></header>
    <main className="op-page">
      {readOnlyPreview&&<p className="op-remote-preview" role="note">
        <strong>معاينة التصميم فقط — ٢٠ طلبًا خياليًا.</strong> التبديل والبحث شغّالين،
        لكن الأزرار لا تنفذ طلبات حقيقية، ومفيش اتصال ببيانات المطعم أو تحصيل فلوس.
      </p>}
      <OperatorPress readOnlyPreview={readOnlyPreview}/>
    </main>
  </div>;
}
