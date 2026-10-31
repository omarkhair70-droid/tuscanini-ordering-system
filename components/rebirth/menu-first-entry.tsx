import { RebirthMenu } from '@/components/rebirth/rebirth-menu';
import { getRebirthMenuCatalog } from '@/lib/rebirth/previous-menu-catalog';

type Props = { searchParams?: Promise<{ table?: string; category?: string }> };

/**
 * The homepage and /menu are the SAME real ordering experience.
 * This is an editorial presentation of the existing catalog/cart/product
 * components — no parallel HTML app, duplicate product state or fake prices.
 */
export async function MenuFirstEntry({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const { categories, items, source } = getRebirthMenuCatalog();
  const table = typeof params.table === 'string' ? params.table.trim() : '';
  return (
    <RebirthMenu categories={categories} items={items} source={source}
      initialTableReference={table || null} presentation="menu-first" />
  );
}
