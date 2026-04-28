import { MenuPageClient } from '@/components/menu/menu-page-client';
import { getRuntimeMenuData } from '@/lib/menu-runtime';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MenuPage() {
  const { categories, items } = await getRuntimeMenuData();

  return <MenuPageClient categories={categories} items={items} />;
}
