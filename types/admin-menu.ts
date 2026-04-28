export type AdminMenuCategoryRow = {
  id: string;
  nameAr: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

export type AdminMenuProductRow = {
  id: string;
  nameAr: string;
  categoryNameAr: string;
  availability: 'available' | 'limited' | 'unavailable' | string;
  priceFrom: number;
  isActive: boolean;
  updatedAt: string;
};

export type AdminMenuSizeRow = {
  id: string;
  productNameAr: string;
  labelAr: string;
  price: number;
  isActive: boolean;
  updatedAt: string;
};

export type AdminMenuAddonRow = {
  id: string;
  labelAr: string;
  price: number;
  isActive: boolean;
  usageCount: number;
};

export type AdminMenuDashboardData = {
  categories: AdminMenuCategoryRow[];
  products: AdminMenuProductRow[];
  sizes: AdminMenuSizeRow[];
  addons: AdminMenuAddonRow[];
};
