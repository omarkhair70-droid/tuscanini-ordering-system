export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type MenuItem = {
  id: string;
  name: string;
  categorySlug: string;
  description: string;
  priceFrom: number;
  tag?: 'الأكثر طلبًا' | 'جديد' | 'عرض';
};
