import 'server-only';

import { featuredItems, menuCategories } from '@/lib/mock-data';
import type { MenuCategory, MenuItem } from '@/types/menu';

/**
 * The project's OWNER explicitly chose on 19 Oct 2026 to reuse the existing
 * restaurant menu and its PREVIOUS prices until a new menu is supplied.
 *
 * This catalog is source-backed by the repository's original 16 categories
 * and item/size/addon records, not newly generated sample food/prices.
 *
 * Important distinction:
 * - Showing/catalog selection: use this unchanged legacy reference.
 * - Placing a real order: /api/orders still validates products/prices against
 *   the live restaurant DB and the ordering-open flag. A displayed old price
 *   is NOT proof that an order was accepted or that the item is in stock.
 * - Promotions have their own live validity gate; do not synthesize offers.
 */
export const previousMenuSource = {
  kind: 'owner-directed-previous-menu' as const,
  label: 'المنيو',
  note: 'الأسعار من المنيو السابق · الصور للتوضيح',
};

export type RebirthCatalog = {
  categories: MenuCategory[];
  items: MenuItem[];
  source: typeof previousMenuSource;
};

export function getRebirthMenuCatalog(): RebirthCatalog {
  return {
    categories: menuCategories,
    items: featuredItems,
    source: previousMenuSource,
  };
}
