import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';

/** Explicit development-only bridge, never enabled in a production build. */
export function getLocalStudioOrigin(): string | null {
  if (process.env.NODE_ENV !== 'development' || process.env.TUSCANINI_STUDIO_ENABLED !== 'yes') return null;
  const raw=process.env.TUSCANINI_STUDIO_ORIGIN;
  if(!raw || !/^http:\/\/127\.0\.0\.1:[0-9]{2,5}$/.test(raw))return null;
  const port=Number(raw.slice(raw.lastIndexOf(':')+1));
  if(port<1024||port>65535)return null;
  if(!process.env.TUSCANINI_STUDIO_BRIDGE_TOKEN || process.env.TUSCANINI_STUDIO_BRIDGE_TOKEN.length<24)return null;
  if(!process.env.TUSCANINI_STUDIO_OPERATOR_KEY || process.env.TUSCANINI_STUDIO_OPERATOR_KEY.length<24)return null;
  return raw;
}

export function isLocalStudioRequest(request: Request): boolean {
  if(!getLocalStudioOrigin())return false;
  const hostname=new URL(request.url).hostname;
  return hostname==='localhost'||hostname==='127.0.0.1';
}

export function studioOperatorAllowed(request: Request): boolean {
  const expected=process.env.TUSCANINI_STUDIO_OPERATOR_KEY ?? '';
  const actual=request.headers.get('x-studio-operator-key') ?? '';
  if(!expected || !actual)return false;
  return timingSafeEqual(createHash('sha256').update(expected).digest(),createHash('sha256').update(actual).digest());
}

export type StudioOrder = {
  id:string;status:string;created_at:string;subtotal_cents:string;
  items:Array<{sku:string;name:string;qty:number;price_cents:number}>;
};

export type StudioEvent = {id:string;status:string;created_at:string;action:string;actor_role:string};
