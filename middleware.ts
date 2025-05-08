import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  
  // Check if the path is an admin path that needs protection
  const isAdminPath = path.startsWith('/admin') && !path.startsWith('/admin/login');
  const isApiAuthPath = path.startsWith('/api/auth') && !path.startsWith('/api/auth/login');
  
  // Only protect content API for non-GET requests (POST, PUT, DELETE)
  const isApiContentPath = path.startsWith('/api/content') && method !== 'GET';
  const isApiUploadPath = path.startsWith('/api/upload');

  // Check if any of the paths need protection
  if (isAdminPath || isApiAuthPath || isApiContentPath || isApiUploadPath) {
    const adminSession = request.cookies.get('admin_session');
    
    // If no session cookie or it's not valid, redirect to login
    if (!adminSession || adminSession.value !== 'true') {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/auth/:path*',
    '/api/content/:path*',
    '/api/upload/:path*',
  ],
}; 