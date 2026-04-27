export type MenuCategorySlug =
  | 'crepe'
  | 'pizza'
  | 'pasta'
  | 'sandwiches'
  | 'appetizers'
  | 'drinks'
  | 'offers';

export type MenuTag = 'الأكثر طلبًا' | 'جديد' | 'حار';

export type AvailabilityStatus = 'available' | 'limited' | 'unavailable';

export type ProductSize = {
  id: string;
  label: string;
  price: number;
};

export type ProductAddon = {
  id: string;
  label: string;
  price: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: MenuCategorySlug;
  description: string;
};

export type MenuItem = {
  id: string;
  name: string;
  categorySlug: MenuCategorySlug;
  description: string;
  priceFrom: number;
  basePrice?: number;
  tags?: MenuTag[];
  availability: AvailabilityStatus;
  sizes?: ProductSize[];
  addons?: ProductAddon[];
};
