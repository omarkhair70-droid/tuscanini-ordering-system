import { PageHero } from '@/components/shared/page-hero';
import { PlaceholderBlock } from '@/components/shared/placeholder-block';

export default function CartPage() {
  return (
    <div className="space-y-6">
      <PageHero title="السلة" subtitle="واجهة السلة فقط في هذه المرحلة - بدون منطق فعلي." />
      <PlaceholderBlock title="Cart UI Placeholder" description="سيتم إضافة المنطق الكامل للسلة والطلب في مرحلة لاحقة." />
    </div>
  );
}
