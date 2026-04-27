import { PageHero } from '@/components/shared/page-hero';
import { PlaceholderBlock } from '@/components/shared/placeholder-block';

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <PageHero title="آراء العملاء" subtitle="سيتم إضافة نظام مراجعات واعتماد من الإدارة لاحقًا." />
      <PlaceholderBlock title="Reviews Placeholder" description="عرض تجريبي فقط - بدون تخزين أو موافقة إدارة حاليًا." />
    </div>
  );
}
