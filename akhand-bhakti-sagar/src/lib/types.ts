export type ContentTypeEnum =
  | 'BHAJAN'
  | 'AARTI'
  | 'CHALISA'
  | 'MANTRA'
  | 'STOTRA'
  | 'BHAKTI_GEET'
  | 'ARTICLE'
  | 'FESTIVAL'
  | 'KATHA';

/** Maps URL slug (lowercase) to Prisma ContentType enum */
export const urlToContentType: Record<string, ContentTypeEnum> = {
  bhajan: 'BHAJAN',
  aarti: 'AARTI',
  chalisa: 'CHALISA',
  mantra: 'MANTRA',
  stotra: 'STOTRA',
  'bhakti-geet': 'BHAKTI_GEET',
  article: 'ARTICLE',
  festival: 'FESTIVAL',
  katha: 'KATHA',
};

/** Maps Prisma ContentType enum to URL slug */
export const contentTypeToUrl: Record<ContentTypeEnum, string> = {
  BHAJAN: 'bhajan',
  AARTI: 'aarti',
  CHALISA: 'chalisa',
  MANTRA: 'mantra',
  STOTRA: 'stotra',
  BHAKTI_GEET: 'bhakti-geet',
  ARTICLE: 'article',
  FESTIVAL: 'festival',
  KATHA: 'katha',
};

/** Human-readable Hindi labels for URL slugs */
export const contentTypeLabels: Record<string, string> = {
  bhajan: 'भजन',
  aarti: 'आरती',
  chalisa: 'चालीसा',
  mantra: 'मंत्र',
  stotra: 'स्तोत्र',
  'bhakti-geet': 'भक्ति गीत',
  article: 'भक्ति लेख',
  festival: 'त्योहार',
  katha: 'कथा',
};

export const contentTypeDescriptions: Record<string, string> = {
  bhajan: 'भगवान की स्तुति में गाए जाने वाले पवित्र गीत',
  aarti: 'पूजा के समय गाई जाने वाली आरतियाँ',
  chalisa: 'चालीस चौपाइयों में रचित स्तुतियाँ',
  mantra: 'वेदों और शास्त्रों के पवित्र मंत्र',
  stotra: 'देवी-देवताओं की स्तुति में रचित स्तोत्र',
  'bhakti-geet': 'भक्ति और भजन के गीत',
  article: 'भक्ति और आध्यात्म पर लेख',
  festival: 'हिंदू त्योहारों की जानकारी',
  katha: 'धार्मिक कथाएँ और कहानियाँ',
};

/** The valid URL slugs for content types shown in nav */
export const validContentTypeSlugs = [
  'bhajan',
  'aarti',
  'chalisa',
  'mantra',
  'stotra',
  'article',
  'festival',
];
