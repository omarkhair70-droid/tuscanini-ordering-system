import { PageHero } from '@/components/shared/page-hero';
import { PlaceholderBlock } from '@/components/shared/placeholder-block';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHero title="إعدادات الموقع" subtitle="واجهة مبدئية بدون إعدادات حقيقية." />
      <PlaceholderBlock title="Settings Placeholder" description="سيتم تنفيذ إعدادات الموقع الفعلية في المراحل القادمة." />
    </div>
  );
}
