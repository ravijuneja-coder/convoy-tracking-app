import Link from 'next/link';
import { contentTypeLabels, contentTypeDescriptions } from '@/lib/types';

const categoryIcons: Record<string, string> = {
  bhajan: '🎵',
  aarti: '🪔',
  chalisa: '📿',
  mantra: '🔔',
  stotra: '📖',
  article: '✍️',
  festival: '🎊',
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  bhajan:  { bg: 'rgba(255,107,0,0.08)',  text: '#CC4400', border: 'rgba(255,107,0,0.2)' },
  aarti:   { bg: 'rgba(232,93,4,0.08)',   text: '#C04400', border: 'rgba(232,93,4,0.2)' },
  chalisa: { bg: 'rgba(212,175,55,0.1)',  text: '#8B6A00', border: 'rgba(212,175,55,0.25)' },
  mantra:  { bg: 'rgba(123,27,27,0.08)',  text: '#7B1B1B', border: 'rgba(123,27,27,0.2)' },
  stotra:  { bg: 'rgba(180,60,20,0.08)',  text: '#8B3010', border: 'rgba(180,60,20,0.2)' },
  article: { bg: 'rgba(90,13,13,0.06)',   text: '#5A0D0D', border: 'rgba(90,13,13,0.15)' },
  festival:{ bg: 'rgba(255,153,0,0.08)', text: '#995500', border: 'rgba(255,153,0,0.2)' },
};

interface CategoryCardProps {
  contentType: string;
  count: number;
}

export default function CategoryCard({ contentType, count }: CategoryCardProps) {
  const label = contentTypeLabels[contentType] || contentType;
  const description = contentTypeDescriptions[contentType] || '';
  const icon = categoryIcons[contentType] || '🕉';
  const colors = categoryColors[contentType] || { bg: 'rgba(255,107,0,0.08)', text: '#CC4400', border: 'rgba(255,107,0,0.2)' };
  const href = `/${contentType}`;

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
