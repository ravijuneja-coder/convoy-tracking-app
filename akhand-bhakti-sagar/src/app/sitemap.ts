import { MetadataRoute } from 'next';
import { getAllPostSlugs, getAllDeities } from '@/lib/queries';
import { contentTypeToUrl } from '@/lib/types';
import { ContentType } from '@prisma/client';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhandbhaktisagar.com';

const staticRoutes = [
  { path: '', priority: 1.0, freq: 'daily' as const },
  { path: '/bhajan', priority: 0.9, freq: 'daily' as const },
  { path: '/aarti', priority: 0.9, freq: 'daily' as const },
  { path: '/chalisa', priority: 0.9, freq: 'weekly' as const },
  { path: '/mantra', priority: 0.8, freq: 'weekly' as const },
  { path: '/stotra', priority: 0.8, freq: 'weekly' as const },
  { path: '/article', priority: 0.7, freq: 'weekly' as const },
  { path: '/festival', priority: 0.7, freq: 'weekly' as const },
  { path: '/deity', priority: 0.8, freq: 'weekly' as const },
  { path: '/search', priority: 0.3, freq: 'monthly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, deities] = await Promise.all([
    getAllPostSlugs(),
    getAllDeities(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, freq }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const ctUrl = contentTypeToUrl[post.contentType as ContentType] ?? post.contentType.toLowerCase();
    return {
      url: `${siteUrl}/${ctUrl}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  const deityEntries: MetadataRoute.Sitemap = deities.map((deity) => ({
    url: `${siteUrl}/deity/${deity.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries, ...deityEntries];
}
