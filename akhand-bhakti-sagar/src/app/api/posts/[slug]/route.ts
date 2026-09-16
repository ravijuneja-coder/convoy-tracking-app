import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { slug: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const post = await prisma.post.findFirst({
    where: {
      slug: params.slug,
      status: 'PUBLISHED',
    },
    include: {
      author: { select: { id: true, name: true } },
      category: true,
      deity: true,
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          author: true,
          createdAt: true,
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  // Increment view count (fire-and-forget)
  prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json({ post });
}
