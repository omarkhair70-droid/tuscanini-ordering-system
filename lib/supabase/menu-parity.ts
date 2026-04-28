import 'server-only';

import { featuredItems, menuCategories } from '@/lib/mock-data';
import type { MenuItem } from '@/types/menu';

import type { SupabaseAdaptedMenu } from './menu-adapter';

export type MenuParitySummary = {
  categoryCount: { expected: number; actual: number; matches: boolean };
  productCount: { expected: number; actual: number; matches: boolean };
  sizeCount: { expected: number; actual: number; matches: boolean };
  addonCount: { expected: number; actual: number; matches: boolean };
  productIds: { missing: string[]; extra: string[] };
  priceFromMismatches: Array<{ id: string; expected: number; actual: number }>;
  sizePriceMismatches: Array<{
    productId: string;
    sizeId: string;
    expected: number;
    actual: number;
  }>;
};

function getSizeCount(items: MenuItem[]): number {
  return items.reduce((total, item) => total + (item.sizes?.length ?? 0), 0);
}

function getAddonCount(items: MenuItem[]): number {
  return items.reduce((total, item) => total + (item.addons?.length ?? 0), 0);
}

function setDiff(expected: Set<string>, actual: Set<string>): { missing: string[]; extra: string[] } {
  const missing = [...expected].filter((id) => !actual.has(id)).sort();
  const extra = [...actual].filter((id) => !expected.has(id)).sort();
  return { missing, extra };
}

export function buildMenuParitySummary(adapted: SupabaseAdaptedMenu): MenuParitySummary {
  const expectedCategories = menuCategories;
  const expectedProducts = featuredItems;

  const expectedProductIds = new Set(expectedProducts.map((item) => item.id));
  const actualProductIds = new Set(adapted.items.map((item) => item.id));

  const expectedPriceFrom = new Map(expectedProducts.map((item) => [item.id, item.priceFrom]));
  const actualPriceFrom = new Map(adapted.items.map((item) => [item.id, item.priceFrom]));

  const expectedSizes = new Map<string, number>(
    expectedProducts.flatMap((item) =>
      (item.sizes ?? []).map((size) => [`${item.id}:${size.id}`, size.price] as const),
    ),
  );
  const actualSizes = new Map<string, number>(
    adapted.items.flatMap((item) =>
      (item.sizes ?? []).map((size) => [`${item.id}:${size.id}`, size.price] as const),
    ),
  );

  const priceFromMismatches = [...expectedPriceFrom.entries()]
    .map(([id, expected]) => {
      const actual = actualPriceFrom.get(id);
      if (actual == null || actual === expected) {
        return null;
      }

      return { id, expected, actual };
    })
    .filter((entry): entry is { id: string; expected: number; actual: number } => entry !== null);

  const sizePriceMismatches = [...expectedSizes.entries()]
    .map(([key, expected]) => {
      const actual = actualSizes.get(key);
      if (actual == null || actual === expected) {
        return null;
      }

      const [productId, sizeId] = key.split(':');
      return { productId, sizeId, expected, actual };
    })
    .filter(
      (
        entry,
      ): entry is {
        productId: string;
        sizeId: string;
        expected: number;
        actual: number;
      } => entry !== null,
    );

  return {
    categoryCount: {
      expected: expectedCategories.length,
      actual: adapted.categories.length,
      matches: expectedCategories.length === adapted.categories.length,
    },
    productCount: {
      expected: expectedProducts.length,
      actual: adapted.items.length,
      matches: expectedProducts.length === adapted.items.length,
    },
    sizeCount: {
      expected: getSizeCount(expectedProducts),
      actual: getSizeCount(adapted.items),
      matches: getSizeCount(expectedProducts) === getSizeCount(adapted.items),
    },
    addonCount: {
      expected: getAddonCount(expectedProducts),
      actual: getAddonCount(adapted.items),
      matches: getAddonCount(expectedProducts) === getAddonCount(adapted.items),
    },
    productIds: setDiff(expectedProductIds, actualProductIds),
    priceFromMismatches,
    sizePriceMismatches,
  };
}
