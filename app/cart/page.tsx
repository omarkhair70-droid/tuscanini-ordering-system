import type { Metadata } from 'next';
import { RebirthCheckout } from '@/components/rebirth/rebirth-checkout';
import '../rebirth-home.css';
import '../rebirth-checkout.css';

export const metadata: Metadata = {
  title: 'السلة وتأكيد الطلب | توسكانيني',
  description: 'راجع الأصناف والإضافات وبياناتك قبل تسجيل طلبك في توسكانيني.',
};

export default function CartPage() {
  return <RebirthCheckout />;
}
