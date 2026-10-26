import type { MenuCategorySlug } from '@/types/menu';

/**
 * SKU-by-SKU illustration source review against the original 100-image visual atlas.
 * Every historical SKU is accounted for. Unlike the former FNV/modulo picker,
 * NO photo is assigned merely because it shares a broad food category.
 * A null means: use this SKU's original illustrated art, not an unrelated filling.
 * These references are conceptual imagery, never owner-certified dish photos.
 */
export type GeneratedMenuPhoto = Readonly<{
  src:string; assetId:string; altAr:string; kind:'generated-illustrative';
  status:'representative-not-merchant-photograph';
}>;
export const GENERATED_MEDIA_READY =
  process.env.NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES !== 'not-ready' &&
  process.env.NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES !== 'off';

export const CURATED_VISUALS: Readonly<Record<string,string|null>> = {
  'cm1': 'B04-07', // crepe-meat / برجر
  'cm2': 'B04-05', // crepe-meat / سوسيس
  'cm3': null, // crepe-meat / ميكس لحوم برجر ع سوسيس
  'cm4': 'B04-05', // crepe-meat / سجق
  'cm5': null, // crepe-meat / كفتة
  'cm6': 'B04-07', // crepe-meat / مفروم
  'cm7': 'B04-01', // crepe-meat / شاورما لحم
  'cm8': 'B04-06', // crepe-meat / فاهيتا لحم
  'cc1': 'B03-08', // crepe-chicken / شاورما فراخ
  'cc2': 'B03-03', // crepe-chicken / فاهيتا فراخ
  'cc3': 'B03-02', // crepe-chicken / شيش
  'cc4': null, // crepe-chicken / استربس
  'cc5': null, // crepe-chicken / بانيه
  'cc6': null, // crepe-chicken / زينجر
  'cc7': null, // crepe-chicken / برجر ع بانيه
  'cx1': null, // crepe-mixed / بطاطس
  'cx2': 'B05-03', // crepe-mixed / مشروم
  'cx3': 'B05-01', // crepe-mixed / ميكس جبن
  'cx4': null, // crepe-mixed / تونة
  'cx5': null, // crepe-mixed / بسطرمة
  'ct1': 'B04-04', // crepe-tuscanini / دوز كباب
  'ct2': null, // crepe-tuscanini / دوز كرانشي
  'ct3': 'B03-09', // crepe-tuscanini / تشيكن فاير
  'ct4': 'B03-02', // crepe-tuscanini / تشيكن رانش
  'ct5': null, // crepe-tuscanini / سوبريم
  'ct6': 'B04-02', // crepe-tuscanini / ميكس بيف
  'ct7': 'B03-01', // crepe-tuscanini / تشيكن أوميجا
  'ct8': 'B03-06', // crepe-tuscanini / تشيكن باربكيو
  'ct9': null, // crepe-tuscanini / توب برجر
  'ct10': null, // crepe-tuscanini / سيراتشا
  'ct11': null, // crepe-tuscanini / ميكس مدخنات
  'ct12': 'B04-04', // crepe-tuscanini / بيف ميجا
  'ct13': null, // crepe-tuscanini / لولي بوم
  'ct14': null, // crepe-tuscanini / تركي بيف
  'ct15': 'B03-09', // crepe-tuscanini / تشيكن روكت
  'cs1': 'B01-03', // crepe-sweet / كريب نوتيلا
  'cs2': 'B06-03', // crepe-sweet / كريب وايت
  'cs3': 'B06-04', // crepe-sweet / كريب لوتس
  'pm1': null, // pizza-meat / برجر
  'pm2': 'B07-06', // pizza-meat / سوسيس
  'pm3': 'B07-09', // pizza-meat / مفروم
  'pm4': 'B07-07', // pizza-meat / شاورما لحم
  'pm5': 'B07-03', // pizza-meat / بيروني
  'pm6': 'B02-05', // pizza-meat / بسطرمة
  'pm7': 'B07-07', // pizza-meat / ميكس لحوم
  'pc1': 'B07-04', // pizza-chicken / شاورما فراخ
  'pc2': null, // pizza-chicken / زينجر
  'pc3': 'B07-04', // pizza-chicken / شيش
  'pc4': null, // pizza-chicken / استربس
  'pc5': 'B07-05', // pizza-chicken / ميكس فراخ
  'px1': 'B07-01', // pizza-mixed / مارجريتا
  'px2': 'B07-02', // pizza-mixed / ميكس جبن
  'px3': null, // pizza-mixed / تونة
  'px4': 'B07-08', // pizza-mixed / مشروم
  'pt1': 'B07-04', // pizza-tuscanini / تشيكن رانش
  'pt2': 'B07-05', // pizza-tuscanini / تشيكن باربكيو
  'pt3': 'B07-04', // pizza-tuscanini / الفريدو
  'pt4': 'B07-05', // pizza-tuscanini / تشيكن فاير
  'pt5': 'B07-04', // pizza-tuscanini / تشيكن تكساس
  'pt6': null, // pizza-tuscanini / الباستشيو
  'pt7': 'B07-07', // pizza-tuscanini / دوز كباب
  'pt8': 'B07-06', // pizza-tuscanini / سجق كيري
  'pt9': 'B07-05', // pizza-tuscanini / توسكانيني تشيكن
  'pt10': 'B07-09', // pizza-tuscanini / توسكانيني بيف
  'pa1': 'B09-05', // pasta / نجرسكو
  'pa2': null, // pasta / جلاكسي
  'pa3': null, // pasta / استربس رانش
  'pa4': null, // pasta / زينجر شيدر
  'pa5': 'B09-05', // pasta / بشاميل
  'pa6': null, // pasta / سجق
  'pa7': 'B09-05', // pasta / عشاق جبن
  'pa8': null, // pasta / دوز كباب
  'pa9': 'B09-01', // pasta / الفريدو
  'pa10': null, // pasta / سوسيس او برجر
  'pa11': 'B09-03', // pasta / ميكس فراخ
  'pa12': 'B09-04', // pasta / ميكس لحوم
  'sf1': 'B01-06', // sandwiches-french / شاورما فراخ/شيش
  'sf2': null, // sandwiches-french / زينجر سوبريم
  'sf3': 'B08-10', // sandwiches-french / سوسيس ميكسكانو
  'sf4': 'B08-08', // sandwiches-french / شاورما لحم
  'sf5': null, // sandwiches-french / فاهيتا فراخ / لحم
  'sf6': null, // sandwiches-french / بوم فريت
  'sk1': 'B08-01', // sandwiches-kaiser / كايزر
  'sk2': 'B08-04', // sandwiches-kaiser / تشيز برجر
  'sk3': 'B08-03', // sandwiches-kaiser / توب برجر
  'sk4': 'B08-05', // sandwiches-kaiser / سموكي زينجر
  'sk5': 'B08-06', // sandwiches-kaiser / تشيكن فاير
  'sk6': 'B08-02', // sandwiches-kaiser / توسكانيني
  'ap1': null, // appetizers / باكت بطاطس
  'ap2': 'B09-10', // appetizers / باكت كرانشي
  'ap3': null, // appetizers / حلقات بصل
  'ap4': 'B09-09', // appetizers / استيك موزاريلا
  'ap5': 'B09-08', // appetizers / بطاطس شيدر / موزاريلا
  'ap6': null, // appetizers / كرسبي فرايز
  'ap7': null, // appetizers / كول سلو
  'ap8': null, // appetizers / بطاطس متبلة
  'ap9': null, // appetizers / تومية
  'ap10': null, // appetizers / مخلل
  'dr1': null, // drinks / مياه معدنية صغير
  'dr2': null, // drinks / مياه معدنية كبير
  'dr3': null, // drinks / بيبسي
  'dr4': null, // drinks / سفن
  'dr5': null, // drinks / تويست
  'dr6': null, // drinks / فيروز
  'wf1': 'B06-09', // waffle / وافل نوتيلا
  'wf2': 'B06-08', // waffle / وافل وايت
  'wf3': 'B06-10', // waffle / وافل لوتس
  'ca1': null, // crepe-addons / موتزاريلا
  'ca2': null, // crepe-addons / رومي
  'ca3': null, // crepe-addons / شيدر
  'ca4': null, // crepe-addons / كونو
  'ca5': null, // crepe-addons / رول
  'ca6': null, // crepe-addons / صوصات
};
const hasOwn=(id:string)=>Object.prototype.hasOwnProperty.call(CURATED_VISUALS,id);
export function getGeneratedMenuPhoto(id:string,_name:string,_category:MenuCategorySlug,enabled:boolean=GENERATED_MEDIA_READY):GeneratedMenuPhoto|null {
  if(!enabled || !hasOwn(id))return null;
  const assetId=CURATED_VISUALS[id];
  if(!assetId)return null;
  return {
    src:'/images/rebirth/generated/'+assetId.toLowerCase()+'.webp',
    assetId,kind:'generated-illustrative',
    status:'representative-not-merchant-photograph',
    altAr:'صورة طعام تخيلية قريبة من نوع الصنف؛ لا تؤكد المكونات أو الشكل الحقيقي للطلب'
  };
}
export const GENERATED_ASSET_COUNT=100;
export const GENERATED_ASSET_IDS=Array.from({length:100},(_,i)=>
  'B'+String(1+Math.floor(i/10)).padStart(2,'0')+'-'+String(i%10+1).padStart(2,'0'));
