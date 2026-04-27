import { PageHero } from '@/components/shared/page-hero';
import { PlaceholderBlock } from '@/components/shared/placeholder-block';

export default function ComplaintsPage() {
  return (
    <div className="space-y-6">
      <PageHero title="الشكاوى" subtitle="نموذج شكوى تجريبي سيتم تفعيله لاحقًا." />
      <PlaceholderBlock title="Complaints Placeholder" description="واجهة مبدئية فقط بدون ربط قاعدة بيانات في هذه المرحلة." />
    </div>
  );
}
