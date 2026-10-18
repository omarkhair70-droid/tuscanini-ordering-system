import type { Metadata } from 'next';
import { RebirthMenu } from '@/components/rebirth/rebirth-menu';
import { getSupabaseAdaptedMenu } from '@/lib/supabase/menu-adapter';
import type { MenuCategory, MenuItem } from '@/types/menu';
import '../rebirth-home.css';
import '../rebirth-exploration.css';
import '../rebirth-menu.css';
import '../rebirth-product.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'المنيو | توسكانيني — بني سويف',
  description: 'ابحث في منيو توسكانيني واختر الأحجام والإضافات حسب توفر المنتجات.',
};

type Props = { searchParams?: Promise<{ table?: string }> };

export default async function MenuPage({ searchParams }: Props) {
  // Never silently substitute legacy/mock prices for genuine orderable products.
  let categories: MenuCategory[] = [];
  let items: MenuItem[] = [];
  let sourceVerified = false;
  try {
    const result = await getSupabaseAdaptedMenu();
    categories = result.categories;
    items = result.items;
    sourceVerified = categories.length > 0 && items.length > 0;
  } catch {
    // A transparent unavailable state is safer than presenting stale old prices.
  }
  const params = searchParams ? await searchParams : {};
  const table = typeof params.table === 'string' ? params.table.trim() : '';
  return <RebirthMenu categories={categories} items={items} initialTableReference={table || null} sourceVerified={sourceVerified} />;
}
