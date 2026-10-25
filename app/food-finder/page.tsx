import type { Metadata } from 'next';
import { RebirthFoodFinder } from '@/components/rebirth/rebirth-food-finder';
import { getRebirthMenuCatalog } from '@/lib/rebirth/previous-menu-catalog';
import '../rebirth-home.css';
import '../rebirth-finder.css';

export const dynamic='force-dynamic';
export const revalidate=0;
export const metadata: Metadata={
  title:'اختار أكلك | توسكانيني',
  description:'ساعد نفسك تختار من أصناف وأسعار منيو توسكانيني بالنوع والميزانية.',
};

export default function FoodFinderPage(){
  // Identical source and prices to /menu; do not invent spicy/new badges.
  const {categories,items,source}=getRebirthMenuCatalog();
  return <RebirthFoodFinder categories={categories} items={items} catalogReady={items.length>0} priceNote={source.note}/>;
}
