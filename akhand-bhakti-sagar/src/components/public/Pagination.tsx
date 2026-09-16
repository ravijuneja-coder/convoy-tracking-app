import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const makeHref = (page: number) =>
    page === 1 ? baseUrl : `${baseUrl}?page=${page}`;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav aria-label="पृष्ठ नेविगेशन" className="flex justify-center items-center gap-1 flex-wrap py-8">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={makeHref(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
          style={{
            fontFamily: 'var(--font-devanagari)',
            background: 'rgba(255,107,0,0.08)',
            color: 'var(--deep-orange)',
            border: '1px solid rgba(255,107,0,0.2)',
          }}
          aria-label="पिछला पृष्ठ"
        >
          ← पिछला
        </Link>
      ) : (
        <span
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            fontFamily: 'var(--font-devanagari)',
            color: 'var(--color-text-muted)',
            background: 'transparent',
          }}
          aria-disabled="true"
        >
          ← पिछला
        </span>
      )}

      {/* Pages */}
      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            …
          </span>
        ) : (
          <Link
            key={page}
            href={makeHref(page)}
            aria-label={`पृष्ठ ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-all"
            style={
              page === currentPage
                ? { background: 'var(--saffron)', color: '#FFFFFF', boxShadow: '0 2px 8px rgba(255,107,0,0.3)' }
                : {
                    background: 'transparent',
                    color: 'var(--color-text-secondary)',
                    border: '1px solid var(--color-border)',
                  }
            }
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={makeHref(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
          style={{
            fontFamily: 'var(--font-devanagari)',
            background: 'rgba(255,107,0,0.08)',
            color: 'var(--deep-orange)',
            border: '1px solid rgba(255,107,0,0.2)',
          }}
          aria-label="अगला पृष्ठ"
        >
          अगला →
        </Link>
      ) : (
        <span
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            fontFamily: 'var(--font-devanagari)',
            color: 'var(--color-text-muted)',
          }}
          aria-disabled="true"
        >
          अगला →
        </span>
      )}
    </nav>
  );
}
