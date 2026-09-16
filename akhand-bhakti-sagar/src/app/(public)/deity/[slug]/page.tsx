import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import PostCard from '@/components/public/PostCard';
import Pagination from '@/components/public/Pagination';
import Breadcrumb from '@/components/public/Breadcrumb';
import { getDeityBySlug, getDeityPosts } from '@/lib/queries';

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deity = await getDeityBySlug(params.slug);
  if (!deity) return { title: 'Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhandbhaktisagar.com';
  const name = deity.nameHindi || deity.name;

  return {
    title: `${name} के भजन, आरती और चालीसा`,
    description: `${name} के भजन, आरती, चालीसा, मंत्र और स्तोत्र का संग्रह। अखंड भक्ति सागर पर पढ़ें।`,
    alternates: { canonical: `${siteUrl}/deity/${params.slug}` },
    openGraph: {
      title: `${name} | अखंड भक्ति सागर`,
      description: `${name} के भजन और आरती`,
      images: deity.image ? [{ url: deity.image, alt: name }] : undefined,
    },
  };
}

export const revalidate = 3600;

export default async function DeityPage({ params, searchParams }: Props) {
  const deity = await getDeityBySlug(params.slug);
  if (!deity) notFound();

  const page = Math.max(1, parseInt(searchParams.page || '1', 10));
  const { posts, total, pages } = await getDeityPosts(deity.id, page, 12);

  const name = deity.nameHindi || deity.name;

  return (
    <div style={{ background: 'var(--color-bg-primary)', minHeight: '80vh' }}>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <Breadcrumb items={[{ label: 'देवी-देवता', href: '/deity' }, { label: name }]} />
      </div>

      {/* Deity header */}
      <div
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #2D0A0A 0%, #7B1B1B 60%, #E85D04 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          {deity.image && (
            <div className="relative w-28 h-28 rounded-full overflow-hidden mx-auto mb-5 ring-4 ring-gold-400" style={{ borderColor: '#D4AF37', borderWidth: '3px', borderStyle: 'solid' }}>
              <Image src={deity.image} alt={name} fill className="object-cover" sizes="112px" priority />
            </div>
          )}
          {!deity.image && <div className="text-6xl mb-5">🕉</div>}

          <h1
            className="text-3xl sm:text-4xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD700' }}
          >
            {name}
          </h1>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,220,176,0.7)' }}>{deity.name}</p>

          {deity.description && (
            <p
              className="text-base leading-relaxed max-w-xl mx-auto"
              style={{ fontFamily: 'var(--font-devanagari)', color: 'rgba(255,220,176,0.85)' }}
            >
              {deity.description}
            </p>
          )}

          {total > 0 && (
            <span
              className="mt-4 inline-block px-4 py-1.5 rounded-full text-sm font-medium"
              style={{
                fontFamily: 'var(--font-devanagari)',
                background: 'rgba(212,175,55,0.15)',
                color: '#D4AF37',
                border: '1px solid rgba(212,175,55,0.3)',
              }}
            >
              कुल {total.toLocaleString('hi-IN')} रचनाएँ
            </span>
          )}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={pages} baseUrl={`/deity/${params.slug}`} />
          </>
        ) : (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">🕉</div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}
            >
              अभी कोई भजन उपलब्ध नहीं
            </h2>
            <p style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--color-text-muted)' }}>
              {name} के भजन जल्द ही जोड़े जाएंगे।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
