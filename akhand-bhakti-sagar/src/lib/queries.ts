import { prisma } from './prisma';
import { ContentType } from '@prisma/client';
import { urlToContentType } from './types';

const postSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  featuredImage: true,
  imageAlt: true,
  videoType: true,
  videoUrl: true,
  contentType: true,
  publishedAt: true,
  createdAt: true,
  viewCount: true,
  deity: { select: { id: true, name: true, nameHindi: true, slug: true, image: true } },
  author: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, slug: true } },
} as const;

export async function getFeaturedPosts(limit = 6) {
  try {
    return await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ viewCount: 'desc' }, { publishedAt: 'desc' }],
      take: limit,
      select: postSelect,
    });
  } catch {
    return [];
  }
}

export async function getLatestPosts(limit = 12) {
  try {
    return await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: postSelect,
    });
  } catch {
    return [];
  }
}

export async function getPostsByContentType(
  contentTypeSlug: string,
  page = 1,
  pageSize = 12
) {
  const contentType = urlToContentType[contentTypeSlug];
  if (!contentType) return { posts: [], total: 0, pages: 0 };

  const skip = (page - 1) * pageSize;
  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED', contentType },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
        select: postSelect,
      }),
      prisma.post.count({ where: { status: 'PUBLISHED', contentType } }),
    ]);
    return { posts, total, pages: Math.ceil(total / pageSize) };
  } catch {
    return { posts: [], total: 0, pages: 0 };
  }
}

export async function getPostBySlug(contentTypeSlug: string, slug: string) {
  const contentType = urlToContentType[contentTypeSlug];
  if (!contentType) return null;
  try {
    return await prisma.post.findFirst({
      where: { status: 'PUBLISHED', contentType, slug },
      include: {
        deity: true,
        author: { select: { id: true, name: true } },
        category: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getRelatedPosts(
  contentTypeSlug: string,
  deityId: string | null | undefined,
  excludeSlug: string,
  limit = 4
) {
  const contentType = urlToContentType[contentTypeSlug];
  if (!contentType) return [];
  try {
    return await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        contentType,
        slug: { not: excludeSlug },
        ...(deityId ? { deityId } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: postSelect,
    });
  } catch {
    return [];
  }
}

export async function getPrevNextPost(
  contentTypeSlug: string,
  publishedAt: Date,
  slug: string
) {
  const contentType = urlToContentType[contentTypeSlug];
  if (!contentType) return { prev: null, next: null };
  try {
    const [prev, next] = await Promise.all([
      prisma.post.findFirst({
        where: { status: 'PUBLISHED', contentType, publishedAt: { lt: publishedAt }, slug: { not: slug } },
        orderBy: { publishedAt: 'desc' },
        select: { title: true, slug: true, contentType: true },
      }),
      prisma.post.findFirst({
        where: { status: 'PUBLISHED', contentType, publishedAt: { gt: publishedAt }, slug: { not: slug } },
        orderBy: { publishedAt: 'asc' },
        select: { title: true, slug: true, contentType: true },
      }),
    ]);
    return { prev, next };
  } catch {
    return { prev: null, next: null };
  }
}

export async function getAllDeities() {
  try {
    return await prisma.deity.findMany({
      include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
      orderBy: { name: 'asc' },
    });
  } catch {
    return [];
  }
}

export async function getDeityBySlug(slug: string) {
  try {
    return await prisma.deity.findUnique({
      where: { slug },
      include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
    });
  } catch {
    return null;
  }
}

export async function getDeityPosts(deityId: string, page = 1, pageSize = 12) {
  const skip = (page - 1) * pageSize;
  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED', deityId },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
        select: postSelect,
      }),
      prisma.post.count({ where: { status: 'PUBLISHED', deityId } }),
    ]);
    return { posts, total, pages: Math.ceil(total / pageSize) };
  } catch {
    return { posts: [], total: 0, pages: 0 };
  }
}

export async function getAllCategories() {
  try {
    const contentTypes: ContentType[] = [
      'BHAJAN', 'AARTI', 'CHALISA', 'MANTRA', 'STOTRA', 'ARTICLE', 'FESTIVAL',
    ];
    const counts = await Promise.all(
      contentTypes.map((ct) =>
        prisma.post.count({ where: { status: 'PUBLISHED', contentType: ct } })
      )
    );
    return contentTypes.map((ct, i) => ({ contentType: ct, count: counts[i] }));
  } catch {
    return [];
  }
}

export async function getAllPostSlugs() {
  try {
    return await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, contentType: true, updatedAt: true },
    });
  } catch {
    return [];
  }
}

export async function searchPosts(query: string, limit = 20) {
  try {
    return await prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: postSelect,
    });
  } catch {
    return [];
  }
}
