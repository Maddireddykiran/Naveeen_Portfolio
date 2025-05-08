import { createClient } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// Helper to determine if running in production
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// In-memory cache as a fallback
let contentCache: any = null;

const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

// Initialize KV client if credentials are available (will be automatically available in Vercel)
let kvClient: any = null;
try {
  if (isProduction || isVercel) {
    // This will automatically use VERCEL_KV_URL and VERCEL_KV_REST_TOKEN from env vars
    kvClient = createClient();
    console.log('Vercel KV client initialized');
  }
} catch (error) {
  console.error('Failed to initialize Vercel KV client:', error);
  kvClient = null;
}

// Load initial data - used in production and development
async function loadInitialData() {
  try {
    const data = await fs.promises.readFile(contentFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading initial content data:', error);
    throw new Error('Failed to load initial content data');
  }
}

// Initialize the content in Vercel KV store
export async function initKVStore() {
  if ((isProduction || isVercel) && kvClient) {
    try {
      // Check if content already exists in KV store
      const existingContent = await kvClient.get('content');
      
      if (!existingContent) {
        // If no content in KV store, initialize from the file
        const initialData = await loadInitialData();
        await kvClient.set('content', initialData);
        console.log('Initialized KV store with content data');
      }
    } catch (error) {
      console.error('Error initializing KV store:', error);
    }
  }
}

// Get the content data
export async function getContent() {
  // If in production with KV client, try to get from KV store
  if ((isProduction || isVercel) && kvClient) {
    try {
      const content = await kvClient.get('content');
      if (content) {
        return content;
      }
      
      // If no content in KV store yet, initialize it
      await initKVStore();
      return await kvClient.get('content');
    } catch (error) {
      console.error('Error getting content from KV store:', error);
      
      // Fallback to file content if KV store fails
      if (!contentCache) {
        contentCache = await loadInitialData();
      }
      return contentCache;
    }
  }
  
  // For development or if KV client is not available, read from file
  try {
    return await loadInitialData();
  } catch (error) {
    console.error('Error reading content data from file:', error);
    throw new Error('Failed to read content data');
  }
}

// Update the content
export async function updateContent(key: string, value: any) {
  try {
    // If in production with KV client
    if ((isProduction || isVercel) && kvClient) {
      // Get current content
      let content = await getContent();
      
      // Update the specific part
      content[key] = value;
      
      // Save back to KV store
      await kvClient.set('content', content);
      console.log(`Updated ${key} in KV store`);
      
      return true;
    }
    
    // For development - update the file
    const content = await loadInitialData();
    content[key] = value;
    
    await fs.promises.writeFile(
      contentFilePath,
      JSON.stringify(content, null, 2),
      'utf8'
    );
    
    return true;
  } catch (error) {
    console.error(`Error updating ${key}:`, error);
    throw new Error(`Failed to update ${key}`);
  }
}

// Get a specific section from the content
export async function getContentSection(key: string) {
  const content = await getContent();
  return content[key];
} 