import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  void req;
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const [
    totalPosts,
    published,
    drafts,
    scheduled,
    categories,
    deities,
    subscribers,
    pendingComments,
    recentPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.post.count({ where: { status: 'SCHEDULED' } }),
    prisma.category.count(),
    prisma.deity.count(),
    prisma.subscriber.count(),
    prisma.comment.count({ where: { status: 'PENDING' } }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        contentType: true,
        publishedAt: true,
        viewCount: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalPosts,
      published,
      drafts,
      scheduled,
      categories,
      deities,
      subscribers,
      pendingComments,
    },
    recentPosts,
  });
}
