import { featuredItems } from '@/lib/mock-data';
import type { MenuCategorySlug } from '@/types/menu';
import type { ProductCartItem } from '@/types/cart';

/**
 * The original restaurant menu deliberately uses short product labels,
 * e.g. both a crepe and a pizza are called "شاورما لحم".
 * A cart line must show a full, unambiguous product identity.
 *
 * The immutable product id and the canonical previous-menu catalog, NOT
 * user-entered text or the cart's stored name, establish its category.
 * Old localStorage carts without categorySlug continue to render correctly.
 */
const menuCategories: Record<MenuCategorySlug, { label: string; prefix?: string }> = {
  'crepe-meat': {label:'كريب لحوم',prefix:'كريب'},
  'crepe-chicken': {label:'كريب فراخ',prefix:'كريب'},
  'crepe-mixed': {label:'كريب متنوع',prefix:'كريب'},
  'crepe-tuscanini': {label:'كريب توسكانيني',prefix:'كريب'},
  'crepe-sweet': {label:'كريب حلو',prefix:'كريب'},
  'pizza-meat': {label:'بيتزا لحوم',prefix:'بيتزا'},
  'pizza-chicken': {label:'بيتزا فراخ',prefix:'بيتزا'},
  'pizza-mixed': {label:'بيتزا متنوع',prefix:'بيتزا'},
  'pizza-tuscanini': {label:'بيتزا توسكانيني',prefix:'بيتزا'},
  pasta: {label:'باستا',prefix:'باستا'},
  'sandwiches-french': {label:'ساندوتشات فرنساوي',prefix:'ساندوتش فرنساوي'},
  'sandwiches-kaiser': {label:'ساندوتشات كيزر',prefix:'ساندوتش كيزر'},
  appetizers: {label:'مقبلات'},
  drinks: {label:'مشروبات'},
  waffle: {label:'وافل',prefix:'وافل'},
  'crepe-addons': {label:'إضافات كريب'},
};
const canonicalById = new Map(featuredItems.map(p=>[p.id,p] as const));

export function productCartIdentity(
  item: Pick<ProductCartItem,'productId'|'productName'|'categorySlug'>
): {name:string;category:string|null;known:boolean}{
  const fromCatalog=canonicalById.get(item.productId);
  const slug=fromCatalog?.categorySlug ??
    (item.categorySlug && item.categorySlug in menuCategories ? item.categorySlug : null);
  // Display the original name from the canonical source when known. This
  // ensures outdated cart display labels cannot impersonate a new recipe.
  const base=(fromCatalog?.name??item.productName).trim() || 'صنف';
  if(!slug)return {name:base,category:null,known:false};
  const family=menuCategories[slug];
  const prefix=family.prefix;
  const name=!prefix || base===prefix || base.startsWith(prefix+' ')?
    base : prefix+' '+base;
  return {name,category:family.label,known:true};
}
