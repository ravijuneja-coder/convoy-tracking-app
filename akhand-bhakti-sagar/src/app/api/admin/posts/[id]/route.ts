import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { category: true, deity: true, author: { select: { email: true, name: true } } },
    });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    // Map schema field `description` to `shortDescription` for frontend
    return NextResponse.json({ post: { ...post, shortDescription: post.description } });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const body = await req.json();
    const {
      title, slug, contentType, categoryId, deityId, shortDescription,
      featuredImage, lyrics, content, videoType, videoUrl, embedCode,
      seoTitle, seoDescription, seoKeywords, ogImage, status, publishedAt,
    } = body;

    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        title, slug, contentType,
        categoryId: categoryId || undefined,
        deityId: deityId || null,
        description: shortDescription || null,
        featuredImage: featuredImage || null,
        lyrics: lyrics || null,
        content: content || null,
        videoType: videoType || 'NONE',
        videoUrl: videoUrl || null,
        embedCode: embedCode || null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        seoKeywords: seoKeywords || null,
        ogImage: ogImage || null,
        status: status || 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : (status === 'PUBLISHED' ? new Date() : null),
        updatedAt: new Date(),
      },
    });
    return NextResponse.json({ post });
  } catch (error: any) {
    if (error.code === 'P2002') return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    const body = await req.json();
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
        ...(body.status === 'PUBLISHED' ? { publishedAt: new Date() } : {}),
      },
    });
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireAuth();
  if (authError) return authError;
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
