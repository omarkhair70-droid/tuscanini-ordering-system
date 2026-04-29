import Link from 'next/link';

export function FoodFinderCta() {
  return (
    <section className="surface-card space-y-3 text-brand-dark">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-black">مش عارف تاكل إيه؟</h2>
        <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-extrabold text-brand-white shadow-[0_4px_12px_rgba(128,0,0,0.2)]">3 أسئلة فقط</span>
      </div>
      <p className="text-sm leading-7 font-semibold text-brand-charcoal">
        جاوب 3 أسئلة سريعة، وخد ترشيحات مضبوطة حسب مزاجك وميزانيتك، وبعدها روح مباشرة للقسم المناسب في المنيو.
      </p>
      <Link href="/food-finder" className="btn-secondary inline-flex rounded-full bg-brand-yellow/85 px-4 py-2.5 text-sm font-extrabold">
        جرّب Food Finder
      </Link>
    </section>
  );
}
