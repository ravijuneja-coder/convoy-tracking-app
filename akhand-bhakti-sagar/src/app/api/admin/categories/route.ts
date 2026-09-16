import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const body = await req.json();
    const { name, slug, description, image, seoTitle, seoDescription } = body;
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    const category = await prisma.category.create({
      data: { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description, image, seoTitle, seoDescription },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
