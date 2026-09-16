import { NextRequest, NextResponse } from 'next/server';
import { ContentType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contentType = searchParams.get('contentType') as ContentType | null;
  const deityId = searchParams.get('deityId');
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
  const skip = (page - 1) * limit;

  const now = new Date();

  // Auto-publish scheduled posts whose publishedAt is in the past
  await prisma.post.updateMany({
    where: {
      status: 'SCHEDULED',
      publishedAt: { lte: now },
    },
    data: { status: 'PUBLISHED' },
  });

  const where: Parameters<typeof prisma.post.findMany>[0]['where'] = {
    status: 'PUBLISHED',
  };

  if (contentType) where.contentType = contentType;
  if (deityId) where.deityId = deityId;
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { lyrics: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { seoKeywords: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        contentType: true,
        description: true,
        featuredImage: true,
        imageAlt: true,
        videoType: true,
        videoUrl: true,
        publishedAt: true,
        viewCount: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        category: { select: { id: true, name: true, slug: true } },
        deity: { select: { id: true, name: true, slug: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
