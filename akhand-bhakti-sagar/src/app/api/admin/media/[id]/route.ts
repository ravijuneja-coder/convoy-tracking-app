import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const media = await prisma.media.findUnique({ where: { id: params.id } });
    if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Delete file from disk
    if (media.url.startsWith('/uploads/')) {
      const filepath = join(process.cwd(), 'public', media.url);
      try { await unlink(filepath); } catch { /* file may already be gone */ }
    }

    await prisma.media.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
