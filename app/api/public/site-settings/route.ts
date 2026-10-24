import { NextResponse } from 'next/server';

import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';
import { isLocalStudioRequest } from '@/lib/studio-bridge';

// Restaurant open/closed state must never be stuck in a CDN/browser cache.
export const dynamic = 'force-dynamic';
const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0', 'CDN-Cache-Control': 'no-store' };
export async function GET(request: Request) {
  if(isLocalStudioRequest(request))return NextResponse.json({ok:true,settings:{isOrderingOpen:true,deliveryEnabled:true,whatsappOrderNumber:'',studioMode:true}},{headers:noStoreHeaders});
  const settings = await getRuntimePublicSiteSettings();

  return NextResponse.json({
    ok: true,
    settings,
  }, {headers:noStoreHeaders});
}
