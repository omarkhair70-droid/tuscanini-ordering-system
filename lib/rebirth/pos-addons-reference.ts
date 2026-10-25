import type { ProductAddon } from '@/types/menu';
/**
 * Reconciled 25 Oct 2026 from the merchant's photographed cashier POS "الإضافات" panel.
 * Screenshot is a pricing REFERENCE only, not proof a web order reaches that POS.
 * Options tagged unresolved are deliberately excluded until staff clarify their meaning.
 * IDs are WEBSITE keys; actual POS item/modifier codes must come from its developer.
 */
type PosGroup='cheese'|'fillings'|'sauces'|'preparation'|'unresolved';
type PosModifier=Readonly<{key:string;name:string;price:number;group:PosGroup;webSelectable:boolean}>;
export const POS_MODIFIERS_20261025:ReadonlyArray<PosModifier>=[
  {key:'mozzarella',name:'موتزاريلا',price:20,group:'cheese',webSelectable:true},
  {key:'roumy',name:'رومي',price:20,group:'cheese',webSelectable:true},
  {key:'cheddar',name:'شيدر',price:15,group:'cheese',webSelectable:true},
  {key:'cono',name:'كونو',price:25,group:'preparation',webSelectable:true},
  {key:'roll',name:'رول',price:20,group:'preparation',webSelectable:true},
  {key:'texas-sauce',name:'صوص تكساس',price:15,group:'sauces',webSelectable:true},
  {key:'double-flatbread',name:'دبل فطيرة',price:15,group:'preparation',webSelectable:true},
  {key:'sausage-large',name:'إضافة سوسيس كبير',price:30,group:'fillings',webSelectable:true},
  {key:'burger-large',name:'إضافة برجر كبير',price:30,group:'fillings',webSelectable:true},
  {key:'sausage-small',name:'إضافة سوسيس صغير',price:15,group:'fillings',webSelectable:true},
  {key:'burger-small',name:'إضافة برجر صغير',price:15,group:'fillings',webSelectable:true},
  {key:'doner',name:'إضافة دونرز',price:35,group:'fillings',webSelectable:true},
  {key:'thousand-island',name:'صوص ألف جزيرة',price:15,group:'sauces',webSelectable:true},
  {key:'cheddar-sauce',name:'صوص شيدر',price:15,group:'sauces',webSelectable:true},
  {key:'barbecue-sauce',name:'صوص باربكيو',price:15,group:'sauces',webSelectable:true},
  {key:'sweet-chili-sauce',name:'صوص سويت تشيلي',price:15,group:'sauces',webSelectable:true},
  {key:'ranch-sauce',name:'صوص رانش',price:15,group:'sauces',webSelectable:true},
  {key:'strips',name:'إضافة استربس',price:25,group:'fillings',webSelectable:true},
  {key:'mushroom',name:'إضافة مشروم',price:20,group:'fillings',webSelectable:true},
  {key:'potatoes',name:'إضافة بطاطس',price:10,group:'fillings',webSelectable:true},
  {key:'kofta',name:'إضافة كفتة',price:30,group:'fillings',webSelectable:true},
  {key:'sojok',name:'إضافة سجق',price:25,group:'fillings',webSelectable:true},
  {key:'mixed-cheese',name:'ميكس جبن',price:25,group:'cheese',webSelectable:true},
  {key:'crispy',name:'إضافة كريسبي',price:15,group:'fillings',webSelectable:true},
  {key:'saf-s',name:'S أساف',price:35,group:'unresolved',webSelectable:false},
  {key:'saf-m',name:'M أساف',price:45,group:'unresolved',webSelectable:false},
  {key:'saf-l',name:'L أساف',price:60,group:'unresolved',webSelectable:false},
  {key:'saf-f',name:'F أساف',price:75,group:'unresolved',webSelectable:false},
  {key:'shawarma',name:'إضافة شاورما',price:25,group:'fillings',webSelectable:true},
  {key:'fajita',name:'إضافة فاهيتا',price:30,group:'fillings',webSelectable:true},
  {key:'turkey-smoked',name:'إضافة تركي مدخن',price:20,group:'fillings',webSelectable:true},
  {key:'roast-beef',name:'إضافة روزبيف',price:20,group:'fillings',webSelectable:true},
  {key:'salami',name:'إضافة سلامي',price:20,group:'fillings',webSelectable:true},
  {key:'basterma',name:'إضافة بسطرمة',price:40,group:'fillings',webSelectable:true},
];
export const POS_MODIFIER_GROUPS=[
  {id:'cheese',label:'الجبن'},
  {id:'fillings',label:'حشوات إضافية'},
  {id:'sauces',label:'الصوصات'},
  {id:'preparation',label:'اختيارات تانية'},
] as const;
export function getPosModifierGroup(addonId:string):PosGroup|undefined{
  const key=addonId.startsWith('addon-')?addonId.slice('addon-'.length):'';
  return POS_MODIFIERS_20261025.find(m=>m.key===key)?.group;
}
export const posCrepeAddons:ProductAddon[] = POS_MODIFIERS_20261025
  .filter(option=>option.webSelectable)
  .map(option=>({id:'addon-'+option.key,label:option.name,price:option.price}));
