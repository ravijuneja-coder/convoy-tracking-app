import type { Metadata } from 'next';

// ─── Class name helper (clsx equivalent) ──────────────────────────────────

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[];

/**
 * Combine class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames.
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity as 0)
    .filter(Boolean)
    .join(' ');
}

// ─── Date formatting ───────────────────────────────────────────────────────

type DateInput = Date | string | number | null | undefined;

/**
 * Format a date for display.
 *
 * @param date   - Date, ISO string, or timestamp
 * @param locale - BCP 47 locale (default: 'hi-IN' for Hindi)
 * @param opts   - Intl.DateTimeFormatOptions overrides
 */
export function formatDate(
  date: DateInput,
  locale: string = 'hi-IN',
  opts?: Intl.DateTimeFormatOptions
): string {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const defaultOpts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...opts,
  };

  try {
    return new Intl.DateTimeFormat(locale, defaultOpts).format(d);
  } catch {
    // Fallback if locale is unsupported in the runtime
    return new Intl.DateTimeFormat('en-IN', defaultOpts).format(d);
  }
}

/**
 * Format a date as a short, compact string (e.g. "12 दिस 2024").
 */
export function formatDateShort(date: DateInput, locale: string = 'hi-IN'): string {
  return formatDate(date, locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Format a date as a relative time string (e.g. "3 दिन पहले").
 */
export function formatRelativeDate(date: DateInput, locale: string = 'hi-IN'): string {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffSecs < 60) return rtf.format(-diffSecs, 'second');
    if (diffMins < 60) return rtf.format(-diffMins, 'minute');
    if (diffHours < 24) return rtf.format(-diffHours, 'hour');
    if (diffDays < 30) return rtf.format(-diffDays, 'day');
    if (diffDays < 365) return rtf.format(-Math.floor(diffDays / 30), 'month');
    return rtf.format(-Math.floor(diffDays / 365), 'year');
  } catch {
    return formatDate(date, locale);
  }
}

// ─── String helpers ────────────────────────────────────────────────────────

/**
 * Truncate a string to a maximum character length, appending an ellipsis.
 *
 * @param str       - Input string
 * @param maxLength - Maximum character count (default: 160)
 * @param suffix    - Appended when truncated (default: '…')
 */
export function truncate(
  str: string | null | undefined,
  maxLength: number = 160,
  suffix: string = '…'
): string {
  if (!str) return '';
  if (str.length <= maxLength) return str;

  // Try to break at a word boundary
  const truncated = str.slice(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + suffix;
}

/**
 * Strip HTML tags from a string.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Format a view count for display (e.g. 1500 → "1.5K").
 */
export function formatViewCount(count: number): string {
  if (count < 1000) return String(count);
  if (count < 1_000_000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
}

// ─── Metadata generator ────────────────────────────────────────────────────

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedAt?: Date | string;
  noIndex?: boolean;
}

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Akhand Bhakti Sagar';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://akhandbhaktisagar.com';

/**
 * Generate a Next.js `Metadata` object with sensible defaults for the site.
 */
export function generateMetadata(opts: GenerateMetadataOptions = {}): Metadata {
  const {
    title,
    description = 'भजन, आरती, चालीसा, मंत्र और अन्य भक्ति सामग्री हिंदी में। Akhand Bhakti Sagar पर आपका स्वागत है।',
    keywords,
    image,
    url,
    type = 'website',
    publishedAt,
    noIndex = false,
  } = opts;

  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const ogImage = image ?? `${SITE_URL}/og-default.jpg`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title ?? SITE_NAME,
        },
      ],
      ...(publishedAt
        ? { publishedTime: new Date(publishedAt).toISOString() }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };

  return metadata;
}

// ─── Misc ──────────────────────────────────────────────────────────────────

/**
 * Sleep for a given number of milliseconds (useful in server-side rate limiting).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safe JSON parse — returns null on failure instead of throwing.
 */
export function safeJsonParse<T>(json: string | null | undefined): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Convert a content-type enum value to a human-readable Hindi label.
 */
export const CONTENT_TYPE_LABELS: Record<string, string> = {
  BHAJAN: 'भजन',
  AARTI: 'आरती',
  CHALISA: 'चालीसा',
  MANTRA: 'मंत्र',
  STOTRA: 'स्तोत्र',
  BHAKTI_GEET: 'भक्ति गीत',
  ARTICLE: 'लेख',
  FESTIVAL: 'त्योहार',
  KATHA: 'कथा',
};

export function getContentTypeLabel(type: string): string {
  return CONTENT_TYPE_LABELS[type] ?? type;
}
