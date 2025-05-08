import { NextResponse } from 'next/server';
import { createClient } from '@vercel/kv';

export async function GET() {
  try {
    // Check environment variables
    const hasKVUrl = typeof process.env.VERCEL_KV_URL === 'string';
    const hasKVToken = typeof process.env.VERCEL_KV_REST_TOKEN === 'string';
    
    // Safe environment variable info (don't expose actual values)
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL: process.env.VERCEL || 'not set',
      VERCEL_KV_URL: hasKVUrl ? 'set' : 'not set',
      VERCEL_KV_REST_TOKEN: hasKVToken ? 'set' : 'not set'
    };
    
    // Check if KV can be initialized
    let kvStatus = 'not initialized';
    let kvTestResult = false;
    
    if (hasKVUrl && hasKVToken) {
      try {
        const kv = createClient();
        
        // Try a test operation
        await kv.set('debug-test', { timestamp: new Date().toISOString() });
        const testValue = await kv.get('debug-test');
        
        kvStatus = 'initialized and working';
        kvTestResult = Boolean(testValue);
      } catch (kvError: any) {
        kvStatus = `failed to initialize: ${kvError.message || 'unknown error'}`;
      }
    }
    
    // Return debug info
    return NextResponse.json({
      environment: envInfo,
      kv: {
        status: kvStatus,
        testResult: kvTestResult
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Debug information collection failed',
      message: error.message || 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 