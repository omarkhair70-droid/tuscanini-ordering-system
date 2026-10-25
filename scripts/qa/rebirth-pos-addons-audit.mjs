import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const module=await readFile('lib/rebirth/pos-addons-reference.ts','utf8');
const catalog=await readFile('lib/mock-data.ts','utf8');
const hero=await readFile('components/home/rebirth-home.tsx','utf8');
const dialog=await readFile('components/rebirth/rebirth-product-dialog.tsx','utf8');
const rows=[...module.matchAll(/\{key:'([^']+)',name:'([^']+)',price:(\d+),group:'([^']+)',webSelectable:(true|false)\}/g)];
assert.equal(rows.length,34,'Merchant POS photo must be transcribed as 34 distinct choices');
assert.equal(new Set(rows.map(r=>r[1])).size,34,'Duplicate modifier key');
assert.equal(rows.filter(r=>r[5]==='true').length,30,'Only 30 verifiable modifiers selectable');
assert.equal(rows.filter(r=>r[5]==='false').length,4,'Four ambiguous S/M/L/F options held');
const byKey=new Map(rows.map(r=>[r[1],{name:r[2],price:Number(r[3])}]));
for(const [key,name,price] of [
 ['mozzarella','موتزاريلا',20],['roumy','رومي',20],['cheddar','شيدر',15],
 ['roll','رول',20],['cono','كونو',25],['potatoes','إضافة بطاطس',10],
 ['thousand-island','صوص ألف جزيرة',15],['basterma','إضافة بسطرمة',40],
 ['roast-beef','إضافة روزبيف',20]
]){
 assert.deepEqual(byKey.get(key),{name,price},'POS reference drift for '+key);
}
assert.match(catalog,/import \{ posCrepeAddons \} from '@\/lib\/rebirth\/pos-addons-reference'/,
  'Menu must load POS-backed modifier reference');
assert.match(catalog,/\{ id: 'ca5', name: 'رول'.*priceFrom: 20.*price: 20/,
  'Standalone roll price must match POS photo');
assert.match(hero,/الكريب بيتكلم\./,'Actual Tuscanini brand voice must appear in Home hero');
assert.match(dialog,/POS_MODIFIER_GROUPS\.map/,'Grouped options must be visible in the product sheet');
assert.match(dialog,/<details className="t-product-dialog__addon-group"/,
  'Product sheet must use progressive disclosure, not a 30-row wall');
console.log('POS ADD-ONS: 34 photographed, 30 eligible, 4 held. Brand line + rollout guard OK.');
