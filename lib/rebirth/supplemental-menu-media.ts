import { GENERATED_MEDIA_READY } from '@/lib/rebirth/generated-menu-media';

/**
 * Twenty new 512px conceptual menu images. They are NOT confirmed Tuscanini
 * dish photographs, serving-size illustrations, or ingredient lists.
 * Original 100 generated visuals remain unchanged and get priority for their
 * already-mapped 93+ SKUs. These exact stable product IDs supply previously
 * missing optional illustrations. The 6 flagged concepts need merchant
 * verification before any real-ordering launch.
 */
export const SUPPLEMENTAL_SKU_IDS = [
  'cx4', 'px3', 'sf5', 'sf6', 'ap3', 'ap7', 'ap9', 'ap10', 'dr1', 'dr2', 'dr3', 'dr4', 'dr5', 'dr6', 'ca1', 'ca2', 'ca3', 'ca4', 'ca5', 'ca6'
] as const;
export const SUPPLEMENTAL_REVIEW_REQUIRED = [
  'sf5', 'sf6', 'dr5', 'dr6', 'ca4', 'ca5'
] as const;
const supplementSet:ReadonlySet<string>=new Set(SUPPLEMENTAL_SKU_IDS);
const flaggedSet:ReadonlySet<string>=new Set(SUPPLEMENTAL_REVIEW_REQUIRED);

export type SupplementalConcept = Readonly<{
  src:string; assetId:string; altAr:string; kind:'generated-illustrative';
  status:'representative-not-merchant-photograph';
  reviewStatus:'concept-preview'|'merchant-review-required';
}>;

export function getSupplementalMenuPhoto(id:string):SupplementalConcept|null {
  // Six ambiguous/mismatched concepts stay in the repo for art review, but
  // must NOT appear as the named food, drink or addon in the public draft menu.
  if(!GENERATED_MEDIA_READY||!supplementSet.has(id)||flaggedSet.has(id))return null;
  const reviewStatus=flaggedSet.has(id)?'merchant-review-required':'concept-preview';
  return {
    src:'/images/rebirth/supplemental/'+id+'.webp',
    assetId:'SKU-'+id.toUpperCase(),
    kind:'generated-illustrative',
    status:'representative-not-merchant-photograph',
    reviewStatus,
    altAr:reviewStatus==='merchant-review-required'
      ? 'صورة تخيلية للتوضيح فقط؛ الشكل والمكونات يحتاجان تأكيد المطعم'
      : 'صورة تخيلية للصنف للتوضيح فقط وليست تصويرا لمنتج توسكانيني الفعلي'
  };
}
