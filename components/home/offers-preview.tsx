import Link from 'next/link';

export function OffersPreview() {
  const confirmedOffers: Array<{ id: string; title: string; description?: string; price?: number }> = [];
  const hasConfirmedOffers = confirmedOffers.length > 0;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="section-title">العروض</h2>
        <Link href="/offers" className="text-sm font-bold text-brand-red underline">
          صفحة العروض
        </Link>
      </div>

      {hasConfirmedOffers ? (
        <div className="space-y-3">
          {confirmedOffers.map((offer) => (
            <article key={offer.id} className="rounded-2xl bg-brand-white p-4 shadow-punch">
              <h3 className="text-lg font-black">{offer.title}</h3>
              {offer.description ? <p className="text-sm text-brand-charcoal">{offer.description}</p> : null}
              {offer.price ? <p className="mt-2 font-extrabold text-brand-red">{offer.price} ج.م</p> : null}
            </article>
          ))}
        </div>
      ) : null}

      {!hasConfirmedOffers ? (
        <div className="rounded-xl2 border border-brand-charcoal/20 bg-brand-white p-3 text-xs font-semibold text-brand-charcoal">
          لا توجد عروض مؤكدة الآن.
        </div>
      ) : null}
    </section>
  );
}
