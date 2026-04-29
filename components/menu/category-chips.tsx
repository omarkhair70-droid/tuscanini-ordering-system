import type { MenuCategory, MenuCategorySlug } from '@/types/menu';

type CategoryChipsProps = {
  categories: MenuCategory[];
  activeCategory: MenuCategorySlug | 'all';
  onSelectCategory: (category: MenuCategorySlug | 'all') => void;
};

export function CategoryChips({ categories, activeCategory, onSelectCategory }: CategoryChipsProps) {
  return (
    <div className="-mx-4 no-scrollbar flex touch-pan-x gap-2 overflow-x-auto px-4 pb-1 pt-0.5">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`min-h-10 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black transition ${
          activeCategory === 'all'
            ? 'border-brand-red bg-brand-red text-brand-white shadow-[0_6px_14px_rgba(128,0,0,0.18)]'
            : 'border-brand-dark/15 bg-brand-white text-brand-dark hover:border-brand-red/25'
        }`}
      >
        الكل
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelectCategory(category.slug)}
          className={`min-h-10 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-black transition ${
            activeCategory === category.slug
              ? 'border-brand-red bg-brand-red text-brand-white shadow-[0_6px_14px_rgba(128,0,0,0.18)]'
              : 'border-brand-dark/15 bg-brand-white text-brand-dark hover:border-brand-red/25 hover:text-brand-red'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
