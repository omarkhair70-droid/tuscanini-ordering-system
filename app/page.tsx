import type { Metadata } from 'next';
import { MenuFirstEntry } from '@/components/rebirth/menu-first-entry';
import './rebirth-home.css';
import './rebirth-exploration.css';
import './rebirth-menu.css';
import './rebirth-product.css';
import './rebirth-product-art.css';
import './rebirth-menu-first.css';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'توسكانيني | المنيو',
  description: 'منيو توسكانيني مباشرة — دور على أكلك، اختار الحجم والإضافات وراجع السلة.',
};

export default function HomePage({ searchParams }: { searchParams?: Promise<{table?:string;category?:string}> }) {
  return <MenuFirstEntry searchParams={searchParams} />;
}
