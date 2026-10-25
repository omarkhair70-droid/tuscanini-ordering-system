import type { Metadata } from 'next';
import { ExperienceHeader } from '@/components/rebirth/experience-header';
import { ExperienceFooter } from '@/components/rebirth/experience-footer';
import { CustomerAccount } from '@/components/rebirth/customer-account';
import '../rebirth-home.css';
import '../rebirth-creative.css';
import '../rebirth-account.css';

export const metadata: Metadata = {
  title: 'حسابك وطلباتك | توسكانيني',
  description: 'احفظ عنوانك وشوف طلباتك في توسكانيني.',
};

export default function AccountPage() {
  return (
    <div className="t-page t-account-page" dir="rtl">
      <ExperienceHeader />
      <main id="t-account-main" className="t-account-main t-shell">
        <header className="t-account-heading">
          <span className="t-account-eyebrow">توسكانيني / حسابك</span>
          <h1>أكلك.<br /><em>على حسابك.</em></h1>
          <p>عنوانك جاهز لما تحتاجه، وطلباتك في مكان واحد.</p>
        </header>
        <CustomerAccount />
      </main>
      <ExperienceFooter />
    </div>
  );
}
