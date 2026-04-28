'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/components/cart/cart-provider';
import { FloatingCartCta } from '@/components/cart/floating-cart-cta';
import { CategoryChips } from '@/components/menu/category-chips';
import { ProductCard } from '@/components/menu/product-card';
import { ProductCustomizationModal } from '@/components/menu/product-customization-modal';
import { ActiveOrderBanner } from '@/components/shared/active-order-banner';
import { PageHero } from '@/components/shared/page-hero';
import type { MenuCategory, MenuCategorySlug, MenuItem } from '@/types/menu';

type MenuPageClientProps = {
  categories: MenuCategory[];
  items: MenuItem[];
  initialTableReference: string | null;
};

export function MenuPageClient({ categories, items, initialTableReference }: MenuPageClientProps) {
  const { tableReference, updateTableReference } = useCart();
  const [activeCategory, setActiveCategory] = useState<MenuCategorySlug | 'all'>('all');
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const validCategorySlugs = useMemo(() => new Set(categories.map((category) => category.slug)), [categories]);

  useEffect(() => {
    const categoryFromQuery = new URLSearchParams(window.location.search).get('category');

    if (!categoryFromQuery) {
      setActiveCategory('all');
      return;
    }

    if (validCategorySlugs.has(categoryFromQuery as MenuCategorySlug)) {
      setActiveCategory(categoryFromQuery as MenuCategorySlug);
      return;
    }

    setActiveCategory('all');
  }, [validCategorySlugs]);

  useEffect(() => {
    if (tableReference === initialTableReference) {
      return;
    }

    updateTableReference(initialTableReference);
  }, [initialTableReference, tableReference, updateTableReference]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return items;
    }

    return items.filter((item) => item.categorySlug === activeCategory);
  }, [activeCategory, items]);

  return (
    <div className="safe-bottom-mobile space-y-6">
      <PageHero title="المنيو" subtitle="منيو توسكانيني - اختياراتك المفضلة بطعم ثابت وجودة ممتازة." />
      <ActiveOrderBanner />

      <section className="rounded-2xl border border-brand-dark/15 bg-brand-yellow/35 py-3 shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
        <CategoryChips categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {filteredItems.map((item) => {
          const category = categories.find((entry) => entry.slug === item.categorySlug);
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

      <FloatingCartCta />
    </div>
  );
}
