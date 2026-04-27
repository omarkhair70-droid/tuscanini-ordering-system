import Link from 'next/link';

export function FoodFinderCta() {
  return (
    <section className="rounded-2xl border-2 border-brand-dark bg-brand-white p-4 text-brand-dark">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-black">مش عارف تاكل إيه؟</h2>
        <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-extrabold text-brand-white">جاهز الآن</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-brand-charcoal">
        جاوب 3 أسئلة سريعة وخد ترشيحات من المنيو حسب مزاجك وميزانيتك.
      </p>
      <Link
        href="/food-finder"
        className="mt-3 inline-flex rounded-full border-2 border-brand-dark bg-brand-yellow px-4 py-2 text-sm font-bold text-brand-dark"
      >
        جرّب Food Finder
      </Link>
    </section>
  );
}
