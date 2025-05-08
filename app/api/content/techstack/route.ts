import { NextRequest, NextResponse } from 'next/server';
import { getTechStack, updateTechStack } from '@/services/content-service';

export async function GET() {
  try {
    const techStack = getTechStack();
    return NextResponse.json(techStack);
  } catch (error) {
    console.error('Error fetching tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tech stack' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedTechStack = await request.json();
    updateTechStack(updatedTechStack);
    return NextResponse.json({ message: 'Tech stack updated successfully' });
  } catch (error) {
    console.error('Error updating tech stack:', error);
    return NextResponse.json(
      { error: 'Failed to update tech stack' },
      { status: 500 }
    );
  }
} 