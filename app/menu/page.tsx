'use client';

import { useMemo, useState } from 'react';
import { CategoryChips } from '@/components/menu/category-chips';
import { ProductCard } from '@/components/menu/product-card';
import { ProductCustomizationModal } from '@/components/menu/product-customization-modal';
import { PageHero } from '@/components/shared/page-hero';
import { featuredItems, menuCategories } from '@/lib/mock-data';
import type { MenuCategorySlug, MenuItem } from '@/types/menu';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategorySlug | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return featuredItems;
    }

    return featuredItems.filter((item) => item.categorySlug === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-6">
      <PageHero title="المنيو" subtitle="منيو توسكانيني التجريبي - تخصيص وتجربة تصفح أفضل." />

      <section className="rounded-2xl border-2 border-brand-dark bg-brand-yellow/60 py-3">
        <CategoryChips
          categories={menuCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {filteredItems.map((item) => {
          const category = menuCategories.find((entry) => entry.slug === item.categorySlug);
          return (
            <ProductCard
              key={item.id}
              item={item}
              categoryName={category?.name ?? 'قسم غير محدد'}
              onCustomize={setSelectedProduct}
            />
          );
        })}
      </section>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-brand-dark bg-brand-white p-6 text-center">
          <p className="font-black">لا توجد عناصر في هذا القسم حاليًا.</p>
        </div>
      ) : null}

      <ProductCustomizationModal
        item={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
