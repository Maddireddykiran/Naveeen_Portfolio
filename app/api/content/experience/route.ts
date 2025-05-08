import { NextRequest, NextResponse } from 'next/server';
import { getContentSection, updateContent } from '@/lib/vercel-kv-service';
import { corsHeaders } from '@/app/api/cors-middleware';

// Define Experience type
interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  location: string;
  desc: string;
  skills: string[];
  thumbnail: string;
}

// Allow CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const experiences = await getContentSection('experience');
    return NextResponse.json(experiences, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { 
        status: 500,
        headers: corsHeaders
      }
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
          { 
            status: 400,
            headers: corsHeaders
          }
        );
      }
    }
    
    // Get current experiences
    const experiences = await getContentSection('experience') as Experience[];
    
    // Generate new ID (max ID + 1)
    const maxId = experiences.reduce((max, exp) => Math.max(max, exp.id), 0);
    
    // Create new experience object
    const newExperience: Experience = {
      id: body.id || maxId + 1,
      title: body.title,
      company: body.company,
      period: body.period,
      location: body.location,
      desc: body.desc,
      skills: body.skills || [],
      thumbnail: body.thumbnail || ""
    };
    
    // Add the new experience
    const updatedExperiences = [...experiences, newExperience];
    
    // Save to storage
    await updateContent('experience', updatedExperiences);
    
    return NextResponse.json({ 
      message: "Experience added successfully", 
      experience: newExperience 
    }, { 
      status: 201,
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Error adding experience:", error);
    return NextResponse.json(
      { error: "Failed to add experience" },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const experiences = await request.json();
    await updateContent('experience', experiences);
    
    return NextResponse.json({ 
      success: true 
    }, {
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Error updating experiences:", error);
    return NextResponse.json(
      { error: "Failed to update experiences" },
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
} 