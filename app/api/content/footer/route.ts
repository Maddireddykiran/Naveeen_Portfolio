import { NextRequest, NextResponse } from 'next/server';
import { getFooter, updateFooter } from '@/services/content-service';

export async function GET() {
  try {
    const footer = getFooter();
    return NextResponse.json(footer);
  } catch (error) {
    console.error('Error fetching footer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedFooter = await request.json();
    updateFooter(updatedFooter);
    return NextResponse.json({ message: 'Footer updated successfully' });
  } catch (error) {
    console.error('Error updating footer:', error);
    return NextResponse.json(
      { error: 'Failed to update footer' },
      { status: 500 }
    );
  }
} 