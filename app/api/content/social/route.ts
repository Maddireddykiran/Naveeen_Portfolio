import { NextResponse } from 'next/server';
import { getSocialMedia, updateSocialMedia } from '@/services/content-service';

export async function GET() {
  try {
    const socialMedia = await getSocialMedia();
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const socialMedia = await request.json();
    await updateSocialMedia(socialMedia);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating social media data:', error);
    return NextResponse.json(
      { error: 'Failed to update social media data' },
      { status: 500 }
    );
  }
} 