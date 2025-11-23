import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protected routes
  const isAdminRoute = path.startsWith('/admin');
  const isDashboardRoute = path.startsWith('/dashboard');

  if (isAdminRoute || isDashboardRoute) {
    // Check for session cookie (production uses __Secure- prefix)
    // better-auth can use session_token or session_data cookies
    const sessionToken =
      request.cookies.get('__Secure-better-auth.session_token') ||
      request.cookies.get('better-auth.session_token');

    const sessionData =
      request.cookies.get('__Secure-better-auth.session_data') ||
      request.cookies.get('better-auth.session_data');

    // Log for debugging (remove in production)
    console.log('Checking auth for:', path);
    console.log('Session token:', !!sessionToken);
    console.log('Session data:', !!sessionData);
    console.log('All cookies:', request.cookies.getAll().map(c => c.name));

    if (!sessionToken && !sessionData) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
