import { NextRequest, NextResponse } from 'next/server';
import { getApproach, updateApproach } from '@/services/content-service';

export async function GET() {
  try {
    const approaches = getApproach();
    return NextResponse.json(approaches);
  } catch (error) {
    console.error('Error fetching approaches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approaches' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const approaches = await request.json();
    
    // Update each approach phase
    approaches.forEach((approach: any, index: number) => {
      updateApproach(index, approach);
    });
    
    return NextResponse.json({ message: 'Approaches updated successfully' });
  } catch (error) {
    console.error('Error updating approaches:', error);
    return NextResponse.json(
      { error: 'Failed to update approaches' },
      { status: 500 }
    );
  }
} 