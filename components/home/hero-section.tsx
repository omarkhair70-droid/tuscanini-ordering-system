import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="rounded-2xl bg-gradient-to-b from-brand-red via-brand-red to-[#8f0000] p-6 text-brand-white shadow-[0_16px_36px_rgba(128,0,0,0.35)]">
      <span className="badge-hot">جاهزين لاستقبال طلبك الآن</span>
      <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
        طعم يفتح النفس… وطلبك يوصل بسرعة من توسكانيني
      </h1>
      <p className="mt-3 text-sm leading-7 text-brand-white/95">
        من أول ضغطة لحد رسالة واتساب، التجربة كلها مرتبة وسريعة: اختار، خصّص، ضيف للسلة، وأكد طلبك في ثواني.
      </p>

      <ol className="mt-5 space-y-1.5 text-sm font-semibold text-brand-white/95">
        <li>1) تصفّح المنيو واختار مزاجك</li>
        <li>2) خصّص الصنف بالطريقة اللي تحبها</li>
        <li>3) راجع السلة في خطوة واضحة</li>
        <li>4) ابعت الطلب عبر واتساب مباشرة</li>
      </ol>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/menu" className="btn-primary w-full sm:w-auto">
          اطلب الآن من المنيو
        </Link>
        <Link href="/food-finder" className="btn-secondary w-full border-brand-white/35 bg-brand-white/10 text-brand-white sm:w-auto">
          مش محتار؟ جرّب Food Finder
        </Link>
      </div>
    </section>
  );
}
