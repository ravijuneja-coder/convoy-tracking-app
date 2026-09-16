import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ media });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}
