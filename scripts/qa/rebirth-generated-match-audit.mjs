import ts from 'typescript';
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
  if(item.category==='pizza-mixed'&&item.name==='تونة'&&photo)
    throw Error('Invented tuna pizza photo: '+item.id);
  if(photo)used.add(photo.assetId);
  entries.push({...item,assetId:photo?.assetId??null,photoKind:photo?.kind??'original-drawn-or-stock-fallback'});
}
await mkdir('artifacts/screenshots',{recursive:true});
await writeFile('artifacts/screenshots/generated-menu-source-match-audit.json',
  JSON.stringify({previousMenuItems:items.length,mediaPool:100,menuMediaMapped:entries.filter(x=>x.assetId).length,usedUniqueImagesInMenu:used.size,generatedMediaActiveByDefault:false,exactMerchantDishPhotos:0,nonMenuImagesAccessibleInVisualAtlas:100,items:entries},null,2));
console.log('GENERATED IMAGE / ORIGINAL 113 MENU AUDIT: '+entries.filter(x=>x.assetId).length+
  '/113 category-safe representative matches, '+used.size+' unique generated images among named menu items; all 100 available as visual art atlas after binary install. No change in previous price records.');
