import { PageHero } from '@/components/shared/page-hero';

export default function AboutPage() {
  return (
    <div className="safe-bottom-mobile space-y-6">
      <PageHero title="عن توسكانيني" subtitle="حكاية الأربعة صحاب: شغف بالأكل السريع وتفاصيل تفرق." />

      <section className="surface-card text-sm leading-8">
        <p>
          <strong>حكاية الأربعة صحاب</strong> بدأت لما <strong>هادي</strong> و<strong>جوبا</strong> و<strong>فارس</strong> و
          <strong> عبد الرحمن</strong> قرروا يحولوا حبهم للأكل السريع لمكان الناس ترجع له وهي مطمنة.
        </p>
        <p className="mt-3">
          من أول يوم الهدف كان واضح: طعم ثابت، تحضير سريع، وتفاصيل نظيفة في كل طلب. علشان كده كل وجبة في توسكانيني
          بتتجهز باهتمام وكأنها متحضرة لدايرة أصحاب.
        </p>
        <p className="mt-3 font-bold">
          توسكانيني مش مجرد اسم مطعم، دي قصة أصحاب جمعوا بين الأكل اللي بيحبوه والتجربة اللي يتمنوا يشوفوها كل يوم.
        </p>
      </section>
    </div>
  );
}
