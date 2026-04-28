import { PageHero } from '@/components/shared/page-hero';

export default function OffersPage() {
  const confirmedOffers: Array<{ id: string; title: string; description?: string; price?: number }> = [];
  const hasConfirmedOffers = confirmedOffers.length > 0;

  return (
    <div className="safe-bottom-mobile space-y-6">
      <PageHero title="العروض" subtitle="كل عرض رسمي معتمد هتلاقيه هنا بشكل واضح ومباشر." />

      {hasConfirmedOffers ? (
        confirmedOffers.map((offer) => (
          <div key={offer.id} className="rounded-2xl border-2 border-brand-red p-4">
            <h2 className="text-xl font-black">{offer.title}</h2>
            {offer.description ? <p className="text-sm">{offer.description}</p> : null}
            {offer.price ? <p className="mt-2 font-extrabold text-brand-red">{offer.price} ج.م</p> : null}
          </div>
        ))
      ) : (
        <div className="surface-card-soft text-sm text-brand-charcoal">
          <p className="font-bold text-brand-dark">العروض قريبًا.</p>
          <p className="mt-1 leading-6">نعتمد العروض بعناية لضمان أفضل قيمة. أول عرض جديد هينزل هنا فور اعتماده.</p>
        </div>
      )}
    </div>
  );
}
