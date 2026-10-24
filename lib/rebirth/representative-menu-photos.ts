import type { MenuCategorySlug } from '@/types/menu';

/**
 * PASS 18 / representative licensed stock photos. Separate from the restaurant's
 * 12 historical source photos AND from approved exact-SKU imagery.
 *
 * Explicitly illustrative food references; NEVER evidence of this precise
 * Tuscanini item's toppings, ingredients, serving size, packaging or availability.
 *
 * Sources: https://www.pexels.com/license/
 * Each page was researched on 19 Oct 2026 and says "Free to use".
 * Attribution remains in-repo and available in the image UI.
 *
 * Remote URLs are deliberately stable pinned Pexels photo IDs, not search
 * result URLs. Broken hotlinks fail back to the local original SVG artwork.
 * Prefer eventually downloading an owner-approved image set to a local CDN.
 */
export type RepresentativeMenuPhoto = Readonly<{
  photoId:string;
  src:string;
  page:string;
  photographer:string;
  altAr:string;
  kind:'representative-stock';
  subject:string;
}>;

const canonicalPhotoPaths:Readonly<Record<number,string>>={
  32592740:'two-savory-crepes-with-fresh-filling-32592740',
  29143160:'close-up-of-savory-meat-filled-crepes-on-plate-29143160',
  31856262:'delicious-chocolate-drizzled-crepe-on-brown-paper-31856262',
  5903164:'a-crepe-with-chocolate-filling-on-white-ceramic-plate-5903164',
  2180877:'top-view-photo-of-sliced-pizza-2180877',
  4394623:'yummy-assorted-pizza-on-table-in-kitchen-4394623',
  3214161:'plate-of-pasta-3214161',
  14537686:'pasta-with-sauce-on-plate-14537686',
  30350298:'close-up-of-gourmet-chicken-sandwich-on-wooden-plate-30350298',
  1431305:'chicken-burger-with-fries-1431305',
  34964956:'chocolate-waffle-with-dark-and-white-chocolate-34964956',
  34964948:'delicious-waffle-and-chocolate-dessert-close-up-34964948',
  5041473:'sliced-potato-fries-on-white-surface-5041473',
  8215113:'healthy-fruit-juices-in-glasses-8215113',
};

function pexels(id:number,photographer:string,subject:string,altAr:string):RepresentativeMenuPhoto{
  return {
    photoId:'PX-'+id,src:`https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=640`,
    page:`https://www.pexels.com/photo/${canonicalPhotoPaths[id]}/`,
    photographer,altAr,kind:'representative-stock',subject,
  };
}

const samples={
  crepeSavory:[
    pexels(32592740,'Anthony Rahayel','Savory crêpe',
      'صورة توضيحية لكريب مالح بحشوة مختلفة، ليست صورة الصنف ولا من توسكانيني'),
    pexels(29143160,'Valeria Boltneva','Meat-filled crêpes',
      'صورة ستوك قريبة لكريب مالح محشو؛ لا تُظهر وجبة توسكانيني ولا تحدد حشو الصنف'),
  ],
  crepeSweet:[
    pexels(31856262,'Simona Russo','Chocolate crêpe',
      'صورة توضيحية لكريب حلو بالشوكولاتة وليست وصفًا لحشو الصنف المختار'),
    pexels(5903164,'ROMAN ODINTSOV','Chocolate crêpe',
      'كريب حلو توضيحي من مكتبة صور، وليس منتج توسكانيني الفعلي'),
  ],
  pizza:[
    pexels(2180877,'Athena Sandrini','Pizza',
      'صورة توضيحية لبيتزا مصورة من أعلى؛ الإضافات لا تمثل تفاصيل الصنف'),
    pexels(4394623,'Natasha Filippovskaya','Pizza',
      'صورة ستوك لبيتزا بإضافات متنوعة، ليست بيتزا توسكانيني'),
  ],
  pasta:[
    pexels(3214161,'Engin Akyurt','Pasta',
      'صورة توضيحية لطبق باستا ولا تمثل وصفة الصنف'),
    pexels(14537686,'Cristian Mihaila','Pasta',
      'باستا مصورة لأغراض العرض التوضيحي، ليست من المطعم'),
  ],
  sandwich:[
    pexels(30350298,'Anthony Rahayel','Sandwich',
      'صورة توضيحية لساندوتش ولا تعرض المنتج الفعلي للمطعم'),
    pexels(1431305,'Anush Gorak','Chicken sandwich',
      'صورة ساندوتش توضيحية من مكتبة صور، وليست وصفًا للمكونات الحقيقية'),
  ],
  waffle:[
    pexels(34964956,'Kunal Lakhotia','Waffle',
      'صورة توضيحية لوافل بالشوكولاتة، قد تختلف عن الوافل المطلوب'),
    pexels(34964948,'Kunal Lakhotia','Waffle dessert',
      'صورة توضيحية لحلوى الوافل، وليست صورة من توسكانيني'),
  ],
  sides:[pexels(5041473,'Jesus Cabrera','Fries',
    'صورة توضيحية لمقبلات بطاطس مقلية، لا تحدد محتويات الصنف')],
  drinks:[pexels(8215113,'Kindel Media','Drinks',
    'صورة توضيحية لمشروبات من مكتبة صور، لا تمثل المشروب المختار')],
} as const;

function consistentIndex(value:string,limit:number):number{
  let hash=0;
  for(let i=0;i<value.length;i++)hash=(Math.imul(hash,33)+value.charCodeAt(i))>>>0;
  return hash%limit;
}

export function getRepresentativeMenuPhoto(id:string,category:MenuCategorySlug,name=''):RepresentativeMenuPhoto|null{
  // Keep historical-photo fallbacks truthful even if generated media is explicitly disabled.
  const normalized=name.normalize('NFKC').replace(/[إأآ]/g,'ا');
  if(category==='crepe-addons'||category==='drinks')return null;
  if(category==='crepe-mixed'&&/تونه|تونة/.test(normalized))return null;
  if(category==='pizza-mixed'&&/تونه|تونة/.test(normalized))return null;
  if(category==='sandwiches-french'&&/بوم فريت/.test(normalized))return null;
  if(category==='appetizers'&&!/بطاطس|فرايز/.test(normalized))return null;
  let photos: readonly RepresentativeMenuPhoto[];
  if(category==='crepe-sweet')photos=samples.crepeSweet;
  else if(category.startsWith('crepe-'))photos=samples.crepeSavory;
  else if(category.startsWith('pizza-'))photos=samples.pizza;
  else if(category.startsWith('sandwiches-'))photos=samples.sandwich;
  else if(category==='pasta')photos=samples.pasta;
  else if(category==='waffle')photos=samples.waffle;
  else if(category==='drinks')photos=samples.drinks;
  else if(category==='appetizers')photos=samples.sides;
  else return null;
  return photos[consistentIndex(id,photos.length)];
}
