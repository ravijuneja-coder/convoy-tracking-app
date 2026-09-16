/**
 * YouTube utility functions for Akhand Bhakti Sagar.
 */

// Regex patterns that cover all known YouTube URL formats
const YOUTUBE_PATTERNS = [
  // Standard watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  /(?:youtube\.com\/watch\?(?:[^&]*&)*v=)([A-Za-z0-9_-]{11})/,
  // Short URL: https://youtu.be/VIDEO_ID
  /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
  // Embed URL: https://www.youtube.com/embed/VIDEO_ID
  /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  // Shorts URL: https://www.youtube.com/shorts/VIDEO_ID
  /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
  // Live URL: https://www.youtube.com/live/VIDEO_ID
  /(?:youtube\.com\/live\/)([A-Za-z0-9_-]{11})/,
  // v= anywhere in the query string
  /[?&]v=([A-Za-z0-9_-]{11})/,
];

/**
 * Extract the 11-character YouTube video ID from any valid YouTube URL.
 * Returns null if no valid ID is found.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  for (const pattern of YOUTUBE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  // If someone just passed a bare 11-character ID directly
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Thumbnail quality options supported by YouTube's image service.
 */
export type YouTubeThumbnailQuality =
  | 'default'    // 120×90
  | 'mqdefault'  // 320×180
  | 'hqdefault'  // 480×360
  | 'sddefault'  // 640×480
  | 'maxresdefault'; // 1280×720 (may not exist for all videos)

/**
 * Build the thumbnail URL for a given YouTube video ID.
 *
 * @param id      - 11-character YouTube video ID
 * @param quality - Desired thumbnail quality (default: 'hqdefault')
 */
export function getYouTubeThumbnail(
  id: string,
  quality: YouTubeThumbnailQuality = 'hqdefault'
): string {
  if (!id) return '';
  return `https://img.youtube.com/vi/${id}/${quality}.jpg`;
}

/**
 * Build an embeddable YouTube iframe URL for a given video ID.
 *
 * @param id      - 11-character YouTube video ID
 * @param params  - Optional query-string parameters (e.g. autoplay, rel, modestbranding)
 */
export function getYouTubeEmbedUrl(
  id: string,
  params: Record<string, string | number | boolean> = {}
): string {
  if (!id) return '';

  const defaults: Record<string, string | number | boolean> = {
    rel: 0,
    modestbranding: 1,
  };

  const merged = { ...defaults, ...params };
  const query = Object.entries(merged)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');

  return `https://www.youtube.com/embed/${id}${query ? `?${query}` : ''}`;
}

/**
 * Extract the video ID from a URL and immediately build the embed URL.
 * Returns null if the URL is not a valid YouTube URL.
 */
export function urlToEmbedUrl(
  url: string,
  params?: Record<string, string | number | boolean>
): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return getYouTubeEmbedUrl(id, params);
}

/**
 * Check whether a given string looks like a YouTube URL or video ID.
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
