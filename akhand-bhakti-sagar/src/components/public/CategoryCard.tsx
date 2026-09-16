import Link from 'next/link';
import { contentTypeLabels, contentTypeDescriptions, contentTypeToUrl } from '@/lib/types';
import { ContentType } from '@prisma/client';

const categoryIcons: Record<string, string> = {
  bhajan: '🎵',
  aarti: '🪔',
  chalisa: '📿',
  mantra: '🔔',
  stotra: '📖',
  'bhakti-geet': '🎶',
  article: '✍️',
  festival: '🎊',
  katha: '📚',
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  bhajan:      { bg: 'rgba(255,107,0,0.08)',  text: '#CC4400', border: 'rgba(255,107,0,0.2)' },
  aarti:       { bg: 'rgba(232,93,4,0.08)',   text: '#C04400', border: 'rgba(232,93,4,0.2)' },
  chalisa:     { bg: 'rgba(212,175,55,0.1)',  text: '#8B6A00', border: 'rgba(212,175,55,0.25)' },
  mantra:      { bg: 'rgba(123,27,27,0.08)',  text: '#7B1B1B', border: 'rgba(123,27,27,0.2)' },
  stotra:      { bg: 'rgba(180,60,20,0.08)',  text: '#8B3010', border: 'rgba(180,60,20,0.2)' },
  'bhakti-geet':{ bg: 'rgba(255,140,0,0.08)', text: '#994400', border: 'rgba(255,140,0,0.2)' },
  article:     { bg: 'rgba(90,13,13,0.06)',   text: '#5A0D0D', border: 'rgba(90,13,13,0.15)' },
  festival:    { bg: 'rgba(255,153,0,0.08)', text: '#995500', border: 'rgba(255,153,0,0.2)' },
  katha:       { bg: 'rgba(150,75,0,0.08)',  text: '#804000', border: 'rgba(150,75,0,0.2)' },
};

interface CategoryCardProps {
  /** Either a URL slug ('bhajan') or a Prisma ContentType enum ('BHAJAN') */
  contentType: string;
  count: number;
}

export default function CategoryCard({ contentType, count }: CategoryCardProps) {
  // Normalize: if it's a Prisma enum value (uppercase), convert to URL slug
  const slug = contentTypeToUrl[contentType as ContentType] ?? contentType.toLowerCase().replace('_', '-');
  const label = contentTypeLabels[slug] || slug;
  const description = contentTypeDescriptions[slug] || '';
  const icon = categoryIcons[slug] || '🕉';
  const colors = categoryColors[slug] || { bg: 'rgba(255,107,0,0.08)', text: '#CC4400', border: 'rgba(255,107,0,0.2)' };
  const href = `/${slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ background: 'white', boxShadow: `0 2px 12px ${colors.border}` }}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-devanagari)', color: colors.text }}
            >
              {label}
            </h3>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: colors.border, color: colors.text }}
            >
              {count.toLocaleString('hi-IN')}
            </span>
          </div>
          <p
            className="text-xs leading-relaxed"
            style={{ fontFamily: 'var(--font-devanagari)', color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
