import Link from 'next/link';

export function FoodFinderCta() {
  return (
    <section className="rounded-2xl border-2 border-dashed border-brand-dark/40 bg-brand-white p-4 text-brand-dark">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-black">مش عارف تاكل إيه؟</h2>
        <span className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-extrabold text-brand-dark">قريبًا</span>
      </div>
      <p className="mt-2 text-sm text-brand-charcoal">ميزة Food Finder قيد التجهيز حاليًا.</p>
      <Link
        href="/food-finder"
        className="mt-3 inline-flex rounded-full border-2 border-brand-dark px-4 py-2 text-sm font-bold text-brand-dark"
      >
        استكشف الصفحة
      </Link>
    </section>
  );
}
