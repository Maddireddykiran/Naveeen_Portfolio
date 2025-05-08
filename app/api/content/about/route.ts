import { NextResponse } from 'next/server';
import { getAbout, updateAbout } from '@/lib/content-service';

export async function GET() {
  try {
    const about = await getAbout();
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const about = await request.json();
    await updateAbout(about);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating about data:', error);
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    );
  }
} 