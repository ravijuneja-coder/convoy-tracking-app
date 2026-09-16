import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const body = await req.json();
    const { name, slug, description, image, seoTitle, seoDescription } = body;
    const category = await prisma.category.update({
      where: { id: params.id },
      data: { name, slug, description, image, seoTitle, seoDescription },
    });
    return NextResponse.json({ category });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
