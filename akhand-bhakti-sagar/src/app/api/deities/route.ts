import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  void req;

  const deities = await prisma.deity.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      nameHindi: true,
      slug: true,
      description: true,
      image: true,
      seoTitle: true,
      seoDescription: true,
      _count: { select: { posts: { where: { status: 'PUBLISHED' } } } },
    },
  });

  return NextResponse.json({ deities });
}
