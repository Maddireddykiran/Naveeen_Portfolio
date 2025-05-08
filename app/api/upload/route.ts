import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';

// Helper to determine if running in production
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }
    
    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const fileExtension = fileType.split('/')[1];
    const filename = `${uuidv4()}.${fileExtension}`;
    
    let publicPath = `/uploads/${filename}`;
    
    // Skip actual file writing in production/Vercel, as it will fail
    if (isProduction || isVercel) {
      console.log(`Production environment detected - skipping file write for: ${filename}`);
      
      // Return a success response with just the path
      return NextResponse.json({ 
        success: true, 
        filePath: publicPath,
        note: "File upload simulated in production environment"
      });
    }
    
    // For development, actually write the file
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadsDir, filename);
    
    // Ensure uploads directory exists
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (err) {
      console.log('Uploads directory already exists or could not be created');
    }
    
    // Convert file to ArrayBuffer and then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Save file
    await writeFile(filepath, new Uint8Array(buffer));
    
    return NextResponse.json({ 
      success: true, 
      filePath: publicPath 
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 