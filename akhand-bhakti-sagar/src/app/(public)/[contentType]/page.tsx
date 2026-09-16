import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PostCard from '@/components/public/PostCard';
import Pagination from '@/components/public/Pagination';
import { getPostsByContentType } from '@/lib/queries';
import { contentTypeLabels, contentTypeDescriptions } from '@/lib/types';

const validContentTypes = ['bhajan', 'aarti', 'chalisa', 'mantra', 'stotra', 'article', 'festival'];

const categoryIcons: Record<string, string> = {
  bhajan: '🎵',
  aarti: '🪔',
  chalisa: '📿',
  mantra: '🔔',
  stotra: '📖',
  article: '✍️',
  festival: '🎊',
};

interface Props {
  params: { contentType: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentType } = params;
  if (!validContentTypes.includes(contentType)) return { title: 'Not Found' };

  const label = contentTypeLabels[contentType] || contentType;
  const description = contentTypeDescriptions[contentType] || '';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhandbhaktisagar.com';

  return {
    title: `${label} संग्रह`,
    description: `${label} - ${description}। अखंड भक्ति सागर पर ${label} का विशाल संग्रह पढ़ें।`,
    alternates: { canonical: `${siteUrl}/${contentType}` },
    openGraph: {
      title: `${label} संग्रह | अखंड भक्ति सागर`,
      description,
      url: `${siteUrl}/${contentType}`,
    },
  };
}

export const revalidate = 3600;

export default async function ContentTypePage({ params, searchParams }: Props) {
  const { contentType } = params;
  if (!validContentTypes.includes(contentType)) notFound();

  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const { posts, total, pages } = await getPostsByContentType(contentType, page, 12);

  const label = contentTypeLabels[contentType] || contentType;
  const description = contentTypeDescriptions[contentType] || '';
  const icon = categoryIcons[contentType] || '🕉';

  return (
    <div style={{ background: 'var(--color-bg-primary)', minHeight: '80vh' }}>
      {/* Category header */}
      <div
        className="py-12 px-4 sm:px-6 lg:px-8 text-center"
        style={{ background: 'linear-gradient(135deg, #2D0A0A 0%, #7B1B1B 60%, #E85D04 100%)' }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4" aria-hidden="true">{icon}</div>
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD700' }}
          >
            {label} संग्रह
          </h1>
          <p
            className="text-base mb-3"
            style={{ fontFamily: 'var(--font-devanagari)', color: 'rgba(255,220,176,0.8)' }}
          >
            {description}
          </p>
          {total > 0 && (
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
              style={{
                fontFamily: 'var(--font-devanagari)',
                background: 'rgba(212,175,55,0.15)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              कुल {total.toLocaleString('hi-IN')} {label}
            </span>
          )}
        </div>
      </div>

      {/* Posts grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={pages}
              baseUrl={`/${contentType}`}
            />
          </>
        ) : (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">{icon}</div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}
            >
              अभी कोई {label} उपलब्ध नहीं
            </h2>
            <p style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--color-text-muted)' }}>
              जल्द ही {label} जोड़े जाएंगे। कृपया पुनः आएं।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
