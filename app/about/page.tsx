import { PageHero } from '@/components/shared/page-hero';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHero title="عن توسكانيني" subtitle="4 أصدقاء، هدف واحد: أكل سريع بطعم مختلف." />
      <p className="rounded-2xl bg-brand-white p-4 text-sm leading-7 shadow-punch">
        توسكانيني مكان جديد بدأ بحلم بسيط: أكل سريع، طازج، ومذاق واضح. القصة الكاملة سيتم تطويرها في المراحل القادمة.
      </p>
    </div>
  );
}
