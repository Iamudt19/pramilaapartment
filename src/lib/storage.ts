import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const STORAGE_BUCKETS = {
  DOCUMENTS: 'tenant-documents',
  AVATARS: 'user-avatars',
  VISITORS: 'visitor-photos',
  INCIDENTS: 'incident-evidence',
} as const;

/**
 * Save file locally to public/uploads directory
 */
async function saveToLocalDisk(filename: string, fileBuffer: Buffer | Uint8Array): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueName = `${Date.now()}-${cleanFilename}`;
  const filePath = path.join(uploadsDir, uniqueName);
  await fs.promises.writeFile(filePath, Buffer.from(fileBuffer));
  return `/uploads/${uniqueName}`;
}

/**
 * Upload a file to Supabase Storage with local filesystem fallback
 */
export async function uploadToStorage({
  bucket,
  path: storagePath,
  fileBuffer,
  contentType,
  isPublic = true,
}: {
  bucket: string;
  path: string;
  fileBuffer: Buffer | Uint8Array;
  contentType: string;
  isPublic?: boolean;
}): Promise<{ url: string; path: string }> {
  const fileName = storagePath.split('/').pop() || `file-${Date.now()}`;

  // Try Supabase Storage if configured
  if (supabaseUrl && supabaseServiceKey) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (!error && data) {
        if (isPublic) {
          const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
          return { url: publicData.publicUrl, path: data.path };
        } else {
          const { data: signedData, error: signError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 days

          if (!signError && signedData) {
            return { url: signedData.signedUrl, path: data.path };
          }
        }
      }
    } catch (e) {
      console.warn(`Supabase bucket "${bucket}" upload failed, falling back to local storage:`, e);
    }
  }

  // Local filesystem fallback
  const localUrl = await saveToLocalDisk(fileName, fileBuffer);
  return {
    url: localUrl,
    path: localUrl,
  };
}

/**
 * Generate a fresh temporary signed URL for viewing private documents
 */
export async function getDocumentSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string> {
  if (path.startsWith('/uploads/') || path.startsWith('data:') || path.startsWith('http')) {
    return path;
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    return path;
  }

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (!error && data) {
      return data.signedUrl;
    }
  } catch (e) {
    // fallback
  }

  return path;
}

