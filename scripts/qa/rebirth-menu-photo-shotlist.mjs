import ts from 'typescript-compat';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Strict photo-by-named-menu-item admission gate.
 * A genuine restaurant "family" photo is never allowed to masquerade as
 * the exact named item. The original 113-item previous-price catalog and the
 * approved photo manifest are examined as SOURCE CODE using TypeScript AST,
 * not guessed filenames, OCR, or fuzzy visual similarity.
 */
const source = await readFile('lib/mock-data.ts','utf8');
const mediaSource=await readFile('lib/rebirth/verified-menu-photographs.ts','utf8');
function locateArray(file,variable) {
  const sf=ts.createSourceFile(variable+'.ts',file,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  let arr=null;
  function visit(node) {
    if(ts.isVariableDeclaration(node) && node.name.getText(sf)===variable &&
      node.initializer && ts.isArrayLiteralExpression(node.initializer))arr=node.initializer;
    ts.forEachChild(node,visit);
  }
  visit(sf);
  if(!arr)throw new Error('Cannot find existing '+variable+' array');
  return {arr,sf};
}
function textField(obj,key,sf){
  if(!ts.isObjectLiteralExpression(obj))return null;
  const prop=obj.properties.find(p=>ts.isPropertyAssignment(p) &&
    (p.name.getText(sf).replace(/['"]/g,'')===key));
  if(!prop)return null;
  const v=prop.initializer;
  if(ts.isStringLiteral(v)||ts.isNoSubstitutionTemplateLiteral(v))return v.text;
  if(ts.isNumericLiteral(v))return Number(v.text);
  return null;
}
const {arr,sf}=locateArray(source,'featuredItems');
const items=arr.elements.map(n=>({
  id:textField(n,'id',sf),
  name:textField(n,'name',sf),
  categorySlug:textField(n,'categorySlug',sf),
  priceFrom:textField(n,'priceFrom',sf)
}));
if(items.length!==113||new Set(items.map(x=>x.id)).size!==113||
  items.some(x=>typeof x.id!=='string'||typeof x.name!=='string'||
    typeof x.categorySlug!=='string'||!Number.isFinite(x.priceFrom))){
  throw new Error('Original 113 previous-price item records are missing, duplicated or malformed');
}
const sfm=ts.createSourceFile('verified.ts',mediaSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
let manifest;
function visit(node){
  if(ts.isVariableDeclaration(node)&&node.name.getText(sfm)==='verifiedMenuPhotos')manifest=node.initializer;
  ts.forEachChild(node,visit);
}
visit(sfm);
if(!manifest||!ts.isObjectLiteralExpression(manifest))
  throw new Error('Explicit SKU media manifest missing');
const accepted=new Map();
for(const field of manifest.properties){
  if(!ts.isPropertyAssignment(field)||!ts.isObjectLiteralExpression(field.initializer))
    throw Error('Bad photo mapping: static string product IDs and literal review details are required');
  const id=field.name.getText(sfm).replace(/['"]/g,'');
  const verifiedBy=textField(field.initializer,'verifiedBy',sfm);
  const sourceRef=textField(field.initializer,'source',sfm);
  const path=textField(field.initializer,'imagePath',sfm);
  const itemRef=textField(field.initializer,'productId',sfm);
  const altAr=textField(field.initializer,'altAr',sfm);
  if(!items.some(x=>x.id===id)||id!==itemRef||
    !verifiedBy||!sourceRef||!altAr||
    typeof path!=='string'||!path.startsWith('/images/menu/products/')||!['.jpg','.jpeg','.png','.webp','.avif'].some(ext=>path.toLowerCase().endsWith(ext))){
    throw new Error('Invalid or unproven exact product photograph metadata for '+id);
  }
  const physical=resolve('public',path.slice(1));
  if(!existsSync(physical))throw Error('Approved SKU photo not committed: '+physical);
  accepted.set(id,{imagePath:path,verifiedBy,source:sourceRef});
}
await mkdir('artifacts/screenshots',{recursive:true});
const request={
  generatedFrom:'lib/mock-data.ts + lib/rebirth/verified-menu-photographs.ts',
  originalMenuItems:items.length,
  exactDishPhotographsVerified:accepted.size,
  remainingActualDishPhotographs:items.length-accepted.size,
  warning:'The 12 authentic TSC restaurant photographs are family/context evidence and are NOT verified photos of named products. The new graphics are conceptual artworks, not exact photographed meals.',
  request:items.map(item=>({
    ...item,
    status:accepted.has(item.id)?'exact-photo-approved':'NEEDS_REAL_PHOTOGRAPH_OF_NAMED_MENU_ITEM',
    verified:accepted.get(item.id)??null,
    suggestedLocalFilename:'public/images/menu/products/'+item.id+'.jpg',
  })),
};
await writeFile('artifacts/screenshots/menu-exact-photo-production-list.json',JSON.stringify(request,null,2));
console.log('PHOTO-TRUTH GATE: '+accepted.size+'/'+items.length+
  ' exact real named-menu-item photographs approved; '+(items.length-accepted.size)+
  ' honest illustrated prints remain until owner source images arrive.');
