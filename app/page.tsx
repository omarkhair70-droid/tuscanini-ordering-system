import type { Metadata } from 'next';
import { RebirthHome } from '@/components/home/rebirth-home';
import { ActiveOrderBanner } from '@/components/shared/active-order-banner';
import './rebirth-home.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'توسكانيني | بص جوا',
  description: 'توسكانيني بني سويف — كريب وبيتزا وساندوتشات. اكتشف الأكل وادخل على المنيو مباشرة.',
};

export default function HomePage() {
  return <RebirthHome activeOrderSlot={<ActiveOrderBanner />} />;
}
