import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type {
  AdminMenuAddonRow,
  AdminMenuCategoryRow,
  AdminMenuDashboardData,
  AdminMenuProductRow,
  AdminMenuSizeRow,
} from '@/types/admin-menu';

type CategoryRow = {
  id: string;
  name_ar: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
};

type ProductRow = {
  id: string;
  name_ar: string;
  category_id: string;
  availability: string;
  price_from: number | string;
  product_badge_ar: string | null;
  product_badge_variant: string | null;
  is_active: boolean;
  updated_at: string;
};

type ProductSizeRow = {
  id: string;
  product_id: string;
  label_ar: string;
  price: number | string;
  is_active: boolean;
  updated_at: string;
};

type ProductAddonRow = {
  id: string;
  label_ar: string;
  price: number | string;
  is_active: boolean;
};

type ProductAddonLinkRow = {
  addon_id: string;
};

function toNumber(value: number | string): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getAdminMenuDashboardData(): Promise<AdminMenuDashboardData> {
  const supabase = getSupabaseServerAdminClient();

  const [categoriesResult, productsResult, sizesResult, addonsResult, addonLinksResult] = await Promise.all([
    supabase
      .from('menu_categories')
      .select('id, name_ar, slug, sort_order, is_active')
      .order('sort_order', { ascending: true }),
    supabase
      .from('products')
      .select('id, name_ar, category_id, availability, price_from, product_badge_ar, product_badge_variant, is_active, updated_at')
      .order('sort_order', { ascending: true }),
    supabase
      .from('product_sizes')
      .select('id, product_id, label_ar, price, is_active, updated_at')
      .order('sort_order', { ascending: true }),
    supabase.from('product_addons').select('id, label_ar, price, is_active').order('label_ar', { ascending: true }),
    supabase.from('product_addon_links').select('addon_id'),
  ]);

  if (categoriesResult.error) {
    throw new Error(`Failed to read menu_categories: ${categoriesResult.error.message}`);
  }

  if (productsResult.error) {
    throw new Error(`Failed to read products: ${productsResult.error.message}`);
  }

  if (sizesResult.error) {
    throw new Error(`Failed to read product_sizes: ${sizesResult.error.message}`);
  }

  if (addonsResult.error) {
    throw new Error(`Failed to read product_addons: ${addonsResult.error.message}`);
  }

  if (addonLinksResult.error) {
    throw new Error(`Failed to read product_addon_links: ${addonLinksResult.error.message}`);
  }

  const categoryRows = (categoriesResult.data ?? []) as CategoryRow[];
  const productRows = (productsResult.data ?? []) as ProductRow[];
  const sizeRows = (sizesResult.data ?? []) as ProductSizeRow[];
  const addonRows = (addonsResult.data ?? []) as ProductAddonRow[];
  const addonLinkRows = (addonLinksResult.data ?? []) as ProductAddonLinkRow[];

  const categoryNameById = new Map<string, string>(categoryRows.map((category) => [category.id, category.name_ar]));
  const productNameById = new Map<string, string>(productRows.map((product) => [product.id, product.name_ar]));

  const addonUsageByAddonId = addonLinkRows.reduce<Map<string, number>>((acc, row) => {
    acc.set(row.addon_id, (acc.get(row.addon_id) ?? 0) + 1);
    return acc;
  }, new Map<string, number>());

  const categories: AdminMenuCategoryRow[] = categoryRows.map((row) => ({
    id: row.id,
    nameAr: row.name_ar,
    slug: row.slug,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));

  const products: AdminMenuProductRow[] = productRows.map((row) => ({
    id: row.id,
    nameAr: row.name_ar,
    categoryNameAr: categoryNameById.get(row.category_id) ?? 'غير معروف',
    availability: row.availability,
    priceFrom: toNumber(row.price_from),
    productBadgeAr: row.product_badge_ar,
    productBadgeVariant: row.product_badge_variant,
    isActive: row.is_active,
    updatedAt: row.updated_at,
  }));

  const sizes: AdminMenuSizeRow[] = sizeRows.map((row) => ({
    id: row.id,
    productNameAr: productNameById.get(row.product_id) ?? 'غير معروف',
    labelAr: row.label_ar,
    price: toNumber(row.price),
    isActive: row.is_active,
    updatedAt: row.updated_at,
  }));

  const addons: AdminMenuAddonRow[] = addonRows.map((row) => ({
    id: row.id,
    labelAr: row.label_ar,
    price: toNumber(row.price),
    isActive: row.is_active,
    usageCount: addonUsageByAddonId.get(row.id) ?? 0,
  }));

  return {
    categories,
    products,
    sizes,
    addons,
  };
}
