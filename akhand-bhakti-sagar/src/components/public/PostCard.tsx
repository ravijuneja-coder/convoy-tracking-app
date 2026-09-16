import Link from 'next/link';
import Image from 'next/image';
import { contentTypeLabels, contentTypeToUrl } from '@/lib/types';
import { ContentType } from '@prisma/client';

interface PostCardDeity {
  id?: string;
  name: string;
  nameHindi?: string | null;
  slug: string;
  image?: string | null;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  featuredImage?: string | null;
  contentType: ContentType | string;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  deity?: PostCardDeity | null;
  author?: { name: string } | null;
}

interface PostCardProps {
  post: Post;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('hi-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function PostCard({ post }: PostCardProps) {
  // Map ContentType enum (BHAJAN) to URL slug (bhajan)
  const ctUrl = contentTypeToUrl[post.contentType as ContentType] ?? post.contentType.toString().toLowerCase();
  const href = `/${ctUrl}/${post.slug}`;
  const label = contentTypeLabels[ctUrl] || post.contentType.toString();
  const dateStr = formatDate(post.publishedAt || post.createdAt);

  return (
    <article className="card-spiritual group flex flex-col h-full overflow-hidden">
      {/* Thumbnail */}
      <Link href={href} className="relative block overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, #7B1B1B, #E85D04)' }}
            aria-hidden="true"
          >
            🕉
          </div>
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(123,27,27,0.7) 100%)' }}
          aria-hidden="true"
        />
      </Link>

      <div className="flex flex-col flex-1 p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="badge-category" style={{ fontFamily: 'var(--font-devanagari)' }}>
            {label}
          </span>
          {post.deity && (
            <span className="badge-deity" style={{ fontFamily: 'var(--font-devanagari)' }}>
              {post.deity.nameHindi || post.deity.name}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={href} className="flex-1">
          <h3
            className="text-base font-bold leading-snug mb-2 transition-colors hover:text-orange-600"
            style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--color-text-primary)', textWrap: 'balance' }}
          >
            {post.title}
          </h3>
        </Link>

        {/* Description */}
        {post.description && (
          <p
            className="text-sm mb-3 line-clamp-2"
            style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}
          >
            {post.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
          <time
            className="text-xs"
            dateTime={post.publishedAt?.toString() || ''}
            style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-devanagari)' }}
          >
            {dateStr}
          </time>
          <Link
            href={href}
            className="text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-150 hover:shadow-md"
            style={{
              fontFamily: 'var(--font-devanagari)',
              background: 'var(--saffron)',
              color: '#FFFFFF',
            }}
          >
            पढ़ें →
          </Link>
        </div>
      </div>
    </article>
  );
}
