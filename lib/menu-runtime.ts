import 'server-only';

import { featuredItems, menuCategories } from '@/lib/mock-data';
import { getSupabaseAdaptedMenu } from '@/lib/supabase/menu-adapter';
import type { MenuCategory, MenuItem } from '@/types/menu';

export type RuntimeMenuData = {
  categories: MenuCategory[];
  items: MenuItem[];
};

function getMockRuntimeMenuData(): RuntimeMenuData {
  return {
    categories: menuCategories,
    items: featuredItems,
  };
}

function isValidRuntimeMenuData(data: RuntimeMenuData): boolean {
  return data.categories.length > 0 && data.items.length > 0;
}

export async function getRuntimeMenuData(): Promise<RuntimeMenuData> {
  try {
    const adapted = await getSupabaseAdaptedMenu();
    if (isValidRuntimeMenuData(adapted)) {
      return adapted;
    }
  } catch {
    // Intentionally swallow errors to keep /menu available with mock fallback.
  }

  return getMockRuntimeMenuData();
}
