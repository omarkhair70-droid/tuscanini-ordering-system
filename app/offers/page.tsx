import { PageHero } from '@/components/shared/page-hero';
import { mockOffers } from '@/lib/mock-data';

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <PageHero title="العروض" subtitle="عروض تجريبية - سيتم ربطها بالإدارة لاحقًا." />
      {mockOffers.map((offer) => (
        <div key={offer.id} className="rounded-2xl border-2 border-brand-red p-4">
          <h2 className="text-xl font-black">{offer.title}</h2>
          <p className="text-sm">{offer.description}</p>
          <p className="mt-2 font-extrabold text-brand-red">{offer.price} ج.م</p>
        </div>
      ))}
    </div>
  );
}
