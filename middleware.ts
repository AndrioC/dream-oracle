import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const LOCALES = ['pt', 'en'];

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: 'en',
  localeDetection: true,
});

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoginPage = request.nextUrl.pathname.endsWith('/login');
  const isDreamsPage = request.nextUrl.pathname.includes('/dreams');
  const isFeedPage = request.nextUrl.pathname.includes('/feed');
  const isSettingsPage = request.nextUrl.pathname.includes('/settings');
  const isRootPage = request.nextUrl.pathname === '/';

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/feed', request.url));
  }

  if (isDreamsPage || isFeedPage || isSettingsPage) {
    if (!token) {
      const locale = getLocale(request);
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
    return NextResponse.next();
  }

  if (isRootPage) {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  const response = intlMiddleware(request);

  return response;
}

function getLocale(request: NextRequest): string {
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && LOCALES.includes(localeCookie)) {
    return localeCookie;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const detectedLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase();
    if (LOCALES.includes(detectedLocale)) {
      return detectedLocale;
    }
  }

  return LOCALES[0];
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image).*)'],
};
