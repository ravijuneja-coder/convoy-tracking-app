import Link from 'next/link';
import HeroSection from '@/components/public/HeroSection';
import PostCard from '@/components/public/PostCard';
import CategoryCard from '@/components/public/CategoryCard';
import DeityCard from '@/components/public/DeityCard';
import NewsletterSection from '@/components/public/NewsletterSection';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import {
  getFeaturedPosts,
  getLatestPosts,
  getAllCategories,
  getAllDeities,
} from '@/lib/queries';

export const revalidate = 3600; // ISR: revalidate every hour

export default async function HomePage() {
  const [featured, latest, categories, deities] = await Promise.all([
    getFeaturedPosts(6),
    getLatestPosts(8),
    getAllCategories(),
    getAllDeities(),
  ]);

  const topDeities = deities.slice(0, 8);
  const nonEmptyCategories = categories.filter((c) => c.count > 0);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <HeroSection />

        {/* Categories */}
        {nonEmptyCategories.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <h2 className="section-title text-xl sm:text-2xl">भक्ति श्रेणियाँ</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nonEmptyCategories.map((cat) => (
                <CategoryCard key={cat.contentType} contentType={cat.contentType} count={cat.count} />
              ))}
            </div>
          </section>
        )}

        {/* Om divider */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="om-divider my-2">ॐ</div>
        </div>

        {/* Featured Posts */}
        {featured.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <h2 className="section-title text-xl sm:text-2xl">लोकप्रिय भजन</h2>
              <Link
                href="/bhajan"
                className="text-sm font-medium transition-colors hover:text-orange-600"
                style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--deep-orange)' }}
              >
                सभी देखें →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Deities */}
        {topDeities.length > 0 && (
          <section
            className="py-12 px-4 sm:px-6 lg:px-8"
            style={{ background: 'linear-gradient(180deg, #FFF8EE, #FDF6EC)' }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-6">
                <h2 className="section-title text-xl sm:text-2xl">देवी-देवता</h2>
                <Link
                  href="/deity"
                  className="text-sm font-medium transition-colors hover:text-orange-600"
                  style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--deep-orange)' }}
                >
                  सभी देखें →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {topDeities.map((deity) => (
                  <DeityCard key={deity.id} deity={deity} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Latest Posts */}
        {latest.length > 0 && (
          <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <h2 className="section-title text-xl sm:text-2xl">नए भजन और आरती</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {latest.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state when no posts */}
        {featured.length === 0 && latest.length === 0 && (
          <section className="py-20 px-4 text-center">
            <div className="text-5xl mb-4">🕉</div>
            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--maroon)' }}
            >
              जल्द ही उपलब्ध होगा
            </h2>
            <p style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--color-text-muted)' }}>
              भजन, आरती और चालीसा जोड़ी जा रही हैं। शीघ्र आएं।
            </p>
          </section>
        )}

        {/* Newsletter */}
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
