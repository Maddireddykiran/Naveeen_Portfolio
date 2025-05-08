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
    
    // Better cookie validation logic
    const isValidSession = adminSession && adminSession.value === 'true';
    
    // Enhanced logging for debugging in production
    if (!isValidSession) {
      console.log(`Access denied to ${path}. No valid session found.`);
    }
    
    // If no session cookie or it's not valid, redirect to login
    if (!isValidSession) {
      // Special handling for API routes in production - Return 401 instead of redirect
      if ((isApiContentPath || isApiUploadPath) && process.env.NODE_ENV === 'production') {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { 'content-type': 'application/json' }
          }
        );
      }
      
      // For normal web routes, redirect to login
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