import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protected routes
  const isAdminRoute = path.startsWith('/admin');
  const isDashboardRoute = path.startsWith('/dashboard');

  if (isAdminRoute || isDashboardRoute) {
    // Check for session cookie (production uses __Secure- prefix)
    const sessionCookie =
      request.cookies.get('__Secure-better-auth.session_token') ||
      request.cookies.get('better-auth.session_token');

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
