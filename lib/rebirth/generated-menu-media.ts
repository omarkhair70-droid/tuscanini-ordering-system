import type { MenuCategorySlug } from '@/types/menu';

/**
 * PASS 19: 100 original generated illustrative FOOD VISUALS; never confirmed
 * photographs of a real restaurant dish or its exact ingredients.
 *
 * The matching uses food FAMILY first and item-name hints second. It does
 * not fabricate recipes, offers, or new menu products. Generated assets are
 * packaged separately in ChatGPT Library (first owner-approved 100 set).
 *
 * SAFETY GATE: binary assets must be present at
 * public/images/rebirth/generated/bNN-NN.webp and manually QA-approved
 * before turning on NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES=ready. Until then
 * the original Pexels illustrative photo + 113 one-off artworks remain live.
 */
export type GeneratedMenuPhoto = Readonly<{
  src:string;
  assetId:string;
  altAr:string;
  kind:'generated-illustrative';
  status:'representative-not-merchant-photograph';
}>;

export const GENERATED_MEDIA_READY =
  process.env.NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES === 'ready';

function image(batch:number,item:number):GeneratedMenuPhoto {
  const assetId='B'+String(batch).padStart(2,'0')+'-'+String(item).padStart(2,'0');
  return {
    src:'/images/rebirth/generated/'+assetId.toLowerCase()+'.webp',
    assetId,
    kind:'generated-illustrative',
    status:'representative-not-merchant-photograph',
    altAr:'صورة طعام مولدة توضيحية وليست تصويرا فعليا للصنف من مطعم توسكانيني'
  };
}
function series(batch:number,start=1,end=10) {
  return Array.from({length:end-start+1},(_,i)=>image(batch,start+i));
}
const bank={
  crepeBeef:[image(1,1),image(2,3),...series(4)],
  crepeChicken:[image(1,2),image(2,2),image(2,4),...series(3)],
  crepeOther:[image(2,9),...series(5)],
  crepeSweet:[image(1,3),...series(6,1,6)],
  pizzaMeat:[image(1,4),image(2,1),image(2,5),...series(7,3,3),...series(7,6,7),image(7,9)],
  pizzaChicken:[image(1,5),image(7,4),image(7,5)],
  pizzaMixed:[image(7,1),image(7,2),image(7,8),image(7,10)],
  pizzaSpecial:[image(1,4),image(1,5),image(2,1),...series(7)],
  pasta:[image(1,8),image(2,8),...series(9,1,5)],
  frenchSandwich:[image(1,6),image(1,7),...series(8,5,10)],
  kaiserBurger:[image(2,7),...series(8,1,4)],
  waffle:[image(1,9),image(2,6),...series(6,7,10)],
  fries:[image(1,10),image(2,10),...series(9,6,8)],
  appetizers:[image(9,9),image(9,10),...series(10,1,4)],
} satisfies Record<string,GeneratedMenuPhoto[]>;

function stableIndex(id:string,length:number) {
  let hash=2166136261;
  for(let i=0;i<id.length;i++) hash=Math.imul(hash^id.charCodeAt(i),16777619);
  return (hash>>>0)%length;
}
function includesAny(s:string,tokens:string[]) {
  return tokens.some(token=>s.includes(token));
}
export function getGeneratedMenuPhoto(
  id:string,name:string,category:MenuCategorySlug,
  enabled:boolean=GENERATED_MEDIA_READY
):GeneratedMenuPhoto|null{
  if(!enabled)return null;
  const n=name.normalize('NFKC').replace(/[إأآ]/g,'ا').toLowerCase();
  let group:GeneratedMenuPhoto[]|null=null;
  if(category==='crepe-meat')group=bank.crepeBeef;
  else if(category==='crepe-chicken')group=bank.crepeChicken;
  else if(category==='crepe-mixed')group=bank.crepeOther;
  else if(category==='crepe-tuscanini') {
    group=includesAny(n,['تشيكن','فراخ','كرانشي','زينجر'])?bank.crepeChicken:
      includesAny(n,['بيف','كباب','لحوم','برجر','تركي'])?bank.crepeBeef:bank.crepeOther;
  } else if(category==='crepe-sweet'){
    if(n.includes('لوتس'))return image(6,4);
    if(n.includes('وايت'))return image(6,3);
    group=bank.crepeSweet;
  } else if(category==='pizza-meat'){
    if(n.includes('بيروني'))return image(7,3);
    if(n.includes('بسطرم'))return image(2,5);
    if(n.includes('سجق'))return image(7,7);
    group=bank.pizzaMeat;
  } else if(category==='pizza-chicken')group=bank.pizzaChicken;
  else if(category==='pizza-mixed'){
    if(n.includes('مارجريتا'))return image(7,1);
    if(n.includes('جبن'))return image(7,2);
    if(n.includes('مشروم'))return image(7,8);
    // Tuna pizza has no matching generated reference; graphic is safer.
    if(n.includes('تونه')||n.includes('تونة'))return null;
    group=bank.pizzaMixed;
  } else if(category==='pizza-tuscanini'){
    group=includesAny(n,['تشيكن','فراخ','رانش','الفريدو'])?bank.pizzaChicken:
      includesAny(n,['بيف','كباب','سجق'])?bank.pizzaMeat:bank.pizzaSpecial;
  } else if(category==='pasta')group=bank.pasta;
  else if(category==='sandwiches-french'){
    group=includesAny(n,['بيف','لحم','سوسيس'])?[
      image(1,7),image(8,8),image(8,9),image(8,10)
    ]:bank.frenchSandwich;
  } else if(category==='sandwiches-kaiser')group=bank.kaiserBurger;
  else if(category==='waffle'){
    if(n.includes('لوتس'))return image(6,8);
    group=bank.waffle;
  } else if(category==='appetizers'){
    if(includesAny(n,['بطاطس','فرايز']))group=bank.fries;
    else if(n.includes('موزاريلا'))return image(9,9);
    else if(includesAny(n,['كرانشي','ستربس','استربس']))return image(9,10);
    // No AI photo of pickles, garlic sauce, coleslaw or onion rings.
    else return null;
  } else if(category==='drinks') {
    // All six actual historic drinks are branded soda or water;
    // generated milkshake visuals are NOT appropriate substitutes.
    return null;
  } else return null;
  return group?.[stableIndex(id,group.length)] ?? null;
}

export const GENERATED_ASSET_COUNT=100;
export const GENERATED_ASSET_IDS=Array.from({length:100},(_,i)=>
  'B'+String(1+Math.floor(i/10)).padStart(2,'0')+'-'+String(i%10+1).padStart(2,'0'));
