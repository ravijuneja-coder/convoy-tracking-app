import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  void req;

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
      seoTitle: true,
      seoDescription: true,
      _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
    },
  });

  return NextResponse.json({ categories });
}
