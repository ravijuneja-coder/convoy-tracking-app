import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CommentStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

const updateCommentSchema = z.object({
  status: z.nativeEnum(CommentStatus),
});

type Params = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Params) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const comment = await prisma.comment.findUnique({ where: { id: params.id } });
  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = updateCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const updated = await prisma.comment.update({
    where: { id: params.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ comment: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;

  const comment = await prisma.comment.findUnique({ where: { id: params.id } });
  if (!comment) {
    return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
  }

  await prisma.comment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
