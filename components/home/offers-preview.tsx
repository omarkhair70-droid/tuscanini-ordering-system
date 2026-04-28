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
        <div className="surface-card-soft text-sm text-brand-charcoal">
          <p className="font-bold text-brand-dark">لا توجد عروض مؤكدة الآن.</p>
          <p className="mt-1 leading-6">بمجرد اعتماد عرض جديد هنعلنه هنا مباشرة بشكل واضح وسهل.</p>
        </div>
      ) : null}
    </section>
  );
}
