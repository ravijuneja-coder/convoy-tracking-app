import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
  const skip = (page - 1) * limit;

  if (!q) {
    return NextResponse.json({ results: [], pagination: { page, limit, total: 0, totalPages: 0 } });
  }

  const where: Parameters<typeof prisma.post.findMany>[0]['where'] = {
    status: 'PUBLISHED',
    OR: [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { lyrics: { contains: q, mode: 'insensitive' } },
      { content: { contains: q, mode: 'insensitive' } },
      { seoKeywords: { contains: q, mode: 'insensitive' } },
    ],
  };

  const [results, total] = await Promise.all([
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
        publishedAt: true,
        category: { select: { id: true, name: true, slug: true } },
        deity: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({
    query: q,
    results,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
