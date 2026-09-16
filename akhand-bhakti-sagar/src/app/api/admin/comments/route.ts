import { NextRequest, NextResponse } from 'next/server';
import { CommentStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as CommentStatus | null;
  const postId = searchParams.get('postId');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;

  const where: Parameters<typeof prisma.comment.findMany>[0]['where'] = {};
  if (status) where.status = status;
  if (postId) where.postId = postId;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        post: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return NextResponse.json({
    comments,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
