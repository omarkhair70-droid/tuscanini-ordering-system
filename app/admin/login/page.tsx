import { PageHero } from '@/components/shared/page-hero';
import { PlaceholderBlock } from '@/components/shared/placeholder-block';

export default function AdminLoginPage() {
  return (
    <div className="space-y-6">
      <PageHero title="تسجيل دخول الإدارة" subtitle="واجهة فقط - بدون مصادقة فعلية الآن." />
      <PlaceholderBlock title="Admin Login Placeholder" description="لن يتم تفعيل المصادقة قبل المراحل المخصصة لذلك." />
    </div>
  );
}
