import ts from 'typescript-compat';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { Script, createContext } from 'node:vm';

/**
 * PASS19: test the actual matching source against the 113 unchanged owner
 * menu records. This test runs even before the binary 100 photos are copied.
 * It never marks any AI image as an actual Tuscanini restaurant photograph.
 */
const menuText=await readFile('lib/mock-data.ts','utf8');
const source=await readFile('lib/rebirth/generated-menu-media.ts','utf8');
const sf=ts.createSourceFile('menu.ts',menuText,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
let literal;
function seek(node){if(ts.isVariableDeclaration(node)&&node.name.getText(sf)==='featuredItems')literal=node.initializer;ts.forEachChild(node,seek)}
seek(sf);
if(!literal||!ts.isArrayLiteralExpression(literal))throw Error('Original owner menu records missing');
function val(obj,key) {
  const p=obj.properties.find(p=>ts.isPropertyAssignment(p) && p.name.getText(sf).replace(/['"]/g,'')===key);
  const n=p?.initializer;return ts.isStringLiteral(n)?n.text:null;
}
const items=literal.elements.map(n=>({id:val(n,'id'),name:val(n,'name'),category:val(n,'categorySlug')}));
if(items.length!==113||new Set(items.map(i=>i.id)).size!==113)throw Error('Original 113 catalog records were modified');
const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
const sandbox={exports:{},process:{env:{NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES:'not-ready'}}};
const context=createContext(sandbox);
new Script(compiled).runInContext(context);
const {getGeneratedMenuPhoto,GENERATED_ASSET_COUNT,GENERATED_ASSET_IDS}=sandbox.exports;
if(GENERATED_ASSET_COUNT!==100||GENERATED_ASSET_IDS.length!==100||new Set(GENERATED_ASSET_IDS).size!==100)
  throw Error('Missing or duplicate 100-image generated catalog IDs');

const curated=getGeneratedMenuPhoto&&sandbox.exports.CURATED_VISUALS;
if(!curated||Object.keys(curated).length!==113)throw Error('Every one of the 113 historic SKUs requires a deliberate mapping or null');
if(items.some(i=>!Object.prototype.hasOwnProperty.call(curated,i.id)))
  throw Error('Some historical SKUs still inherit a random food-family photo');
if(getGeneratedMenuPhoto('cm2','سوسيس','crepe-meat',true)?.assetId!=='B04-05')
  throw Error('Sausage photo incorrectly mapped');
if(getGeneratedMenuPhoto('ct2','دوز كرانشي','crepe-tuscanini',true)!==null)
  throw Error('Crunchy crepe must not depict ordinary grilled chicken');
if(getGeneratedMenuPhoto('pm3','مفروم','pizza-meat',true)?.assetId==='B07-03')
  throw Error('Pepperoni visual assigned to minced pizza');
if(getGeneratedMenuPhoto('cx1','بطاطس','crepe-mixed',true)!==null)
  throw Error('Cheese visual assigned to potato crepe');

const used=new Set();
const entries=[];
for(const item of items){
  if(getGeneratedMenuPhoto(item.id,item.name,item.category)!==null)throw Error('Photo used despite binary not-ready flag');
  const photo=getGeneratedMenuPhoto(item.id,item.name,item.category,true);
  if(photo&&(!GENERATED_ASSET_IDS.includes(photo.assetId)||
    photo.src!=='/images/rebirth/generated/'+photo.assetId.toLowerCase()+'.webp'||
    photo.kind!=='generated-illustrative'||
    photo.status!=='representative-not-merchant-photograph'))
    throw Error('Bad generated visual provenance for '+item.id);
  if(['drinks','crepe-addons'].includes(item.category)&&photo)
    throw Error('Unverified milkshake/meal falsely used for packaged drinks/addons: '+item.id);
  if(['pizza-mixed','crepe-mixed'].includes(item.category)&&item.name==='تونة'&&photo)
    throw Error('Invented tuna pizza photo: '+item.id);
  if(item.category==='crepe-meat'&&photo&&['B01-01','B02-03'].includes(photo.assetId))
    throw Error('Chicken study assigned to beef crepe '+item.id);
  if(item.category==='sandwiches-french'&&photo&&['B08-05','B08-06','B08-07'].includes(photo.assetId))
    throw Error('Burger bun study used for French bread '+item.id);
  if(item.category==='sandwiches-french'&&item.name==='بوم فريت'&&photo)
    throw Error('Unverified fries sandwich reference '+item.id);
  if(item.category==='sandwiches-kaiser'&&['سموكي زينجر','تشيكن فاير'].includes(item.name)&&photo&&
     !['B08-05','B08-06','B08-07'].includes(photo.assetId))
    throw Error('Beef burger image assigned to named chicken burger '+item.id);
  if(photo)used.add(photo.assetId);
  entries.push({...item,assetId:photo?.assetId??null,photoKind:photo?.kind??'original-drawn-or-stock-fallback'});
}
await mkdir('artifacts/screenshots',{recursive:true});
await writeFile('artifacts/screenshots/generated-menu-source-match-audit.json',
  JSON.stringify({previousMenuItems:items.length,mediaPool:100,menuMediaMapped:entries.filter(x=>x.assetId).length,usedUniqueImagesInMenu:used.size,generatedMediaActiveByDefault:false,exactMerchantDishPhotos:0,nonMenuImagesAccessibleInVisualAtlas:100,items:entries},null,2));
console.log('GENERATED IMAGE / ORIGINAL 113 MENU AUDIT: '+entries.filter(x=>x.assetId).length+
  '/113 category-safe representative matches, '+used.size+' unique generated images among named menu items; all 100 available as visual art atlas after binary install. No change in previous price records.');

// Supplemental twenty local SKUs are concept photos, not additions to the owner
// 100-media atlas and not exact merchant photo approvals.
const supplements=['cx4','px3','sf5','sf6','ap3','ap7','ap9','ap10','dr1','dr2','dr3','dr4','dr5','dr6','ca1','ca2','ca3','ca4','ca5','ca6'];
if(new Set(supplements).size!==20)throw Error('Supplemental SKU images not unique');
const supplementalSHA=new Set();
for(const id of supplements){
  const raw=await readFile('public/images/rebirth/supplemental/'+id+'.webp');
  if(raw.length<4000||raw.length>32000||
     raw.toString('ascii',0,4)!=='RIFF'||raw.toString('ascii',8,12)!=='WEBP')
    throw Error('Supplemental '+id+' not a valid compact local WebP');
  const fingerprint=raw.toString('base64');
  if(supplementalSHA.has(fingerprint))throw Error('Reused supplemental SKU photo binary for '+id);
  supplementalSHA.add(fingerprint);
}
const supplementalSource=await readFile('lib/rebirth/supplemental-menu-media.ts','utf8');
for(const id of supplements)if(!supplementalSource.includes("'"+id+"'"))
  throw Error('Supplemental photo exists but has no explicit SKU mapping '+id);
console.log('SUPPLEMENTAL MENU ART: 20 unique SKU-keyed local WebPs; original 100 owner studies untouched; all conceptual.');
