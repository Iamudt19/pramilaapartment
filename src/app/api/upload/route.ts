import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/rbac';
import { uploadToStorage, STORAGE_BUCKETS } from '@/lib/storage';
import crypto from 'crypto';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'DOCUMENTS'; // DOCUMENTS, AVATARS, VISITORS, INCIDENTS

    if (!file) {
      return NextResponse.json({ success: false, error: { message: 'No file provided in request' } }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: { message: 'File size exceeds maximum allowed limit of 10MB' } },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: { message: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WEBP, PDF` } },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop()?.toLowerCase() || (file.type === 'application/pdf' ? 'pdf' : 'jpg');
    const randomName = `${crypto.randomUUID()}.${fileExt}`;
    const storagePath = `${auth.session.id}/${Date.now()}-${randomName}`;

    let bucket: string = STORAGE_BUCKETS.DOCUMENTS;
    let isPublic = false;

    if (category === 'AVATARS') {
      bucket = STORAGE_BUCKETS.AVATARS;
      isPublic = true;
    } else if (category === 'VISITORS') {
      bucket = STORAGE_BUCKETS.VISITORS;
      isPublic = false;
    } else if (category === 'INCIDENTS') {
      bucket = STORAGE_BUCKETS.INCIDENTS;
      isPublic = false;
    }

    const { url, path } = await uploadToStorage({
      bucket,
      path: storagePath,
      fileBuffer: buffer,
      contentType: file.type,
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
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
