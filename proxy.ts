import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and Next.js internals
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;

  // Authenticated user on public page → redirect to dashboard
  if (publicPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/projects', request.url));
  }

  // Unauthenticated user on protected page → redirect to login
  if (!publicPaths.includes(pathname) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
