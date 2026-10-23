import { NextResponse } from 'next/server';

import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';
import { isLocalStudioRequest } from '@/lib/studio-bridge';

export async function GET(request: Request) {
  if(isLocalStudioRequest(request))return NextResponse.json({ok:true,settings:{isOrderingOpen:true,deliveryEnabled:true,whatsappOrderNumber:'',studioMode:true}});
  const settings = await getRuntimePublicSiteSettings();

  return NextResponse.json({
    ok: true,
    settings,
  });
}
