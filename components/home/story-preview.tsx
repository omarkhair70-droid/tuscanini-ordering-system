import Link from 'next/link';

export function StoryPreview() {
  return (
    <section className="surface-card space-y-2">
      <h2 className="section-title">حكاية توسكانيني</h2>
      <p className="text-sm leading-7 text-brand-charcoal">
        حكاية الأربعة صحاب بدأت من حب الأكل الصح: طعم ثابت، خامات كويسة، وخدمة تخليك مبسوط من أول طلب.
      </p>
      <Link href="/about" className="inline-block pt-1 text-sm font-extrabold text-brand-red underline">
        اقرأ حكاية الأربعة صحاب
      </Link>
    </section>
  );
}
