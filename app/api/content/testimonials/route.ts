import { NextResponse } from 'next/server';
import { getTestimonials, updateTestimonials } from '@/lib/content-service';

export async function GET() {
  try {
    const testimonials = await getTestimonials();
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
    await updateTestimonials(testimonials);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating testimonials data:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonials data' },
      { status: 500 }
    );
  }
} 