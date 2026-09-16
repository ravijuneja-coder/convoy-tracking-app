import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const contentType = searchParams.get('contentType');
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    const where: any = {};
    if (status) where.status = status;
    if (contentType) where.contentType = contentType;

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        deity: { select: { name: true } },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const body = await req.json();
    const {
      title, slug, contentType, categoryId, deityId, shortDescription,
      featuredImage, lyrics, content, videoType, videoUrl, embedCode,
      seoTitle, seoDescription, seoKeywords, ogImage, status, publishedAt,
    } = body;

    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

    const post = await prisma.post.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        contentType: contentType || 'ARTICLE',
        categoryId: categoryId || null,
        deityId: deityId || null,
        shortDescription,
        featuredImage,
        lyrics,
        content,
        videoType: videoType || 'NONE',
        videoUrl,
        embedCode,
        seoTitle,
        seoDescription,
        seoKeywords,
        ogImage,
        status: status || 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : (status === 'PUBLISHED' ? new Date() : null),
      },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
