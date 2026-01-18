import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './src/lib/auth-utils';

// Define protected routes and their allowed roles
const protectedRoutes = {
  '/admin': ['ADMIN'],
  '/merchant': ['MERCHANT'],
  '/driver': ['DRIVER'],
  '/operations': ['OPERATIONS'],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Check if path is protected
  const isProtected = Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Check role permissions
  const userRole = decoded.role;
  const allowedRoute = Object.entries(protectedRoutes).find(([route]) =>
    pathname.startsWith(route)
  );

  if (allowedRoute && !allowedRoute[1].includes(userRole)) {
    const redirectUrl = new URL(`/${userRole.toLowerCase()}/dashboard`, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/merchant/:path*',
    '/driver/:path*',
    '/operations/:path*',
    '/dashboard/:path*',
  ],
};