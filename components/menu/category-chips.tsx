import type { MenuCategory, MenuCategorySlug } from '@/types/menu';

type CategoryChipsProps = {
  categories: MenuCategory[];
  activeCategory: MenuCategorySlug | 'all';
  onSelectCategory: (category: MenuCategorySlug | 'all') => void;
};

export function CategoryChips({ categories, activeCategory, onSelectCategory }: CategoryChipsProps) {
  return (
    <div className="-mx-4 no-scrollbar flex touch-pan-x gap-2 overflow-x-auto px-4 pb-2">
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={`whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-black transition ${
          activeCategory === 'all'
            ? 'border-brand-red bg-brand-red text-brand-white'
            : 'border-brand-dark bg-brand-white text-brand-dark'
        }`}
      >
        الكل
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelectCategory(category.slug)}
          className={`whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-black transition ${
            activeCategory === category.slug
              ? 'border-brand-red bg-brand-red text-brand-white'
              : 'border-brand-dark bg-brand-yellow text-brand-dark'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
