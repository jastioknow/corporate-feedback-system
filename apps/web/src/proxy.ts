import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_ROUTES } from './shared/config/api';
import { tokenService } from './shared/lib/auth/token';

const PROTECTED_ROUTES = Object.values(APP_ROUTES.USER);
const AUTH_ROUTES = Object.values(APP_ROUTES.AUTH);

export function proxy(request: NextRequest) {
  const token = tokenService.getAccessToken();
  const { pathname } = request.nextUrl;

  if (token && (AUTH_ROUTES as readonly string[]).includes(pathname)) {
    return NextResponse.redirect(new URL(APP_ROUTES.USER.PROFILE, request.url));
  }

  if (!token && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(APP_ROUTES.AUTH.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|\\.well-known|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|css|js|woff2?|ttf|otf|csv|json)$).*)',
  ],
};
