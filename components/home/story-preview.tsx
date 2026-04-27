import Link from 'next/link';

export function StoryPreview() {
  return (
    <section className="rounded-2xl border-4 border-brand-red bg-brand-white p-5">
      <h2 className="section-title">حكاية توسكانيني</h2>
      <p className="mt-2 text-sm text-brand-charcoal">
        4 أصدقاء قرروا يحولوا حب الأكل السريع لمكان بطعم مختلف، وصفات قوية وخدمة سريعة.
      </p>
      <Link href="/about" className="mt-4 inline-block text-sm font-extrabold text-brand-red underline">
        اقرأ القصة
      </Link>
    </section>
  );
}
