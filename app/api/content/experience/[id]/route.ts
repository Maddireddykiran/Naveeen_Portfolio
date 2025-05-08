import { NextRequest, NextResponse } from 'next/server';
import { getExperiences, updateExperience } from '@/services/content-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const experiences = getExperiences();
    const experience = experiences.find(exp => exp.id === id);

    if (!experience) {
      return NextResponse.json(
        { error: `Experience with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updatedExperience = await request.json();

    // Ensure ID in the URL matches the one in the request body
    if (updatedExperience.id !== id) {
      return NextResponse.json(
        { error: 'Experience ID in the URL does not match the request body' },
        { status: 400 }
      );
    }

    updateExperience(id, updatedExperience);
    return NextResponse.json({ message: 'Experience updated successfully' });
  } catch (error) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    );
  }
} 