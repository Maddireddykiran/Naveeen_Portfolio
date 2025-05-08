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
    const testimonials = await getContentSection('testimonials');
    return NextResponse.json(testimonials, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error fetching testimonials data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials data' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const testimonials = await request.json();
    await updateContent('testimonials', testimonials);
    return NextResponse.json({ success: true }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error updating testimonials data:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonials data' },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
} 