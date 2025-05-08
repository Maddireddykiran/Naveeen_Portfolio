import { NextResponse } from 'next/server';
import { getContentSection, updateContent } from '@/lib/vercel-kv-service';

export async function GET() {
  try {
    const hero = await getContentSection('hero');
    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching hero data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const hero = await request.json();
    await updateContent('hero', hero);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hero data:', error);
    return NextResponse.json(
      { error: 'Failed to update hero data' },
      { status: 500 }
    );
  }
} 