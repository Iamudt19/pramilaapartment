import { createClient } from '@supabase/supabase-js';

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
 * Upload a file to Supabase Storage
 */
export async function uploadToStorage({
  bucket,
  path,
  fileBuffer,
  contentType,
  isPublic = false,
}: {
  bucket: string;
  path: string;
  fileBuffer: Buffer | Uint8Array;
  contentType: string;
  isPublic?: boolean;
}): Promise<{ url: string; path: string }> {
  if (!supabaseUrl || !supabaseServiceKey) {
    // Fallback for local mock if keys not yet supplied
    console.warn('⚠️ Supabase credentials not set in .env. Returning local preview placeholder.');
    return {
      url: `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80`,
      path,
    };
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  if (isPublic) {
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicData.publicUrl, path: data.path };
  } else {
    // For sensitive private documents, create a signed URL valid for 2 hours
    const { data: signedData, error: signError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, 60 * 60 * 2);

    if (signError || !signedData) {
      throw new Error(`Failed to generate signed URL: ${signError?.message}`);
    }

    return { url: signedData.signedUrl, path: data.path };
  }
}

/**
 * Generate a fresh temporary signed URL for viewing private documents (Aadhaar, Rental Agreement)
 */
export async function getDocumentSignedUrl(bucket: string, path: string, expiresIn = 3600): Promise<string> {
  if (!supabaseUrl || !supabaseServiceKey) {
    return path;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    throw new Error(`Failed to generate signed URL: ${error?.message}`);
  }

  return data.signedUrl;
}
