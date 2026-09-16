/**
 * Slugify utility for Akhand Bhakti Sagar.
 *
 * Converts Hindi (Devanagari) and English titles into URL-safe slugs.
 * Strategy:
 *  1. Transliterate known Devanagari characters to their romanised equivalents.
 *  2. Lowercase the result.
 *  3. Replace all non-alphanumeric characters with hyphens.
 *  4. Collapse consecutive hyphens and trim leading/trailing hyphens.
 */

// Devanagari → Latin transliteration table
const DEVANAGARI_MAP: Record<string, string> = {
  // Vowels (independent)
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ii', 'उ': 'u', 'ऊ': 'uu',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऋ': 'ri', 'ॠ': 'ri',
  'अं': 'am', 'अः': 'ah', 'ॐ': 'om',

  // Consonants
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'ळ': 'la',
  'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
  'क्ष': 'ksha', 'त्र': 'tra', 'ज्ञ': 'gya', 'श्र': 'shra',

  // Vowel diacritics (matras)
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri',
  'ं': 'n', 'ः': 'h', '्': '',

  // Digits
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',

  // Punctuation / special
  '।': '', '॥': '', '॰': '', '़': '', 'ऽ': '',
};

/**
 * Transliterate a string containing Devanagari characters into Latin equivalents.
 */
function transliterateDevanagari(input: string): string {
  // Sort keys by length (longest first) so multi-character sequences match first
  const sortedKeys = Object.keys(DEVANAGARI_MAP).sort(
    (a, b) => b.length - a.length
  );

  let result = input;
  for (const key of sortedKeys) {
    // Use a global replace for each Devanagari key
    result = result.split(key).join(DEVANAGARI_MAP[key]);
  }
  return result;
}

/**
 * Convert a title (Hindi or English or mixed) to a URL-safe slug.
 *
 * @param title - The raw title string
 * @param options.separator - Character used between words (default: '-')
 * @param options.maxLength - Truncate the slug to this length (default: 120)
 */
export function slugify(
  title: string,
  options: { separator?: string; maxLength?: number } = {}
): string {
  const { separator = '-', maxLength = 120 } = options;

  if (!title || typeof title !== 'string') return '';

  // Step 1: Transliterate Devanagari
  let slug = transliterateDevanagari(title);

  // Step 2: Lowercase
  slug = slug.toLowerCase();

  // Step 3: Replace anything that is not alphanumeric or separator with separator
  slug = slug.replace(/[^a-z0-9]+/g, separator);

  // Step 4: Collapse consecutive separators
  const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  slug = slug.replace(new RegExp(`${escapedSep}+`, 'g'), separator);

  // Step 5: Trim leading/trailing separators
  slug = slug.replace(new RegExp(`^${escapedSep}|${escapedSep}$`, 'g'), '');

  // Step 6: Enforce max length (trim at a separator boundary if possible)
  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength);
    const lastSep = slug.lastIndexOf(separator);
    if (lastSep > 0) {
      slug = slug.slice(0, lastSep);
    }
  }

  return slug;
}

/**
 * Generate a unique slug by appending a numeric suffix when a collision is found.
 *
 * @param title - The source title
 * @param existingSlugs - Set of slugs that already exist in the database
 */
export function uniqueSlugify(
  title: string,
  existingSlugs: Set<string>
): string {
  const base = slugify(title);
  if (!existingSlugs.has(base)) return base;

  let counter = 2;
  while (existingSlugs.has(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}

export default slugify;
