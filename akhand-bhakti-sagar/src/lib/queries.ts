import prisma from './db';

const postSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  featuredImage: true,
  videoType: true,
  videoUrl: true,
  contentType: true,
  publishedAt: true,
  createdAt: true,
  deity: { select: { id: true, name: true, nameHindi: true, slug: true, image: true } },
  author: { select: { id: true, name: true, image: true } },
  tags: { select: { id: true, name: true, slug: true } },
} as const;

export async function getFeaturedPosts(limit = 6) {
  try {
    return await prisma.post.findMany({
      where: { published: true },
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
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: postSelect,
    });
  } catch {
    return [];
  }
}

export async function getPostsByContentType(
  contentType: string,
  page = 1,
  pageSize = 12
) {
  const skip = (page - 1) * pageSize;
  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { published: true, contentType },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
        select: postSelect,
      }),
      prisma.post.count({ where: { published: true, contentType } }),
    ]);
    return { posts, total, pages: Math.ceil(total / pageSize) };
  } catch {
    return { posts: [], total: 0, pages: 0 };
  }
}

export async function getPostBySlug(contentType: string, slug: string) {
  try {
    return await prisma.post.findFirst({
      where: { published: true, contentType, slug },
      include: {
        deity: true,
        author: { select: { id: true, name: true, image: true } },
        tags: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getRelatedPosts(
  contentType: string,
  deityId: string | null | undefined,
  excludeSlug: string,
  limit = 4
) {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
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

export async function getPrevNextPost(contentType: string, publishedAt: Date, slug: string) {
  try {
    const [prev, next] = await Promise.all([
      prisma.post.findFirst({
        where: { published: true, contentType, publishedAt: { lt: publishedAt }, slug: { not: slug } },
        orderBy: { publishedAt: 'desc' },
        select: { title: true, slug: true, contentType: true },
      }),
      prisma.post.findFirst({
        where: { published: true, contentType, publishedAt: { gt: publishedAt }, slug: { not: slug } },
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
      include: { _count: { select: { posts: { where: { published: true } } } } },
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
      include: { _count: { select: { posts: { where: { published: true } } } } },
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
        where: { published: true, deityId },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
        select: postSelect,
      }),
      prisma.post.count({ where: { published: true, deityId } }),
    ]);
    return { posts, total, pages: Math.ceil(total / pageSize) };
  } catch {
    return { posts: [], total: 0, pages: 0 };
  }
}

export async function getAllCategories() {
  try {
    const contentTypes = ['bhajan', 'aarti', 'chalisa', 'mantra', 'stotra', 'article', 'festival'];
    const counts = await Promise.all(
      contentTypes.map((ct) =>
        prisma.post.count({ where: { published: true, contentType: ct } })
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
      where: { published: true },
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
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { excerpt: { contains: query, mode: 'insensitive' } },
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
