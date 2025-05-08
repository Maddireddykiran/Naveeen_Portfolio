import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    const filepath = join(process.cwd(), 'public', 'uploads', filename);
    
    // Convert file to ArrayBuffer and then to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Save file
    await writeFile(filepath, new Uint8Array(buffer));
    
    // Return the path that can be used to access the file
    const publicPath = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      filepath: publicPath 
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 