import { MetadataRoute } from 'next';
import { getAllPostSlugs, getAllDeities } from '@/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhandbhaktisagar.com';

const staticRoutes = [
  '',
  '/bhajan',
  '/aarti',
  '/chalisa',
  '/mantra',
  '/stotra',
  '/article',
  '/festival',
  '/deity',
  '/search',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/disclaimer',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, deities] = await Promise.all([
    getAllPostSlugs(),
    getAllDeities(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/${post.contentType}/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const deityEntries: MetadataRoute.Sitemap = deities.map((deity) => ({
    url: `${siteUrl}/deity/${deity.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries, ...deityEntries];
}
