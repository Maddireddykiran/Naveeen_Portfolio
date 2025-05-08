import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const method = request.method;
  
  // Handle CORS preflight requests
  if (method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
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
      if ((isApiContentPath || isApiUploadPath)) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401,
            headers: { 
              'content-type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
          }
        );
      }
      
      // For normal web routes, redirect to login
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('redirect', path);
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to continue
  const response = NextResponse.next();
  
  // Add CORS headers to all responses
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

// Configure the paths that should be matched by this middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}; 