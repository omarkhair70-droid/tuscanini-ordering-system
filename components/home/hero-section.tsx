import Image from 'next/image';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="rounded-2xl border border-brand-dark/10 bg-brand-white p-6 text-brand-dark shadow-[0_14px_34px_rgba(18,18,18,0.08)]">
      <div className="hero-brand-lockup" aria-label="Tuscanini brand logos">
        <Image
          src="/images/brand/tuscanini-logo-ar-red.jpeg"
          alt="توسكانيني"
          width={224}
          height={96}
          className="hero-brand-logo"
          priority
        />
        <span className="hero-brand-divider" aria-hidden="true" />
        <Image
          src="/images/brand/tuscanini-logo-en-black.jpeg"
          alt="Tuscanini"
          width={224}
          height={96}
          className="hero-brand-logo"
          priority
        />
      </div>

      <span className="badge-hot">جاهزين لاستقبال طلبك الآن</span>
      <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
        طلبك من توسكانيني أسرع وأسهل من أي وقت
      </h1>
      <p className="mt-3 text-sm leading-7 text-brand-charcoal">
        افتح المنيو، اختار اللي يناسبك، خصّص طلبك، وكمّل في خطوات واضحة لحد تأكيد الطلب خلال ثواني.
      </p>

      <ol className="mt-5 space-y-1.5 text-sm font-semibold text-brand-charcoal">
        <li>1) اطلب مباشرة من المنيو</li>
        <li>2) خصّص الصنف حسب مزاجك</li>
        <li>3) راجع السلة بسرعة ووضوح</li>
        <li>4) أكّد طلبك فورًا</li>
      </ol>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href="/menu" className="btn-primary w-full sm:w-auto">
          ابدأ الطلب من المنيو
        </Link>
        <Link href="/food-finder" className="btn-secondary w-full sm:w-auto">
          مش محتار؟ Food Finder يساعدك
        </Link>
      </div>
    </section>
  );
}
