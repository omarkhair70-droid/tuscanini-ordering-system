import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type {
  AvailabilityStatus,
  MenuCategory,
  MenuCategorySlug,
  MenuItem,
  ProductBadgeVariant,
  ProductAddon,
  ProductSize,
} from '@/types/menu';

type MenuCategoryRow = {
  id: string;
  legacy_id: string | null;
  name_ar: string;
  slug: string;
  description_ar: string | null;
  sort_order: number;
  is_active: boolean;
};

type ProductRow = {
  id: string;
  legacy_id: string | null;
  category_id: string;
  name_ar: string;
  description_ar: string | null;
  price_from: number | string;
  base_price: number | string | null;
  availability: string;
  product_badge_ar: string | null;
  product_badge_variant: string | null;
  sort_order: number;
  is_active: boolean;
};

type ProductSizeRow = {
  id: string;
  product_id: string;
  legacy_id: string | null;
  label_ar: string;
  price: number | string;
  sort_order: number;
  is_active: boolean;
};

type ProductAddonRow = {
  id: string;
  legacy_id: string | null;
  label_ar: string;
  price: number | string;
  is_active: boolean;
};

type ProductAddonLinkRow = {
  product_id: string;
  addon_id: string;
};

export type SupabaseAdaptedMenu = {
  categories: MenuCategory[];
  items: MenuItem[];
};

const VALID_CATEGORY_SLUGS: ReadonlySet<MenuCategorySlug> = new Set<MenuCategorySlug>([
  'crepe-meat',
  'crepe-chicken',
  'crepe-mixed',
  'crepe-tuscanini',
  'crepe-sweet',
  'pizza-meat',
  'pizza-chicken',
  'pizza-mixed',
  'pizza-tuscanini',
  'pasta',
  'sandwiches-french',
  'sandwiches-kaiser',
  'appetizers',
  'drinks',
  'waffle',
  'crepe-addons',
]);

function toAvailabilityStatus(value: string): AvailabilityStatus {
  if (value === 'available' || value === 'limited' || value === 'unavailable') {
    return value;
  }

  return 'available';
}

function toNumber(value: number | string | null | undefined): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function toCategorySlug(value: string): MenuCategorySlug | null {
  return VALID_CATEGORY_SLUGS.has(value as MenuCategorySlug) ? (value as MenuCategorySlug) : null;
}

function toProductBadgeVariant(value: string | null): ProductBadgeVariant | null {
  if (
    value === 'default' ||
    value === 'new' ||
    value === 'popular' ||
    value === 'recommended' ||
    value === 'spicy' ||
    value === 'offer' ||
    value === 'limited'
  ) {
    return value;
  }

  return null;
}

function toStableId(primaryId: string, legacyId: string | null): string {
  return legacyId && legacyId.length > 0 ? legacyId : primaryId;
}

export async function getSupabaseAdaptedMenu(): Promise<SupabaseAdaptedMenu> {
  const supabase = getSupabaseServerAdminClient();

  const [categoriesResult, productsResult, sizesResult, addonsResult, addonLinksResult] = await Promise.all([
    supabase
      .from('menu_categories')
      .select('id, legacy_id, name_ar, slug, description_ar, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('products')
      .select(
        'id, legacy_id, category_id, name_ar, description_ar, price_from, base_price, availability, product_badge_ar, product_badge_variant, sort_order, is_active',
      )
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('product_sizes')
      .select('id, product_id, legacy_id, label_ar, price, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase.from('product_addons').select('id, legacy_id, label_ar, price, is_active').eq('is_active', true),
    supabase.from('product_addon_links').select('product_id, addon_id'),
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

  const categoryRows = (categoriesResult.data ?? []) as MenuCategoryRow[];
  const productRows = (productsResult.data ?? []) as ProductRow[];
  const sizeRows = (sizesResult.data ?? []) as ProductSizeRow[];
  const addonRows = (addonsResult.data ?? []) as ProductAddonRow[];
  const addonLinkRows = (addonLinksResult.data ?? []) as ProductAddonLinkRow[];

  const categoryById = new Map<string, MenuCategory>();
  const categories: MenuCategory[] = [];

  for (const row of categoryRows) {
    const slug = toCategorySlug(row.slug);
    if (!slug) {
      continue;
    }

    const category: MenuCategory = {
      id: toStableId(row.id, row.legacy_id),
      name: row.name_ar,
      slug,
      description: row.description_ar ?? '',
    };

    categoryById.set(row.id, category);
    categories.push(category);
  }

  const sizeByProductId = new Map<string, ProductSize[]>();
  for (const row of sizeRows) {
    const price = toNumber(row.price);
    if (price === null) {
      continue;
    }

    const nextSize: ProductSize = {
      id: toStableId(row.id, row.legacy_id),
      label: row.label_ar,
      price,
    };

    const sizes = sizeByProductId.get(row.product_id);
    if (sizes) {
      sizes.push(nextSize);
    } else {
      sizeByProductId.set(row.product_id, [nextSize]);
    }
  }

  const addonById = new Map<string, ProductAddon>();
  for (const row of addonRows) {
    const price = toNumber(row.price);
    if (price === null) {
      continue;
    }

    addonById.set(row.id, {
      id: toStableId(row.id, row.legacy_id),
      label: row.label_ar,
      price,
    });
  }

  const addonIdsByProductId = new Map<string, string[]>();
  for (const row of addonLinkRows) {
    const ids = addonIdsByProductId.get(row.product_id);
    if (ids) {
      ids.push(row.addon_id);
    } else {
      addonIdsByProductId.set(row.product_id, [row.addon_id]);
    }
  }

  const items: MenuItem[] = [];
  for (const row of productRows) {
    const category = categoryById.get(row.category_id);
    if (!category) {
      continue;
    }

    const priceFrom = toNumber(row.price_from);
    if (priceFrom === null) {
      continue;
    }

    const basePrice = toNumber(row.base_price);
    const productAddonIds = addonIdsByProductId.get(row.id) ?? [];
    const productAddons = productAddonIds
      .map((addonId) => addonById.get(addonId))
      .filter((addon): addon is ProductAddon => addon !== undefined);

    const menuItem: MenuItem = {
      id: toStableId(row.id, row.legacy_id),
      name: row.name_ar,
      categorySlug: category.slug,
      description: row.description_ar ?? '',
      priceFrom,
      availability: toAvailabilityStatus(row.availability),
      sizes: sizeByProductId.get(row.id) ?? [],
      addons: productAddons,
    };

    const productBadgeAr = row.product_badge_ar?.trim() ?? '';
    if (productBadgeAr.length > 0) {
      menuItem.productBadgeAr = productBadgeAr;
      menuItem.productBadgeVariant = toProductBadgeVariant(row.product_badge_variant) ?? 'default';
    }

    if (basePrice !== null) {
      menuItem.basePrice = basePrice;
    }

    items.push(menuItem);
  }

  return {
    categories,
    items,
  };
}
