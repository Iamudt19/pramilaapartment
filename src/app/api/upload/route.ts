import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { uploadToStorage, STORAGE_BUCKETS } from '@/lib/storage';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'image/gif',
  'application/pdf',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession(req);
    const userId = session?.id || 'public-onboarding';

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'DOCUMENTS'; // DOCUMENTS, AVATARS, VISITORS, INCIDENTS, REGISTRATION

    if (!file) {
      return NextResponse.json({ success: false, error: { message: 'No file provided in request' } }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: { message: 'File size exceeds maximum allowed limit of 10MB' } },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: { message: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, PDF` } },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop()?.toLowerCase() || (file.type === 'application/pdf' ? 'pdf' : 'jpg');
    const randomName = `${crypto.randomUUID()}.${fileExt}`;
    const storagePath = `${userId}/${Date.now()}-${randomName}`;

    let bucket: string = STORAGE_BUCKETS.DOCUMENTS;
    let isPublic = true;

    if (category === 'AVATARS') {
      bucket = STORAGE_BUCKETS.AVATARS;
      isPublic = true;
    } else if (category === 'VISITORS') {
      bucket = STORAGE_BUCKETS.VISITORS;
      isPublic = true;
    } else if (category === 'INCIDENTS') {
      bucket = STORAGE_BUCKETS.INCIDENTS;
      isPublic = true;
    }

    const { url, path } = await uploadToStorage({
      bucket,
      path: storagePath,
      fileBuffer: buffer,
      contentType: file.type || 'image/jpeg',
      isPublic,
    });

    return NextResponse.json({
      success: true,
      file: {
        url,
        path,
        fileName: file.name,
        size: file.size,
        mimeType: file.type,
        category,
      },
    });
  } catch (err: any) {
    console.error('Upload handler error:', err);
    return NextResponse.json({ success: false, error: { message: err.message || 'Upload failed' } }, { status: 500 });
  }
}

