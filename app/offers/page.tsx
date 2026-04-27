import { PageHero } from '@/components/shared/page-hero';

export default function OffersPage() {
  const confirmedOffers: Array<{ id: string; title: string; description?: string; price?: number }> = [];
  const hasConfirmedOffers = confirmedOffers.length > 0;

  return (
    <div className="space-y-6">
      <PageHero title="العروض" subtitle="هنا هتظهر العروض المؤكدة أول ما يتم اعتمادها." />

      {hasConfirmedOffers ? (
        confirmedOffers.map((offer) => (
          <div key={offer.id} className="rounded-2xl border-2 border-brand-red p-4">
            <h2 className="text-xl font-black">{offer.title}</h2>
            {offer.description ? <p className="text-sm">{offer.description}</p> : null}
            {offer.price ? <p className="mt-2 font-extrabold text-brand-red">{offer.price} ج.م</p> : null}
          </div>
        ))
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-brand-charcoal/30 bg-brand-white p-4 text-sm font-bold text-brand-charcoal">
          العروض قريبًا
        </div>
      )}
    </div>
  );
}
