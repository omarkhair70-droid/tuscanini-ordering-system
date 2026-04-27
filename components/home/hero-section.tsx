import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="rounded-2xl bg-gradient-to-b from-brand-red to-[#a30000] p-6 text-brand-white">
      <span className="badge-hot">جاهزين لعرض العميل ✅</span>
      <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
        اطلب من توسكانيني في خطوات واضحة وسريعة
      </h1>
      <p className="mt-3 text-sm text-brand-white/90">
        تصفّح المنيو، خصّص الصنف على ذوقك، ضيفه للسلة، وابعت طلبك على واتساب في ثواني.
      </p>

      <ol className="mt-4 space-y-1 text-sm font-semibold text-brand-white/95">
        <li>1) تصفّح المنيو</li>
        <li>2) خصّص الصنف</li>
        <li>3) ضيف للسلة</li>
        <li>4) ابعت الطلب على واتساب</li>
      </ol>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/menu" className="btn-primary">
          ابدأ من المنيو
        </Link>
        <Link href="/cart" className="btn-secondary bg-brand-white">
          راجع السلة وأكمل واتساب
        </Link>
      </div>
    </section>
  );
}
