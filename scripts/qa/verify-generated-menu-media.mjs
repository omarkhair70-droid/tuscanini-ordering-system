import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Fail closed: activating AI generated media WITHOUT shipping all 100 actual
// optimized local assets creates broken product cards. An inactive branch
// still builds using the previous explicit illustrative-stock fallback.
const enabled=process.env.NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES==='ready';
const folder='public/images/rebirth/generated';
const ids=Array.from({length:100},(_,i)=>
  'b'+String(1+Math.floor(i/10)).padStart(2,'0')+'-'+String(i%10+1).padStart(2,'0'));
if(!enabled){
  console.log('GENERATED-IMAGE GATE: source mapping ready; awaiting 100 optimized binaries. NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES is not ready; original stock/art fallback remains active.');
  process.exit(0);
}
if(!existsSync(folder))throw Error('GENERATED-IMAGE GATE: 100 asset images not committed. Set NEXT_PUBLIC_REBIRTH_GENERATED_IMAGES=ready only AFTER adding the archive.');
let count=0,bytes=0;
for(const id of ids){
  const file=join(folder,id+'.webp');
  if(!existsSync(file))throw Error('GENERATED-IMAGE GATE: missing '+file);
  const b=readFileSync(file);
  if(b.length<20000||b.subarray(0,4).toString()!=='RIFF'||b.subarray(8,12).toString()!=='WEBP')
    throw Error('GENERATED-IMAGE GATE: invalid image bytes for '+file);
  count++;bytes+=b.length;
}
const actual=readdirSync(folder).filter(f=>f.endsWith('.webp'));
if(actual.length!==100||count!==100)throw Error('GENERATED-IMAGE GATE: expected exact 100 WebP files, got '+actual.length);
console.log('GENERATED-IMAGE GATE: '+count+'/100 real WebP files present ('+(bytes/1024/1024).toFixed(2)+' MiB), source is explicitly generated-illustrative.');
