import { MenuPageClient } from '@/components/menu/menu-page-client';
import { getRuntimeMenuData } from '@/lib/menu-runtime';

export default async function MenuPage() {
  const { categories, items } = await getRuntimeMenuData();

  return <MenuPageClient categories={categories} items={items} />;
}
