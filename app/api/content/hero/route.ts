import { NextResponse } from 'next/server';
import { getHero, updateHero } from '@/lib/content-service';

export async function GET() {
  try {
    const hero = await getHero();
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
    await updateHero(hero);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hero data:', error);
    return NextResponse.json(
      { error: 'Failed to update hero data' },
      { status: 500 }
    );
  }
} 