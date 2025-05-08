import { NextResponse } from 'next/server';
import { getProjects, updateProjects } from '@/lib/content-service';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects data' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const projects = await request.json();
    await updateProjects(projects);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating projects data:', error);
    return NextResponse.json(
      { error: 'Failed to update projects data' },
      { status: 500 }
    );
  }
} 