import type { MenuItem, MenuTag, ProductBadgeVariant } from '@/types/menu';

const availabilityLabel: Record<MenuItem['availability'], string> = {
  available: 'متاح الآن',
  limited: 'كمية محدودة',
  unavailable: 'غير متاح حاليًا',
};

const availabilityStyle: Record<MenuItem['availability'], string> = {
  available: 'border border-emerald-200 bg-emerald-50 text-emerald-700',
  limited: 'border border-amber-200 bg-amber-50 text-amber-700',
  unavailable: 'border border-slate-200 bg-slate-100 text-slate-600',
};

const tagStyle: Record<MenuTag, string> = {
  'الأكثر طلبًا': 'bg-brand-yellow text-brand-dark',
  جديد: 'bg-brand-red text-brand-white',
  حار: 'bg-orange-500 text-brand-white',
};

const productBadgeVariantStyle: Record<ProductBadgeVariant, string> = {
  default: 'bg-slate-700 text-white',
  new: 'bg-brand-red text-brand-white',
  popular: 'bg-brand-yellow text-brand-dark',
  recommended: 'bg-indigo-600 text-white',
  spicy: 'bg-orange-500 text-brand-white',
  offer: 'bg-fuchsia-600 text-white',
  limited: 'bg-amber-600 text-white',
};

type ProductCardProps = {
  item: MenuItem;
  categoryName: string;
  onCustomize: (item: MenuItem) => void;
};

export function ProductCard({ item, categoryName, onCustomize }: ProductCardProps) {
  return (
    <article className="rounded-2xl border border-brand-dark/10 bg-brand-white p-4 shadow-[0_10px_24px_rgba(18,18,18,0.06)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {item.productBadgeAr ? (
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              productBadgeVariantStyle[item.productBadgeVariant ?? 'default']
            }`}
          >
            {item.productBadgeAr}
          </span>
        ) : null}
        {(item.tags ?? []).map((tag) => (
          <span key={tag} className={`rounded-full px-3 py-1 text-xs font-black ${tagStyle[tag]}`}>
            {tag}
          </span>
        ))}
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${availabilityStyle[item.availability]}`}>
          {availabilityLabel[item.availability]}
        </span>
      </div>

      <h3 className="text-lg font-black text-brand-dark">{item.name}</h3>
      <p className="mt-1 text-sm leading-6 text-brand-charcoal">{item.description}</p>
      <p className="mt-2 text-xs font-bold text-brand-charcoal/80">{categoryName}</p>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-brand-charcoal/70">تبدأ الأسعار من</p>
      <p className="mt-0.5 text-2xl font-black text-brand-red">{item.priceFrom} ج.م</p>

      <button
        type="button"
        onClick={() => onCustomize(item)}
        className="mt-4 w-full rounded-xl2 border border-brand-dark/15 bg-brand-white px-4 py-3 text-sm font-black text-brand-dark transition hover:border-brand-red/35 hover:text-brand-red"
      >
        تخصيص المنتج
      </button>
    </article>
  );
}
