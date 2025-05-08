import { NextRequest, NextResponse } from 'next/server';
import { getExperiences, addExperience } from '@/services/content-service';
import { Experience } from "@/services/content-service";

export async function GET(request: NextRequest) {
  try {
    const experiences = getExperiences();
    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'company', 'period', 'location', 'desc'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Create new experience object
    const newExperience: Experience = {
      id: body.id || 0, // Will be auto-generated if 0
      title: body.title,
      company: body.company,
      period: body.period,
      location: body.location,
      desc: body.desc,
      skills: body.skills || [],
      thumbnail: body.thumbnail || ""
    };
    
    addExperience(newExperience);
    
    return NextResponse.json({ 
      message: "Experience added successfully", 
      experience: newExperience 
    }, { status: 201 });
  } catch (error) {
    console.error("Error adding experience:", error);
    return NextResponse.json(
      { error: "Failed to add experience" },
      { status: 500 }
    );
  }
} 