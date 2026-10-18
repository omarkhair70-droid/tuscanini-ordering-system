import type { Metadata } from 'next';
import { RebirthMenu } from '@/components/rebirth/rebirth-menu';
import { getRebirthMenuCatalog } from '@/lib/rebirth/previous-menu-catalog';
import '../rebirth-home.css';
import '../rebirth-exploration.css';
import '../rebirth-menu.css';
import '../rebirth-product.css';
import '../rebirth-product-art.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'المنيو | توسكانيني — بني سويف',
  description: 'ابحث في منيو توسكانيني واختر الأحجام والإضافات حسب توفر المنتجات.',
};

type Props = { searchParams?: Promise<{ table?: string }> };

export default async function MenuPage({ searchParams }: Props) {
  // Owner decision: the existing restaurant menu and its recorded prices
  // are the baseline until a replacement is provided. Live order acceptance
  // remains independently validated by the server; this page never posts an order.
  const { categories, items, source } = getRebirthMenuCatalog();
  const params = searchParams ? await searchParams : {};
  const table = typeof params.table === 'string' ? params.table.trim() : '';
  return <RebirthMenu categories={categories} items={items} initialTableReference={table || null} source={source} />;
}
