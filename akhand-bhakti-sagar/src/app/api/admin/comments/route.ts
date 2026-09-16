import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  try {
    const where: any = {};
    if (status) where.status = status;

    const rawComments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { post: { select: { id: true, title: true } } },
    });

    // Normalize schema field names for the frontend
    const comments = rawComments.map(c => ({
      ...c,
      authorName: c.author,
      authorEmail: c.email,
    }));

    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}
