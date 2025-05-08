import { createClient } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// Helper to determine if running in production
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

// Check if Vercel KV credentials are available
const hasKVCredentials = 
  typeof process.env.VERCEL_KV_URL === 'string' && 
  typeof process.env.VERCEL_KV_REST_TOKEN === 'string';

// In-memory cache as a fallback
let contentCache: any = null;

const contentFilePath = path.join(process.cwd(), 'data', 'content.json');

// Initialize KV client if credentials are available
let kvClient: any = null;
try {
  if (hasKVCredentials) {
    // This will automatically use VERCEL_KV_URL and VERCEL_KV_REST_TOKEN from env vars
    kvClient = createClient();
    console.log('Vercel KV client initialized successfully');
  } else if (isProduction || isVercel) {
    console.warn('Running in production but KV credentials are not available. Using in-memory fallback.');
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
  // Only try to use KV if client is available
  if (kvClient) {
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
  } else {
    // Initialize memory cache instead
    if (!contentCache) {
      try {
        contentCache = await loadInitialData();
        console.log('Initialized in-memory cache with content data');
      } catch (error) {
        console.error('Error initializing in-memory cache:', error);
      }
    }
  }
}

// Get the content data
export async function getContent() {
  // If KV client is available, try to get from KV store
  if (kvClient) {
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
      
      // Fallback to in-memory cache or file
      if (!contentCache) {
        contentCache = await loadInitialData();
      }
      return contentCache;
    }
  }
  
  // For development or if KV client is not available, read from file/cache
  if (isProduction || isVercel) {
    // In production without KV, use in-memory cache
    if (!contentCache) {
      contentCache = await loadInitialData();
    }
    return contentCache;
  } else {
    // In development, always read fresh from file
    try {
      return await loadInitialData();
    } catch (error) {
      console.error('Error reading content data from file:', error);
      throw new Error('Failed to read content data');
    }
  }
}

// Update the content
export async function updateContent(key: string, value: any) {
  try {
    // Get current content (either from KV, memory, or file)
    let content = await getContent();
    
    // Update the specific part
    content[key] = value;
    
    // If KV client is available
    if (kvClient) {
      // Save to KV store
      await kvClient.set('content', content);
      console.log(`Updated ${key} in KV store`);
    } else if (isProduction || isVercel) {
      // In production without KV, update in-memory cache
      contentCache = content;
      console.log(`Updated ${key} in memory cache (changes will be lost on restart)`);
    }
    
    // In development or as a backup in production, try to update the file
    // This won't work in Vercel production but will work locally
    try {
      await fs.promises.writeFile(
        contentFilePath,
        JSON.stringify(content, null, 2),
        'utf8'
      );
    } catch (e) {
      // Only log error if we're in development where file writing should work
      if (!isProduction && !isVercel) {
        console.error(`Error writing ${key} to file:`, e);
        throw new Error(`Failed to update ${key}`);
      }
    }
    
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