import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const deities = await prisma.deity.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ deities });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch deities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const body = await req.json();
    const { name, nameHindi, slug, description, image, seoTitle, seoDescription } = body;
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    const deity = await prisma.deity.create({
      data: { name, nameHindi, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description, image, seoTitle, seoDescription },
    });
    return NextResponse.json({ deity }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to create deity' }, { status: 500 });
  }
}
