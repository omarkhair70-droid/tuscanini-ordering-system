import type { MenuCategorySlug } from '@/types/menu';

/**
 * Photo-by-product truth gate.
 *
 * The actual 12 restaurant source photos show food FAMILIES, not confirmed
 * photographs of any named legacy menu SKU. Therefore NO photo is bound to
 * an item ID until a source photo, size/recipe match and owner acceptance
 * are documented. This manifest deliberately starts empty.
 *
 * When a real photo is approved, add a mapping to a COMMITTED local file,
 * with the exact SKU ID, credit and explicit review evidence.
 */
export type VerifiedMenuPhoto = Readonly<{
  productId: string;
  imagePath: string;
  altAr: string;
  source: string;
  verifiedBy: string;
}>;

export const verifiedMenuPhotos: Readonly<Record<string, VerifiedMenuPhoto>> = {};

export function getVerifiedMenuPhoto(productId: string): VerifiedMenuPhoto | null {
  const match = verifiedMenuPhotos[productId];
  return match?.productId === productId ? match : null;
}

/** Real context photos may illustrate an entire category, NEVER a named item. */
export function getCategoryContextPhoto(category: MenuCategorySlug): {src:string;alt:string;credit:string}|null {
  if(category.startsWith('crepe-')){
    return {
      src:'/images/rebirth/food-07.jpg',
      alt:'صورة أصلية لثلاثة كريبات مفتوحة من توسكانيني، وليست صورة لأي صنف باسمه',
      credit:'TSC-07 / صورة عامة للكريب من المطعم',
    };
  }
  if(category.startsWith('pizza-')){
    return {
      src:'/images/rebirth/food-10.jpg',
      alt:'صورة أصلية لبيتزا توسكانيني من أعلى، وليست صورة لأي بيتزا مسماة في المنيو',
      credit:'TSC-10 / صورة عامة للبيتزا من المطعم',
    };
  }
  if(category.startsWith('sandwiches-')){
    return {
      src:'/images/rebirth/food-08.jpg',
      alt:'صورة أصلية لساندوتشات وتغليف توسكانيني، وليست صورة لأي ساندوتش محدد',
      credit:'TSC-08 / صور عامة للساندوتشات والتغليف',
    };
  }
  return null;
}
