import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="rounded-2xl border border-brand-dark/10 bg-brand-white p-5 text-brand-dark shadow-[0_12px_28px_rgba(18,18,18,0.06)] sm:p-6">
      <span className="badge-hot">جاهزين لاستقبال طلبك الآن</span>
      <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
        طلبك من توسكانيني أسرع وأسهل من أي وقت
      </h1>
      <p className="mt-3 text-sm leading-7 text-brand-charcoal">
        افتح المنيو، اختار اللي يناسبك، خصّص طلبك، وكمّل في خطوات واضحة لحد تأكيد الطلب خلال ثواني.
      </p>
      <p className="mt-3 text-sm font-semibold text-brand-charcoal">
        تخصيص واضح، مراجعة سريعة، وتأكيد مباشر.
      </p>

      <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:gap-3">
        <Link href="/menu" className="btn-primary w-full sm:w-auto">
          ابدأ الطلب من المنيو
        </Link>
        <Link href="/food-finder" className="btn-secondary w-full sm:w-auto">
          مش محتار؟ Food Finder يساعدك
        </Link>
      </div>

      <div className="hero-brand-lockup" aria-label="Tuscanini brand panel">
        <Image
          src="/images/brand/tuscanini-logo-ar-red.jpeg"
          alt="شعار توسكانيني العربي باللون الأحمر"
          width={260}
          height={120}
          className="hero-brand-logo"
          priority
        />
      </div>
    </section>
  );
}
