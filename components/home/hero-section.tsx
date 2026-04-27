import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="rounded-2xl bg-gradient-to-b from-brand-red to-[#a30000] p-6 text-brand-white">
      <span className="badge-hot">افتتاح جديد 🔥</span>
      <h1 className="mt-4 text-4xl font-black leading-tight">طعم يفتح النفس... بسرعة توسكانيني!</h1>
      <p className="mt-3 text-sm text-brand-white/90">
        كريب، بيتزا، باستا، ساندوتشات وعروض يومية بطابع جريء وسريع.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/menu" className="btn-primary">
          اطلب الآن
        </Link>
        <Link href="/offers" className="btn-secondary bg-brand-white">
          شوف العروض
        </Link>
      </div>
    </section>
  );
}
