export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  lyrics?: string | null;
  featuredImage?: string | null;
  videoType?: string | null;
  videoUrl?: string | null;
  videoEmbedCode?: string | null;
  contentType: string;
  published: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deity?: Deity | null;
  author?: Author | null;
  tags?: Tag[];
  viewCount?: number;
}

export interface Deity {
  id: string;
  name: string;
  nameHindi: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  _count?: { posts: number };
}

export interface Category {
  id: string;
  name: string;
  nameHindi: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  _count?: { posts: number };
}

export interface Author {
  id: string;
  name: string;
  image?: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export type ContentType = 'bhajan' | 'aarti' | 'chalisa' | 'mantra' | 'stotra' | 'article' | 'festival';

export const contentTypeLabels: Record<string, string> = {
  bhajan: 'भजन',
  aarti: 'आरती',
  chalisa: 'चालीसा',
  mantra: 'मंत्र',
  stotra: 'स्तोत्र',
  article: 'भक्ति लेख',
  festival: 'त्योहार',
};

export const contentTypeDescriptions: Record<string, string> = {
  bhajan: 'भगवान की स्तुति में गाए जाने वाले पवित्र गीत',
  aarti: 'पूजा के समय गाई जाने वाली आरतियाँ',
  chalisa: 'चालीस चौपाइयों में रचित स्तुतियाँ',
  mantra: 'वेदों और शास्त्रों के पवित्र मंत्र',
  stotra: 'देवी-देवताओं की स्तुति में रचित स्तोत्र',
  article: 'भक्ति और आध्यात्म पर लेख',
  festival: 'हिंदू त्योहारों की जानकारी',
};
