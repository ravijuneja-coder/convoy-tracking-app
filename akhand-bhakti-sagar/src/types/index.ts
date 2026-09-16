/**
 * Shared TypeScript types for Akhand Bhakti Sagar.
 * These mirror the Prisma schema and are used throughout the app.
 */

// ─── Enums ─────────────────────────────────────────────────────────────────

export type Role = 'ADMIN' | 'EDITOR';

export type ContentType =
  | 'BHAJAN'
  | 'AARTI'
  | 'CHALISA'
  | 'MANTRA'
  | 'STOTRA'
  | 'BHAKTI_GEET'
  | 'ARTICLE'
  | 'FESTIVAL'
  | 'KATHA';

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export type VideoType = 'NONE' | 'YOUTUBE_URL' | 'YOUTUBE_EMBED' | 'UPLOADED';

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';

// ─── Domain models ─────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  /** Hashed — never expose to the client */
  password?: string;
  name: string;
  role: Role;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: { posts: number };
}

export interface Deity {
  id: string;
  name: string;
  nameHindi: string | null;
  slug: string;
  description: string | null;
  image: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: { posts: number };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  contentType: ContentType;
  description: string | null;
  lyrics: string | null;
  content: string | null;
  featuredImage: string | null;
  imageAlt: string | null;
  videoType: VideoType;
  videoUrl: string | null;
  embedCode: string | null;
  uploadedVideoUrl: string | null;
  status: PostStatus;
  publishedAt: Date | string | null;
  viewCount: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  authorId: string;
  categoryId: string;
  deityId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Relations
  author?: Pick<User, 'id' | 'name' | 'username'>;
  category?: Pick<Category, 'id' | 'name' | 'slug'>;
  deity?: Pick<Deity, 'id' | 'name' | 'nameHindi' | 'slug'> | null;
  comments?: Comment[];
  _count?: { comments: number };
}

export interface Comment {
  id: string;
  content: string;
  author: string;
  email: string | null;
  status: CommentStatus;
  postId: string;
  createdAt: Date | string;
  post?: Pick<Post, 'id' | 'title' | 'slug'>;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  type: MediaType;
  mimeType: string;
  size: number;
  altText: string | null;
  caption: string | null;
  createdAt: Date | string;
}

export interface Setting {
  id: string;
  key: string;
  value: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: Date | string;
}

// ─── API / form types ──────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PostFilters {
  status?: PostStatus;
  contentType?: ContentType;
  categoryId?: string;
  deityId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  orderBy?: 'publishedAt' | 'viewCount' | 'createdAt' | 'title';
  orderDir?: 'asc' | 'desc';
}

export interface CreatePostInput {
  title: string;
  contentType: ContentType;
  description?: string;
  lyrics?: string;
  content?: string;
  featuredImage?: string;
  imageAlt?: string;
  videoType?: VideoType;
  videoUrl?: string;
  embedCode?: string;
  uploadedVideoUrl?: string;
  status?: PostStatus;
  publishedAt?: Date | string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  categoryId: string;
  deityId?: string;
}

export type UpdatePostInput = Partial<CreatePostInput>;

export interface CreateCategoryInput {
  name: string;
  description?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CreateDeityInput {
  name: string;
  nameHindi?: string;
  description?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  name: string;
  role?: Role;
}

// ─── Site settings map ─────────────────────────────────────────────────────

export interface SiteSettings {
  siteName: string;
  siteNameHindi: string;
  tagline: string;
  taglineHindi: string;
  siteDescription: string;
  contactEmail: string;
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  postsPerPage: string;
  enableComments: string;
  moderateComments: string;
  enableNewsletter: string;
  googleAnalyticsId: string;
  seoTitle: string;
  seoDescription: string;
  footerText: string;
  maintenanceMode: string;
  [key: string]: string;
}

// ─── Navigation ────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// ─── Admin dashboard stats ─────────────────────────────────────────────────

export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalDeities: number;
  totalComments: number;
  pendingComments: number;
  totalSubscribers: number;
  totalViews: number;
  recentPosts: Post[];
}
