import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');

  // Set no-cache headers to prevent caching of this response
  const headers = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  };

  if (session && session.value === 'true') {
    return NextResponse.json({ authenticated: true }, { headers });
  } else {
    return NextResponse.json({ authenticated: false }, { 
      status: 401,
      headers
    });
  }
} 