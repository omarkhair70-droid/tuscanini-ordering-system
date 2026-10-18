import type { SVGProps } from 'react';
import type { MenuCategorySlug } from '@/types/menu';

/**
 * Experimental MATERIAL GLYPHS for the Tuscanini creative rebuild.
 * Abstract line drawings from the observed grammar of folded takeaway paper,
 * food cross-sections and pizza boxes in the 12 real restaurant photographs.
 * Not copies of official brand marks, wrappers or a claim about ingredients.
 *
 * Non-photographic, decorative SVG language; no emoji glyph substitutes,
 * remote icon font, GSAP or icon package needed.
 */
export type MaterialGlyphName =
  | 'fold' | 'cut' | 'box' | 'hand' | 'place'
  | 'crepe' | 'pizza' | 'sandwich' | 'pasta'
  | 'sweet' | 'drink' | 'sides' | 'all'
  | 'menu' | 'offer' | 'story' | 'cart' | 'feedback' | 'help';

type Props = {
  name: MaterialGlyphName;
  size?: number;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox' | 'aria-hidden'>;

function Drawing({ name }: {name: MaterialGlyphName}) {
  switch (name) {
    case 'fold':
    case 'crepe':
      return <><path d="M12 57 39 13l28 44H12Z"/><path d="m12 57 26-17 29 17M39 13l-1 27"/><path d="m23 49 9-11M51 44l8 7"/></>;
    case 'cut':
      return <><path d="M11 19h58v45H11z"/><path d="M11 38h58M40 19v45"/><path d="m19 49 12-9 10 12 11-12 10 10"/></>;
    case 'box':
      return <><path d="m11 31 29-14 29 14-29 15-29-15Z"/><path d="M11 31v24l29 14 29-14V31M40 46v23"/><path d="m20 27 29 15M60 26 31 42"/></>;
    case 'hand':
      return <><path d="M18 61c8-8 12-18 14-30 1-6 9-6 10 0l1 10 4-14c2-5 10-3 9 3l-3 18c3-2 7-3 10 1 2 3 0 6-4 9l-12 10H29Z"/><path d="M14 68h26M33 41l-3 10"/></>;
    case 'pizza':
      return <><path d="M39 11c-10 15-19 33-27 53l55-2C59 42 51 24 39 11Z"/><path d="M20 49c11 8 27 8 38 0M37 28l-1 1M44 42l-1 1"/></>;
    case 'sandwich':
      return <><path d="M13 37c0-19 12-27 27-27s27 8 27 27H13Z"/><path d="M13 42c6-7 13 6 21-1 9-7 15 7 25-1 4-3 7-1 8 2"/><path d="M16 53h48M19 62c9 6 33 8 42 0M13 42v7M67 42v7"/></>;
    case 'pasta':
      return <><path d="M13 41c9-26 44-28 55-3 7 16-9 31-24 27-16-4-24-19-14-30 8-8 21-6 25 3 3 8-3 16-11 14-7-1-10-8-5-12"/><path d="m16 52-5 11M24 27l-5-10"/></>;
    case 'sweet':
      return <><rect x="16" y="15" width="48" height="50" rx="5"/><path d="M16 31h48M16 48h48M32 15v50M48 15v50"/></>;
    case 'drink':
      return <><path d="M21 23h42l-7 43H29L21 23ZM15 17h54M45 17l5-12M34 33h17"/></>;
    case 'sides':
      return <><path d="M12 32h56l-8 32H20l-8-32ZM18 24h44M25 20l7-11M40 20V8M53 20l-7-11"/><path d="m25 43 6 11m10-11 5 11"/></>;
    case 'all':
      return <><path d="M40 8v64M8 40h64M18 18l44 44M62 18 18 62"/><circle cx="40" cy="40" r="13"/></>;
    case 'menu':
      return <><path d="M10 14c13-6 24-3 30 1 11-7 22-6 30-2v51c-12-4-22-5-30 3-9-7-20-7-30-3V14Z"/><path d="M40 15v52M18 26h13M18 35h13M49 26h13M49 35h13"/></>;
    case 'offer':
      return <><path d="M15 17h36l17 23-28 28-25-25V17Z"/><circle cx="26" cy="29" r="5"/><path d="m36 54 19-19"/></>;
    case 'story':
      return <><path d="M12 55V26l19-12 18 12v29l-18 12-19-12ZM49 26l17-9v30L49 55"/><path d="M23 37h16M23 46h13"/></>;
    case 'place':
      return <><path d="M40 70S17 45 17 30a23 23 0 1 1 46 0C63 45 40 70 40 70Z"/><circle cx="40" cy="30" r="8"/></>;
    case 'cart':
      return <><path d="M9 18h10l9 36h34l7-27H24"/><circle cx="33" cy="66" r="3"/><circle cx="58" cy="66" r="3"/><path d="M32 41h28"/></>;
    case 'feedback':
      return <><path d="M12 15h56v37H38L22 65V52H12V15Z"/><path d="M22 29h35M22 38h25"/></>;
    case 'help':
      return <><path d="M40 9 67 21v27L40 71 13 48V21L40 9Z"/><path d="M40 25v20M40 54h.01"/></>;
  }
}

export function MaterialGlyph({name,size=36,className,...props}:Props){
  return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 80 80"
    fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false" className={className} {...props}><Drawing name={name}/></svg>;
}

export function categoryMaterialGlyph(slug: MenuCategorySlug):MaterialGlyphName {
  if(slug.startsWith('crepe-'))return 'crepe';
  if(slug.startsWith('pizza-'))return 'pizza';
  if(slug.startsWith('sandwiches-'))return 'sandwich';
  if(slug==='pasta')return 'pasta';
  if(slug==='waffle')return 'sweet';
  if(slug==='drinks')return 'drink';
  if(slug==='appetizers')return 'sides';
  return 'all';
}

export function routeMaterialGlyph(path:string):MaterialGlyphName {
  switch(path){
    case '/':return 'fold';
    case '/menu':return 'menu';
    case '/offers':return 'offer';
    case '/food-finder':return 'cut';
    case '/about':return 'story';
    case '/contact':return 'place';
    case '/cart':return 'cart';
    case '/reviews':return 'feedback';
    case '/complaints':return 'help';
    default:return 'fold';
  }
}
