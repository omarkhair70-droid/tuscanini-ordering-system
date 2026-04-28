import { NextResponse, type NextRequest } from 'next/server';

import {
  ADMIN_ACCESS_COOKIE_NAME,
  getSafeAdminNextPath,
  isAdminSessionTokenValid,
  isProtectedAdminPath,
} from '@/lib/admin/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/admin/login' || pathname.startsWith('/admin/logout')) {
    return NextResponse.next();
  }

  if (!isProtectedAdminPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_ACCESS_COOKIE_NAME)?.value;
  const isValid = await isAdminSessionTokenValid(token);

  if (isValid) {
    return NextResponse.next();
  }

  const nextPath = getSafeAdminNextPath(`${pathname}${search}`);
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/admin/login';
  loginUrl.searchParams.set('next', nextPath);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*'],
};
