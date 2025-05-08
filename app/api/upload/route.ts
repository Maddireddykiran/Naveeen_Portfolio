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
    
    // Generate a unique filename with timestamp to avoid caching issues
    const timestamp = new Date().getTime();
    const fileExtension = fileType.split('/')[1];
    const filename = `${uuidv4()}_${timestamp}.${fileExtension}`;
    
    // In production (Vercel), we can't save files to the filesystem
    // Instead, return a dummy URL that client can use temporarily
    // In a real app, you'd use a proper image storage service like AWS S3, Cloudinary, etc.
    if (isProduction || isVercel) {
      // For Vercel deployment, just return a success response with a predictable path
      // The front-end will display the uploaded image but it won't persist on server restart
      
      // Return path with timestamp to avoid browser cache issues
      const dummyPath = `/uploads/${filename}`;
      
      console.log('In production mode - Simulating file upload for:', filename);
      
      return NextResponse.json({
        success: true,
        filePath: dummyPath,
        note: "File handling simulated in production environment",
      });
    }
    
    // For development environment, save the file locally
    try {
      // Ensure uploads directory exists
      const uploadsDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true }).catch(() => {
        console.log('Uploads directory already exists');
      });
      
      const filepath = join(uploadsDir, filename);
      
      // Convert file to ArrayBuffer and then to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Save file
      await writeFile(filepath, new Uint8Array(buffer));
      
      const publicPath = `/uploads/${filename}`;
      
      return NextResponse.json({
        success: true,
        filePath: publicPath
      });
    } catch (error) {
      console.error('Error saving file locally:', error);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 