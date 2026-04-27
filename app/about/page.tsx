import { PageHero } from '@/components/shared/page-hero';

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHero title="عن توسكانيني" subtitle="4 أصدقاء بدأوا المشوار بقلب واحد وطعم مختلف." />

      <section className="rounded-2xl bg-brand-white p-5 text-sm leading-7 shadow-punch">
        <p>
          توسكانيني بدأ من فكرة بسيطة بين أربعة أصحاب: <strong>هادي</strong>، <strong>جوبا</strong>، <strong>فارس</strong>، و
          <strong> عبد الرحمن</strong>. كانوا عايزين يقدموا أكل سريع يكون طازج، مشبع، وطعمه ثابت كل مرة.
        </p>
        <p className="mt-3">
          من أول يوم، الهدف كان واضح: تجربة محترمة، تحضير سريع، ومذاق يخلّي العميل يرجع وهو مطمّن. علشان كده كل وجبة
          في توسكانيني بتتجهز باهتمام، وبتتقدم بروح فريق شغال كأنه بيجهز الأكل لأصحابه.
        </p>
        <p className="mt-3 font-bold">
          توسكانيني مش مجرد اسم مطعم، دي حكاية صحاب قرروا يحوّلوا شغفهم بالأكل السريع لمكان الناس تحبه وتثق فيه.
        </p>
      </section>
    </div>
  );
}
