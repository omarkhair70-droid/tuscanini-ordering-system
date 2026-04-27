import { PageHero } from '@/components/shared/page-hero';
import { PlaceholderBlock } from '@/components/shared/placeholder-block';

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <PageHero title="إدارة المنتجات" subtitle="Placeholder فقط بدون CRUD فعلي." />
      <PlaceholderBlock title="Products Placeholder" description="سيتم تنفيذ إدارة المنتجات في مراحل لاحقة." />
    </div>
  );
}
