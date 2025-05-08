import { NextResponse } from 'next/server';
import { getContentSection, updateContent } from '@/lib/vercel-kv-service';
import { corsHeaders } from '@/app/api/cors-middleware';

// Allow CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const projects = await getContentSection('projects');
    return NextResponse.json(projects, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error fetching projects data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects data' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const projects = await request.json();
    await updateContent('projects', projects);
    return NextResponse.json({ success: true }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error updating projects data:', error);
    return NextResponse.json(
      { error: 'Failed to update projects data' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
} 