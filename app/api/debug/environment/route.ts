import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { corsHeaders } from '@/app/api/cors-middleware';

// For testing KV connection if available
let kvClient: any = null;
try {
  if (process.env.VERCEL_KV_URL && process.env.VERCEL_KV_REST_TOKEN) {
    const { createClient } = require('@vercel/kv');
    kvClient = createClient();
  }
} catch (error) {
  console.error('Failed to initialize KV client for debug endpoint:', error);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    // Get environment information
    const env = {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      VERCEL: process.env.VERCEL || 'not set',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      VERCEL_KV_URL: process.env.VERCEL_KV_URL ? 'set' : 'not set',
      VERCEL_KV_REST_TOKEN: process.env.VERCEL_KV_REST_TOKEN ? 'set' : 'not set',
    };

    // Check for public directory
    const publicDir = path.join(process.cwd(), 'public');
    const publicExists = fs.existsSync(publicDir);
    
    // Check for profile.jpg
    const profilePath = path.join(publicDir, 'profile.jpg');
    const profileExists = fs.existsSync(profilePath);
    
    // Check for Profile.jpg (case sensitive)
    const profileCasePath = path.join(publicDir, 'Profile.jpg');
    const profileCaseExists = fs.existsSync(profileCasePath);
    
    // Check data directory and content.json
    const dataDir = path.join(process.cwd(), 'data');
    const dataExists = fs.existsSync(dataDir);
    const contentPath = path.join(dataDir, 'content.json');
    const contentExists = fs.existsSync(contentPath);
    
    // Test KV connection if available
    let kvStatus = 'not configured';
    let kvTest = null;
    
    if (kvClient) {
      try {
        // Test write to KV
        await kvClient.set('environment-test', { timestamp: new Date().toISOString() });
        
        // Test read from KV
        kvTest = await kvClient.get('environment-test');
        
        kvStatus = 'connected';
      } catch (kvError: any) {
        kvStatus = `error: ${kvError.message || 'unknown error'}`;
      }
    }

    // Get current directory structure
    const dirInfo = fs.readdirSync(process.cwd(), { withFileTypes: true }).map(dirent => ({
      name: dirent.name,
      isDirectory: dirent.isDirectory()
    }));
    
    // Check content.json for profile image references
    let contentImagePaths = [];
    if (contentExists) {
      try {
        const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
        contentImagePaths = [
          contentData.hero?.image,
          contentData.about?.profileImage
        ].filter(Boolean);
      } catch (e: any) {
        contentImagePaths = [`Error reading content.json: ${e.message}`];
      }
    }
    
    return NextResponse.json({
      environment: env,
      filesystem: {
        cwd: process.cwd(),
        publicDirExists: publicExists,
        profileJpgExists: profileExists,
        profileJpgCaseSensitiveExists: profileCaseExists,
        dataDirExists: dataExists,
        contentJsonExists: contentExists,
        contentImagePaths,
        dirStructure: dirInfo
      },
      kv: {
        status: kvStatus,
        test: kvTest
      },
      timestamp: new Date().toISOString()
    }, {
      headers: corsHeaders
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Error collecting environment debug information',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
} 