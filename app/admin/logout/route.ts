import { NextResponse } from 'next/server';

import { ADMIN_ACCESS_COOKIE_NAME, getAdminSessionCookieConfig } from '@/lib/admin/admin-auth';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url));

  response.cookies.set({
    name: ADMIN_ACCESS_COOKIE_NAME,
    value: '',
    ...getAdminSessionCookieConfig(),
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
