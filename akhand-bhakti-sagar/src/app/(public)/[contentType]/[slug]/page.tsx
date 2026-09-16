import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumb from '@/components/public/Breadcrumb';
import LyricsViewer from '@/components/public/LyricsViewer';
import VideoPlayer from '@/components/public/VideoPlayer';
import ShareButtons from '@/components/public/ShareButtons';
import PostCard from '@/components/public/PostCard';
import { getPostBySlug, getRelatedPosts, getPrevNextPost } from '@/lib/queries';
import { contentTypeLabels } from '@/lib/types';

const validContentTypes = ['bhajan', 'aarti', 'chalisa', 'mantra', 'stotra', 'article', 'festival'];

interface Props {
  params: { contentType: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentType, slug } = params;
  if (!validContentTypes.includes(contentType)) return { title: 'Not Found' };

  const post = await getPostBySlug(contentType, slug);
  if (!post) return { title: 'Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhandbhaktisagar.com';
  const url = `${siteUrl}/${contentType}/${slug}`;
  const label = contentTypeLabels[contentType] || contentType;

  return {
    title: post.title,
    description: post.excerpt || `${post.title} - ${label} | अखंड भक्ति सागर`,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || `${post.title} - ${label}`,
      url,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630, alt: post.title }]
        : undefined,
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      section: label,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || `${post.title} - ${label}`,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export const revalidate = 3600;

export default async function PostPage({ params }: Props) {
  const { contentType, slug } = params;
  if (!validContentTypes.includes(contentType)) notFound();

  const post = await getPostBySlug(contentType, slug);
  if (!post) notFound();

  const [related, { prev, next }] = await Promise.all([
    getRelatedPosts(contentType, post.deity?.id, slug, 4),
    getPrevNextPost(contentType, post.publishedAt || post.createdAt, slug),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhandbhaktisagar.com';
  const postUrl = `${siteUrl}/${contentType}/${slug}`;
  const label = contentTypeLabels[contentType] || contentType;

  // JSON-LD Article schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    author: post.author ? { '@type': 'Person', name: post.author.name } : { '@type': 'Organization', name: 'अखंड भक्ति सागर' },
    publisher: {
      '@type': 'Organization',
      name: 'अखंड भक्ति सागर',
      url: siteUrl,
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: postUrl,
    articleSection: label,
    inLanguage: 'hi',
  };

  const formattedDate = (post.publishedAt || post.createdAt).toLocaleDateString('hi-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ background: 'var(--color-bg-primary)', minHeight: '80vh' }}>
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb
            items={[
              { label, href: `/${contentType}` },
              { label: post.title },
            ]}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="lg:grid lg:grid-cols-3 lg:gap-10">
            {/* Main content */}
            <article className="lg:col-span-2">
              {/* Featured image */}
              {post.featuredImage && (
                <div className="relative rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '16/9' }}>
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge-category" style={{ fontFamily: 'var(--font-devanagari)' }}>
                  {label}
                </span>
                {post.deity && (
                  <Link href={`/deity/${post.deity.slug}`} className="badge-deity" style={{ fontFamily: 'var(--font-devanagari)' }}>
                    {post.deity.nameHindi || post.deity.name}
                  </Link>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)', textWrap: 'balance' }}
              >
                {post.title}
              </h1>

              {/* Meta */}
              <div
                className="flex flex-wrap items-center gap-4 text-sm mb-6 pb-6"
                style={{ borderBottom: '1px solid var(--color-border)' }}
              >
                {post.author && (
                  <span style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-devanagari)' }}>
                    ✍️ {post.author.name}
                  </span>
                )}
                <time
                  dateTime={post.publishedAt?.toISOString()}
                  style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-devanagari)' }}
                >
                  📅 {formattedDate}
                </time>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p
                  className="text-base leading-relaxed mb-6 p-4 rounded-xl"
                  style={{
                    fontFamily: 'var(--font-devanagari)',
                    color: 'var(--color-text-secondary)',
                    background: 'rgba(255,107,0,0.04)',
                    border: '1px solid rgba(255,107,0,0.1)',
                    lineHeight: '1.9',
                  }}
                >
                  {post.excerpt}
                </p>
              )}

              {/* Lyrics */}
              {post.lyrics && (
                <div className="mb-8">
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}
                  >
                    गीत / बोल
                  </h2>
                  <LyricsViewer lyrics={post.lyrics} title={post.title} />
                </div>
              )}

              {/* Video */}
              {(post.videoUrl || post.videoEmbedCode) && (
                <div className="mb-8">
                  <h2
                    className="text-xl font-bold mb-4"
                    style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}
                  >
                    वीडियो
                  </h2>
                  <VideoPlayer
                    videoType={post.videoType}
                    videoUrl={post.videoUrl}
                    embedCode={post.videoEmbedCode}
                    title={post.title}
                  />
                </div>
              )}

              {/* Content body */}
              {post.content && (
                <div
                  className="mb-8 leading-loose"
                  style={{
                    fontFamily: 'var(--font-devanagari)',
                    color: 'var(--color-text-primary)',
                    fontSize: '1.05rem',
                    lineHeight: '2',
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}

              {/* Share */}
              <div
                className="mb-8 p-5 rounded-xl"
                style={{ background: 'rgba(255,107,0,0.04)', border: '1px solid var(--color-border)' }}
              >
                <ShareButtons title={post.title} url={postUrl} />
              </div>

              {/* Prev / Next */}
              <nav
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
                aria-label="पिछला और अगला"
              >
                {prev && (
                  <Link
                    href={`/${prev.contentType}/${prev.slug}`}
                    className="p-4 rounded-xl transition-all hover:shadow-md"
                    style={{ background: 'white', border: '1px solid var(--color-border)' }}
                  >
                    <span className="text-xs block mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-devanagari)' }}>← पिछला</span>
                    <span className="text-sm font-medium line-clamp-2" style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}>
                      {prev.title}
                    </span>
                  </Link>
                )}
                {next && (
                  <Link
                    href={`/${next.contentType}/${next.slug}`}
                    className="p-4 rounded-xl text-right transition-all hover:shadow-md"
                    style={{ background: 'white', border: '1px solid var(--color-border)' }}
                  >
                    <span className="text-xs block mb-1" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-devanagari)' }}>अगला →</span>
                    <span className="text-sm font-medium line-clamp-2" style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}>
                      {next.title}
                    </span>
                  </Link>
                )}
              </nav>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 mt-10 lg:mt-0">
              <div className="sticky top-24 space-y-6">
                {/* Deity info */}
                {post.deity && (
                  <div
                    className="p-5 rounded-xl text-center"
                    style={{ background: 'white', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}
                  >
                    {post.deity.image && (
                      <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 ring-2" style={{ ringColor: 'var(--gold)' }}>
                        <Image src={post.deity.image} alt={post.deity.nameHindi || post.deity.name} fill className="object-cover" sizes="80px" />
                      </div>
                    )}
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}
                    >
                      {post.deity.nameHindi || post.deity.name}
                    </h3>
                    <Link
                      href={`/deity/${post.deity.slug}`}
                      className="text-xs font-medium px-3 py-1.5 rounded-full inline-block mt-2 transition-colors hover:opacity-80"
                      style={{ fontFamily: 'var(--font-devanagari)', background: 'var(--saffron)', color: 'white' }}
                    >
                      सभी भजन देखें
                    </Link>
                  </div>
                )}

                {/* Related posts */}
                {related.length > 0 && (
                  <div>
                    <h3
                      className="text-base font-bold mb-4 section-title"
                      style={{ fontFamily: 'var(--font-devanagari)' }}
                    >
                      संबंधित भजन
                    </h3>
                    <div className="space-y-3">
                      {related.map((r) => (
                        <Link
                          key={r.id}
                          href={`/${r.contentType}/${r.slug}`}
                          className="flex gap-3 p-3 rounded-lg transition-colors hover:bg-orange-50 group"
                          style={{ border: '1px solid var(--color-border)', background: 'white' }}
                        >
                          {r.featuredImage ? (
                            <div className="relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <Image src={r.featuredImage} alt={r.title} fill className="object-cover" sizes="64px" />
                            </div>
                          ) : (
                            <div className="w-16 h-12 rounded-md flex-shrink-0 flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #FF6B00, #7B1B1B)' }}>🕉</div>
                          )}
                          <span
                            className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors"
                            style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--color-text-primary)' }}
                          >
                            {r.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
