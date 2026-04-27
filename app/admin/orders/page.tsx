import { PageHero } from '@/components/shared/page-hero';
import { PlaceholderBlock } from '@/components/shared/placeholder-block';

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHero title="إدارة الطلبات" subtitle="واجهة أولية فقط في هذه المرحلة." />
      <PlaceholderBlock title="Orders Placeholder" description="بدون لوحة متابعة أو حالات الطلب حتى الآن." />
    </div>
  );
}
