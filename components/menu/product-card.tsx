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
  'الأكثر طلبًا': 'bg-brand-yellow/90 text-brand-dark',
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
    <article className="rounded-2xl border border-brand-dark/10 bg-brand-white p-4 shadow-[0_8px_20px_rgba(18,18,18,0.05)] sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {item.productBadgeAr ? (
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-black ${
              productBadgeVariantStyle[item.productBadgeVariant ?? 'default']
            }`}
          >
            {item.productBadgeAr}
          </span>
        ) : null}
        {(item.tags ?? []).map((tag) => (
          <span key={tag} className={`rounded-full px-2.5 py-1 text-[11px] font-black ${tagStyle[tag]}`}>
            {tag}
          </span>
        ))}
        <span className={`ms-auto rounded-full px-2.5 py-1 text-[11px] font-semibold ${availabilityStyle[item.availability]}`}>
          {availabilityLabel[item.availability]}
        </span>
      </div>

      <h3 className="text-xl font-black leading-tight text-brand-dark">{item.name}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-brand-charcoal">{item.description}</p>
      <p className="mt-2 text-xs font-bold tracking-wide text-brand-charcoal/75">{categoryName}</p>

      <div className="mt-4 rounded-xl border border-brand-dark/10 bg-brand-yellow/20 px-3 py-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-brand-charcoal/70">تبدأ الأسعار من</p>
        <p className="mt-0.5 text-2xl font-black text-brand-red">{item.priceFrom} ج.م</p>
      </div>

      <button
        type="button"
        onClick={() => onCustomize(item)}
        className="mt-4 w-full rounded-xl2 bg-brand-red px-4 py-3 text-sm font-black text-brand-white transition hover:bg-[#9e0000]"
      >
        اطلب الآن • تخصيص المنتج
      </button>
    </article>
  );
}
