import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const [totalPosts, published, drafts, scheduled, categories, deities] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.post.count({ where: { status: 'DRAFT' } }),
      prisma.post.count({ where: { status: 'SCHEDULED' } }),
      prisma.category.count(),
      prisma.deity.count(),
    ]);

    return NextResponse.json({ totalPosts, published, drafts, scheduled, categories, deities });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
