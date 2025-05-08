import { NextResponse } from 'next/server';
import { getContentSection, updateContent } from '@/lib/vercel-kv-service';

export async function GET() {
  try {
    const testimonials = await getContentSection('testimonials');
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const testimonials = await request.json();
    await updateContent('testimonials', testimonials);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating testimonials data:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonials data' },
      { status: 500 }
    );
  }
} 