import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const LOCALES = ['pt', 'en'];
const DEFAULT_LOCALE = 'pt';

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
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
    // Não aplicar o middleware de internacionalização para essas rotas
    if (!token) {
      // Se não estiver autenticado, redirecionar para a página de login
      return NextResponse.redirect(
        new URL(`/${DEFAULT_LOCALE}/login`, request.url)
      );
    }
    return NextResponse.next();
  }

  // Redirecionar a rota raiz para a rota com o DEFAULT_LOCALE
  if (isRootPage) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url));
  }

  const response = intlMiddleware(request);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
