import { NextResponse } from 'next/server';

import { getRuntimePublicSiteSettings } from '@/lib/site-settings-runtime';

export async function GET() {
  const settings = await getRuntimePublicSiteSettings();

  return NextResponse.json({
    ok: true,
    settings,
  });
}
