import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akhandbhaktisagar.com';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'होम', item: siteUrl },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
      })),
    ],
  };

  const allItems = [{ label: 'होम', href: '/' }, ...items];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="ब्रेडक्रंब"
        className="flex flex-wrap items-center gap-1 text-sm py-2"
        style={{ fontFamily: 'var(--font-devanagari)' }}
      >
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && (
                <span style={{ color: 'var(--color-text-muted)' }} aria-hidden="true">›</span>
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-orange-600"
                  style={{ color: 'var(--deep-orange)' }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  style={{ color: isLast ? 'var(--color-text-secondary)' : 'var(--color-text-muted)' }}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
