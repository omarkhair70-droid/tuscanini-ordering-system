import { MenuPageClient } from '@/components/menu/menu-page-client';
import { getRuntimeMenuData } from '@/lib/menu-runtime';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type MenuPageProps = {
  searchParams?: Promise<{
    table?: string;
  }>;
};

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const { categories, items } = await getRuntimeMenuData();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const tableReference = typeof resolvedSearchParams?.table === 'string' ? resolvedSearchParams.table.trim() : '';

  return <MenuPageClient categories={categories} items={items} initialTableReference={tableReference || null} />;
}
