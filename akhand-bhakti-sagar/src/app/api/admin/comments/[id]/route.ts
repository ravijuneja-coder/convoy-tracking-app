import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const { status } = await req.json();
    const comment = await prisma.comment.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ comment });
  } catch {
    return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await prisma.comment.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
