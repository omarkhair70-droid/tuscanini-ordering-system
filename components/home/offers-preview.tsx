import Link from 'next/link';
import { mockOffers } from '@/lib/mock-data';

export function OffersPreview() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title">عروض سريعة</h2>
        <Link href="/offers" className="text-sm font-bold text-brand-red underline">
          كل العروض
        </Link>
      </div>
      <div className="space-y-3">
        {mockOffers.map((offer) => (
          <article key={offer.id} className="rounded-2xl bg-brand-white p-4 shadow-punch">
            <h3 className="text-lg font-black">{offer.title}</h3>
            <p className="text-sm text-brand-charcoal">{offer.description}</p>
            <p className="mt-2 font-extrabold text-brand-red">{offer.price} ج.م</p>
          </article>
        ))}
      </div>
    </section>
  );
}
