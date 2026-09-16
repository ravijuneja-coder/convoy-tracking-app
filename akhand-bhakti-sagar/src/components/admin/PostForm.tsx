'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MediaUploader from './MediaUploader';
import SEOPreview from './SEOPreview';
import { useToast } from './Toast';

const CONTENT_TYPES = [
  'BHAJAN', 'AARTI', 'CHALISA', 'MANTRA', 'STOTRA',
  'BHAKTI_GEET', 'ARTICLE', 'FESTIVAL', 'KATHA',
];

const VIDEO_TYPES = ['NONE', 'YOUTUBE_URL', 'YOUTUBE_EMBED', 'UPLOADED'];

interface Category { id: string; name: string; }
interface Deity { id: string; name: string; }

interface PostFormData {
  title: string;
  slug: string;
  contentType: string;
  categoryId: string;
  deityId: string;
  shortDescription: string;
  featuredImage: string;
  lyrics: string;
  content: string;
  videoType: string;
  videoUrl: string;
  embedCode: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
  status: string;
  publishedAt: string;
}

interface PostFormProps {
  initialData?: Partial<PostFormData> & { id?: string };
  authorEmail?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function PostForm({ initialData, authorEmail }: PostFormProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState<PostFormData>({
    title: '',
    slug: '',
    contentType: 'BHAJAN',
    categoryId: '',
    deityId: '',
    shortDescription: '',
    featuredImage: '',
    lyrics: '',
    content: '',
    videoType: 'NONE',
    videoUrl: '',
    embedCode: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    ogImage: '',
    status: 'DRAFT',
    publishedAt: '',
    ...initialData,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [deities, setDeities] = useState<Deity[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slugManual, setSlugManual] = useState(!!initialData?.slug);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'media'>('content');

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.ok ? r.json() : { categories: [] }).then(d => setCategories(d.categories || []));
    fetch('/api/admin/deities').then(r => r.ok ? r.json() : { deities: [] }).then(d => setDeities(d.deities || []));
  }, []);

  const set = (field: keyof PostFormData, value: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugManual) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!form.title.trim()) { addToast('Title is required', 'error'); return; }

    setIsSubmitting(true);
    const body = { ...form, status };

    try {
      const url = isEdit ? `/api/admin/posts/${initialData!.id}` : '/api/admin/posts';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const data = await res.json();
      addToast(status === 'DRAFT' ? 'Draft saved!' : 'Post published!', 'success');
      router.push(`/admin/posts/${data.post.id}/edit`);
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'media', label: 'Media & Video' },
    { id: 'seo', label: 'SEO' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Title & Slug */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Enter post title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={form.slug}
              onChange={e => { setSlugManual(true); set('slug', e.target.value); }}
              placeholder="auto-generated-from-title"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm font-mono"
            />
            <button
              type="button"
              onClick={() => { setSlugManual(false); set('slug', slugify(form.title)); }}
              className="px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Auto
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
            <select
              value={form.contentType}
              onChange={e => set('contentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
            >
              {CONTENT_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.categoryId}
              onChange={e => set('categoryId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
            >
              <option value="">Select category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deity (optional)</label>
            <select
              value={form.deityId}
              onChange={e => set('deityId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
            >
              <option value="">None</option>
              {deities.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <textarea
            value={form.shortDescription}
            onChange={e => set('shortDescription', e.target.value)}
            rows={2}
            placeholder="Brief description for listings and previews..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors
                ${activeTab === tab.id
                  ? 'border-b-2 border-saffron-500 text-saffron-600'
                  : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'content' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lyrics / Devotional Text
                </label>
                <textarea
                  value={form.lyrics}
                  onChange={e => set('lyrics', e.target.value)}
                  rows={12}
                  placeholder="Enter bhajan/aarti lyrics here, one verse per line..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm font-mono"
                />
                <p className="text-xs text-gray-400 mt-1">{form.lyrics.length} chars</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Article Content (HTML / Prose)
                </label>
                <textarea
                  value={form.content}
                  onChange={e => set('content', e.target.value)}
                  rows={8}
                  placeholder="Extended article content, descriptions, background..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                <MediaUploader
                  currentUrl={form.featuredImage}
                  onUpload={url => set('featuredImage', url)}
                  label="Upload Featured Image"
                />
                <div className="mt-2">
                  <input
                    type="text"
                    value={form.featuredImage}
                    onChange={e => set('featuredImage', e.target.value)}
                    placeholder="Or paste image URL..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video Type</label>
                <select
                  value={form.videoType}
                  onChange={e => set('videoType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                >
                  {VIDEO_TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                </select>
              </div>

              {form.videoType === 'YOUTUBE_URL' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                  <input
                    type="url"
                    value={form.videoUrl}
                    onChange={e => set('videoUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                  />
                </div>
              )}

              {form.videoType === 'YOUTUBE_EMBED' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Embed Code</label>
                  <textarea
                    value={form.embedCode}
                    onChange={e => set('embedCode', e.target.value)}
                    rows={4}
                    placeholder='<iframe src="https://www.youtube.com/embed/..."...'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={e => set('seoTitle', e.target.value)}
                  placeholder={form.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <textarea
                  value={form.seoDescription}
                  onChange={e => set('seoDescription', e.target.value)}
                  rows={3}
                  placeholder={form.shortDescription}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={form.seoKeywords}
                  onChange={e => set('seoKeywords', e.target.value)}
                  placeholder="bhajan, krishna bhajan, devotional..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                <input
                  type="text"
                  value={form.ogImage}
                  onChange={e => set('ogImage', e.target.value)}
                  placeholder={form.featuredImage || 'https://...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                />
              </div>
              <SEOPreview
                title={form.seoTitle || form.title}
                url={`https://akhandbhaktisagar.com/${form.slug}`}
                description={form.seoDescription || form.shortDescription}
              />
            </div>
          )}
        </div>
      </div>

      {/* Publish Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h3 className="font-medium text-gray-800">Publish Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
          {form.status === 'SCHEDULED' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date & Time</label>
              <input
                type="datetime-local"
                value={form.publishedAt}
                onChange={e => set('publishedAt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
              />
            </div>
          )}
        </div>
        {authorEmail && (
          <p className="text-sm text-gray-500">Author: <span className="font-medium">{authorEmail}</span></p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Cancel
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSubmit('DRAFT')}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-saffron-500 text-white text-sm font-medium hover:bg-saffron-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && <div className="w-4 h-4 border-2 border-saffron-200 border-t-white rounded-full animate-spin" />}
            {isEdit ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
}
