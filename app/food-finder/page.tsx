import { PageHero } from '@/components/shared/page-hero';
import { PlaceholderBlock } from '@/components/shared/placeholder-block';

export default function FoodFinderPage() {
  return (
    <div className="space-y-6">
      <PageHero title="مش عارف تاكل إيه؟" subtitle="ميزة قيد التجهيز - صفحة تعريفية فقط في هذه المرحلة." />
      <PlaceholderBlock
        title="Food Finder Placeholder"
        description="في المرحلة الحالية: واجهة فقط. بدون منطق توصية أو نتائج ذكية حتى الآن."
      />
    </div>
  );
}
