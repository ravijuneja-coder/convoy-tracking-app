import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 10MB' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = join(uploadDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    const url = `/uploads/${filename}`;

    // Try to save to DB — if Media model doesn't exist yet, still return URL
    try {
      const { default: prisma } = await import('@/lib/prisma');
      await prisma.media.create({
        data: {
          filename: file.name,
          url,
          size: file.size,
          mimeType: file.type,
        },
      });
    } catch (dbError) {
      console.warn('Media DB save skipped:', dbError);
    }

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
