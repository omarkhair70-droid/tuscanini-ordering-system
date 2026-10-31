import type { Metadata } from 'next';
import { MenuFirstEntry } from '@/components/rebirth/menu-first-entry';
import '../rebirth-home.css';
import '../rebirth-exploration.css';
import '../rebirth-menu.css';
import '../rebirth-product.css';
import '../rebirth-product-art.css';
import '../rebirth-menu-first.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const metadata: Metadata = {
  title: 'المنيو | توسكانيني — بني سويف',
  description: 'اختار أكلك مباشرة من منيو توسكانيني، وتصفح الأقسام والأحجام والإضافات.',
};

export default function MenuPage({ searchParams }: { searchParams?: Promise<{table?:string;category?:string}> }) {
  return <MenuFirstEntry searchParams={searchParams} />;
}
