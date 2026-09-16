'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/Toast';

interface Post {
  id: string;
  title: string;
  contentType: string;
  status: string;
  createdAt: string;
  category?: { name: string };
  deity?: { name: string };
}

const STATUS_COLORS: Record<string, string> = {
  PUBLISHED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-gray-100 text-gray-600',
  SCHEDULED: 'bg-blue-100 text-blue-700',
};

export default function PostsPage() {
  const { addToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    const url = filter === 'ALL' ? '/api/admin/posts' : `/api/admin/posts?status=${filter}`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/posts/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setPosts(prev => prev.filter(p => p.id !== deleteTarget.id));
      addToast('Post deleted', 'success');
    } catch {
      addToast('Failed to delete post', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const toggleStatus = async (post: Post) => {
    const newStatus = post.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
      addToast(`Post ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'}`, 'success');
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  const filters = ['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED', 'BHAJAN', 'AARTI', 'ARTICLE'];

  const columns: Column<Post>[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: p => (
        <div>
          <p className="font-medium text-gray-800 line-clamp-1">{p.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{p.category?.name || '—'}</p>
        </div>
      ),
    },
    {
      key: 'contentType',
      label: 'Type',
      sortable: true,
      render: p => <span className="text-xs font-medium">{p.contentType.replace('_', ' ')}</span>,
    },
    {
      key: 'deity',
      label: 'Deity',
      render: p => <span className="text-sm text-gray-600">{p.deity?.name || '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: p => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[p.status] || 'bg-gray-100'}`}>
          {p.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: p => <span className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-500 text-sm">{posts.length} total posts</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-saffron-500 text-white rounded-lg text-sm font-medium hover:bg-saffron-600 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${filter === f ? 'bg-saffron-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <AdminTable
          columns={columns}
          rows={posts}
          isLoading={isLoading}
          searchPlaceholder="Search posts..."
          emptyMessage="No posts found. Create your first post!"
          actions={post => (
            <>
              <button
                onClick={() => toggleStatus(post)}
                className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                {post.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
              </button>
              <Link
                href={`/${post.id}`}
                target="_blank"
                className="text-xs text-blue-600 hover:underline"
              >
                Preview
              </Link>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="text-xs text-saffron-600 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => setDeleteTarget(post)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </>
          )}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
