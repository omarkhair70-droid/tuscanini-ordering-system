import type { Metadata } from 'next';
import { RebirthFoodFinder } from '@/components/rebirth/rebirth-food-finder';
import { getSupabaseAdaptedMenu } from '@/lib/supabase/menu-adapter';
import type { MenuCategory, MenuItem } from '@/types/menu';
import '../rebirth-home.css';
import '../rebirth-finder.css';
export const dynamic='force-dynamic';
export const revalidate=0;
export const metadata: Metadata={title:'اختار أكلك | توسكانيني',description:'اكتشف أصنافًا من المنيو المتاحة، حسب النوع والعلامة والسعر الابتدائي.'};
export default async function FoodFinderPage(){
  let categories:MenuCategory[]=[];
  let items:MenuItem[]=[];
  let live=false;
  try{
    const result=await getSupabaseAdaptedMenu();
    categories=result.categories;
    items=result.items;
    live=categories.length>0&&items.length>0;
  }catch{
    // Fail closed. Historical mock menu must never be presented as recommendations.
  }
  return <RebirthFoodFinder categories={categories} items={items} live={live}/>;
}
