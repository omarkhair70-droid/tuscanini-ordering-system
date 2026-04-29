import { PageHero } from '@/components/shared/page-hero';
import { getActivePublicOffers } from '@/lib/offers-runtime';
import { AddOfferButton } from '@/components/offers/add-offer-button';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OffersPage() {
  const confirmedOffers = await getActivePublicOffers();
  const hasConfirmedOffers = confirmedOffers.length > 0;

  return (
    <div className="safe-bottom-mobile space-y-6">
      <PageHero title="العروض" subtitle="كل عرض رسمي معتمد هتلاقيه هنا بشكل واضح ومباشر." />

      {hasConfirmedOffers ? (
        confirmedOffers.map((offer) => (
          <div key={offer.id} className="rounded-2xl border-2 border-brand-red p-4">
            {offer.badgeAr ? <p className="mb-2 inline-flex rounded-full bg-brand-red/10 px-2 py-1 text-xs font-bold text-brand-red">{offer.badgeAr}</p> : null}
            <h2 className="text-xl font-black">{offer.titleAr}</h2>
            {offer.descriptionAr ? <p className="text-sm">{offer.descriptionAr}</p> : null}
            {offer.priceText ? <p className="mt-2 font-extrabold text-brand-red">{offer.priceText}</p> : null}
            {typeof offer.offerPrice === 'number' ? <AddOfferButton offerId={offer.id} offerTitle={offer.titleAr} offerPrice={offer.offerPrice} /> : null}
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
