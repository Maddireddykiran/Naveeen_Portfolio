import { NextRequest, NextResponse } from 'next/server';
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
    const footer = await getContentSection('footer');
    return NextResponse.json(footer, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error fetching footer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedFooter = await request.json();
    await updateContent('footer', updatedFooter);
    return NextResponse.json(
      { message: 'Footer updated successfully' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error updating footer:', error);
    return NextResponse.json(
      { error: 'Failed to update footer' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
} 