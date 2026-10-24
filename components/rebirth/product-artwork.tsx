'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { MenuItem } from '@/types/menu';
import { MaterialGlyph, categoryMaterialGlyph } from '@/components/rebirth/material-glyph';
import { getVerifiedMenuPhoto } from '@/lib/rebirth/verified-menu-photographs';
import { getRepresentativeMenuPhoto } from '@/lib/rebirth/representative-menu-photos';
import { GENERATED_MEDIA_READY, getGeneratedMenuPhoto } from '@/lib/rebirth/generated-menu-media';

/**
 * The 113 original menu entries deserve individually composed identities,
 * but the provided 12 real 640px restaurant photos have no verified SKU match.
 *
 * The unverified path is explicitly GRAPHIC ART, not a picture of the meal.
 * It has one original composition for every stable item ID (repeatable hash),
 * category-specific forms, custom printed-label system and purposeful motion.
 *
 * The verified path only renders an approved exact SKU photo in local assets.
 * No fabricated ingredients or generic-family-photo masquerading as verified dishes.
 */
type Props = { item: Pick<MenuItem,'id'|'name'|'categorySlug'>; size?: 'compact'|'large'; className?:string; visualMode?:'art'|'representative' };
function stableHash(text:string):number{
  let value=2166136261;
  for(let i=0;i<text.length;i++){
    value^=text.charCodeAt(i);
    value=Math.imul(value,16777619);
  }
  return value>>>0;
}
export function ProductArtwork({item,size='compact',className='',visualMode='art'}:Props){
  const [failedUrl,setFailedUrl]=useState<string|null>(null);
  const photo=getVerifiedMenuPhoto(item.id);
  const generated=visualMode==='representative'&&!photo?getGeneratedMenuPhoto(item.id,item.name,item.categorySlug):null;
  // Once the committed 100-image archive is active, unmatched SKUs get branded
  // graphic art instead of inaccurate remote stock food photos.
  const representative=visualMode==='representative'&&!photo&&!generated&&!GENERATED_MEDIA_READY
    ?getRepresentativeMenuPhoto(item.id,item.categorySlug,item.name):null;
  useEffect(()=>{setFailedUrl(null)},[item.id,representative?.src,generated?.src]);
  if(photo) return <div className={`t-product-art t-product-art--photo t-product-art--${size} ${className}`}>
    <Image src={photo.imagePath} alt={photo.altAr} fill sizes={size==='compact'?'(max-width:720px) 84px, 116px':'(max-width:720px) 160px, 230px'} />
    <span className="t-product-art__photo-note" aria-hidden="true">TUSCANINI / DISH</span>
  </div>;
  if(generated&&generated.src!==failedUrl){
    return <div className={`t-product-art t-product-art--representative t-product-art--generated t-product-art--${size} ${className}`}
      data-kind="generated-illustrative" data-product-id={item.id} data-source-photo-id={generated.assetId}
      role="img" aria-label={`صورة توضيحية لـ${item.name}`}>
      <Image src={generated.src} alt={generated.altAr} fill unoptimized
        sizes={size==='compact'?'(max-width:720px) 160px, 280px':'(max-width:720px) 160px, 230px'}
        onError={()=>setFailedUrl(generated.src)} />
    </div>;
  }
  if(representative&&representative.src!==failedUrl){
    return <div className={`t-product-art t-product-art--representative t-product-art--${size} ${className}`}
      data-kind="representative-stock" data-product-id={item.id}
      data-source-photo-id={representative.photoId}
      role="img" aria-label={`صورة توضيحية لـ${item.name}`}>
      <Image src={representative.src} alt={representative.altAr} fill unoptimized
        sizes={size==='compact'?'(max-width:720px) 82px, 100px':'(max-width:720px) 118px, 192px'}
        onError={()=>setFailedUrl(representative.src)} />
    </div>;
  }
  const hash=stableHash(item.categorySlug+'/'+item.id);
  const variant=hash%6;
  const rotation=(hash%17)-8;
  const serial=(hash%899)+100;
  const accent=['#d92e24','#171511','#a73529','#755442','#994a1c','#6d2521'][variant];
  const style={
    '--t-art-rotation':`${rotation}deg`,
    '--t-art-ink':accent,
    '--t-art-shift':`${hash%22}%`,
    '--t-art-fold-one':`${(hash%43)-21}deg`,
    '--t-art-fold-two':`${((hash>>>6)%63)-31}deg`,
    '--t-art-translate':`${((hash>>>11)%17)-8}px`,
  } as CSSProperties;
  return <div className={`t-product-art t-product-art--drawn t-product-art--${size} t-product-art--variant-${variant} ${className}`}
    style={style} data-kind="original-graphic" data-product-id={item.id}
    role="img" aria-label={`رسم فني لـ${item.name}`}>
    <span className="t-product-art__registration" aria-hidden="true">T. / {serial}</span>
    <div className="t-product-art__field" aria-hidden="true">
      <span className="t-product-art__fold t-product-art__fold--one"/>
      <span className="t-product-art__fold t-product-art__fold--two"/>
      <MaterialGlyph name={categoryMaterialGlyph(item.categorySlug)} size={size==='large'?108:64}
        className="t-product-art__glyph" />
    </div>
    <span className="t-product-art__item-name" aria-hidden="true">{item.name}</span>
    <span className="t-product-art__serial" aria-hidden="true" dir="ltr">{item.id.toUpperCase()}</span>
  </div>;
}
