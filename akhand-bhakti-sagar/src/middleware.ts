import { NextRequest, NextResponse } from 'next/server';

// Routes that are publicly accessible under /admin
const PUBLIC_ADMIN_ROUTES = ['/admin/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to /admin/* routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow public admin routes (login page)
  if (PUBLIC_ADMIN_ROUTES.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('abs_session');

  if (!sessionCookie || !sessionCookie.value) {
    // No session — redirect to login with the intended URL as a redirect param
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Session cookie exists — let the request through.
  // The actual session validity is verified server-side in each route/layout.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all /admin routes except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/admin/:path*',
  ],
};
