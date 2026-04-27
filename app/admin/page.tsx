import { PageHero } from '@/components/shared/page-hero';

export default function AdminPage() {
  return (
    <div className="space-y-4">
      <PageHero title="لوحة الإدارة" subtitle="نسخة مبدئية للروابط فقط." />
      <ul className="list-disc space-y-2 pr-5 text-sm">
        <li>/admin/products</li>
        <li>/admin/orders</li>
        <li>/admin/settings</li>
      </ul>
    </div>
  );
}
