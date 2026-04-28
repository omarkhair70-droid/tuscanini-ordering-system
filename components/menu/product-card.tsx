import type { MenuItem, MenuTag } from '@/types/menu';

const availabilityLabel: Record<MenuItem['availability'], string> = {
  available: 'متاح الآن',
  limited: 'كمية محدودة',
  unavailable: 'غير متاح حاليًا',
};

const availabilityStyle: Record<MenuItem['availability'], string> = {
  available: 'border border-green-300 bg-green-50 text-green-800',
  limited: 'border border-amber-300 bg-amber-50 text-amber-800',
  unavailable: 'border border-gray-300 bg-gray-100 text-gray-700',
};

const tagStyle: Record<MenuTag, string> = {
  'الأكثر طلبًا': 'bg-brand-yellow text-brand-dark',
  جديد: 'bg-brand-red text-brand-white',
  حار: 'bg-orange-500 text-brand-white',
};

type ProductCardProps = {
  item: MenuItem;
  categoryName: string;
  onCustomize: (item: MenuItem) => void;
};

export function ProductCard({ item, categoryName, onCustomize }: ProductCardProps) {
  return (
    <article className="rounded-2xl border border-brand-dark/15 bg-brand-white p-4 shadow-[0_8px_22px_rgba(18,18,18,0.08)]">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {(item.tags ?? []).map((tag) => (
          <span key={tag} className={`rounded-full px-3 py-1 text-xs font-black ${tagStyle[tag]}`}>
            {tag}
          </span>
        ))}
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${availabilityStyle[item.availability]}`}>
          {availabilityLabel[item.availability]}
        </span>
      </div>

      <h3 className="text-lg font-black text-brand-dark">{item.name}</h3>
      <p className="mt-1 text-sm leading-6 text-brand-charcoal">{item.description}</p>
      <p className="mt-2 text-xs font-bold text-brand-charcoal">{categoryName}</p>
      <p className="mt-3 text-xs font-semibold text-brand-charcoal">تبدأ الأسعار من</p>
      <p className="text-xl font-black text-brand-red">{item.priceFrom} ج.م</p>

      <button
        type="button"
        onClick={() => onCustomize(item)}
        className="mt-4 w-full rounded-xl2 border border-brand-dark/15 bg-brand-yellow px-4 py-3 text-sm font-black text-brand-dark transition hover:opacity-90"
      >
        تخصيص المنتج
      </button>
    </article>
  );
}
