import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In a real app, you would store this securely and use environment variables
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Get hostname to determine the domain for cookie
      const requestUrl = request.url || '';
      const hostname = new URL(requestUrl).hostname;
      
      // Determine if we should use secure cookies based on hostname or environment
      const isSecure = process.env.NODE_ENV === 'production' || 
                       hostname !== 'localhost';
      
      // Create session (in a real app, use a proper JWT or session token)
      const cookieStore = cookies();
      cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: isSecure,
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
        sameSite: 'lax' // Changed from 'strict' to work better across redirects
      });

      // Set no-cache headers
      const headers = {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      };

      return NextResponse.json({ success: true }, { headers });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 