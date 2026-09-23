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
 * Upload a file to Supabase Storage with in-memory Base64 / local disk fallback
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
  const buf = Buffer.from(fileBuffer);
  const fileName = storagePath.split('/').pop() || `file-${Date.now()}`;

  // 1. Try Supabase Storage if configured
  if (supabaseUrl && supabaseServiceKey) {
    try {
      // Ensure bucket exists or create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some((b) => b.name === bucket);
      if (!bucketExists) {
        await supabase.storage.createBucket(bucket, { public: true }).catch(() => {});
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buf, {
          contentType: contentType || 'image/jpeg',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        if (publicData?.publicUrl) {
          return { url: publicData.publicUrl, path: data.path };
        }
      }
    } catch (e) {
      console.warn(`Supabase bucket "${bucket}" upload failed, falling back to base64/local:`, e);
    }
  }

  // 2. Try Local Filesystem (works in local dev environments)
  try {
    const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';
    if (!isVercel) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const cleanFilename = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `${Date.now()}-${cleanFilename}`;
      const filePath = path.join(uploadsDir, uniqueName);
      await fs.promises.writeFile(filePath, buf);
      return {
        url: `/uploads/${uniqueName}`,
        path: `/uploads/${uniqueName}`,
      };
    }
  } catch (fsErr) {
    console.warn('Local filesystem write failed (read-only environment), falling back to data URL:', fsErr);
  }

  // 3. Guaranteed Serverless / Read-Only Fallback (Base64 Data URL)
  const mime = contentType || 'image/jpeg';
  const base64String = `data:${mime};base64,${buf.toString('base64')}`;
  return {
    url: base64String,
    path: storagePath,
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

    if (!error && data?.signedUrl) {
      return data.signedUrl;
    }
  } catch (e) {
    // fallback
  }

  return path;
}


