import Link from 'next/link';

export function FoodFinderCta() {
  return (
    <section className="rounded-2xl bg-brand-dark p-5 text-brand-white">
      <h2 className="text-2xl font-black">مش عارف تاكل إيه؟</h2>
      <p className="mt-2 text-sm text-brand-white/85">جاوب كام سؤال بسيط وخليك على اختيارات مناسبة لمزاجك.</p>
      <Link href="/food-finder" className="btn-primary mt-4">
        جرّب Food Finder
      </Link>
    </section>
  );
}
