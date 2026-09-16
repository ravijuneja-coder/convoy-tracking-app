'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/Toast';

interface Comment {
  id: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: string;
  createdAt: string;
  post?: { id: string; title: string };
}

const STATUS_COLORS: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-amber-100 text-amber-700',
  REJECTED: 'bg-red-100 text-red-700',
  SPAM: 'bg-gray-100 text-gray-600',
};

const FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SPAM'];

export default function CommentsPage() {
  const { addToast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    const url = filter === 'ALL' ? '/api/admin/comments' : `/api/admin/comments?status=${filter}`;
    try {
      const res = await fetch(url);
      if (res.ok) setComments((await res.json()).comments || []);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const updateStatus = async (comment: Comment, status: string) => {
    try {
      const res = await fetch(`/api/admin/comments/${comment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setComments(prev => prev.map(c => c.id === comment.id ? { ...c, status } : c));
      addToast(`Comment ${status.toLowerCase()}`, 'success');
    } catch {
      addToast('Failed to update comment', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/comments/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setComments(prev => prev.filter(c => c.id !== deleteTarget.id));
      addToast('Comment deleted', 'success');
    } catch {
      addToast('Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const columns: Column<Comment>[] = [
    {
      key: 'authorName',
      label: 'Author',
      sortable: true,
      render: c => (
        <div>
          <p className="font-medium text-gray-800 text-sm">{c.authorName}</p>
          {c.authorEmail && <p className="text-xs text-gray-400">{c.authorEmail}</p>}
        </div>
      ),
    },
    {
      key: 'content',
      label: 'Comment',
      render: c => (
        <p className="text-sm text-gray-700 line-clamp-2 max-w-xs">{c.content}</p>
      ),
    },
    {
      key: 'post',
      label: 'Post',
      render: c => (
        <p className="text-xs text-gray-600 line-clamp-1 max-w-[150px]">
          {c.post?.title || '—'}
        </p>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: c => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[c.status] || 'bg-gray-100'}`}>
          {c.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: c => <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="text-gray-500 text-sm">{comments.length} comments</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
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
          rows={comments}
          isLoading={isLoading}
          searchPlaceholder="Search comments..."
          emptyMessage="No comments found."
          actions={comment => (
            <div className="flex flex-wrap gap-1.5">
              {comment.status !== 'APPROVED' && (
                <button onClick={() => updateStatus(comment, 'APPROVED')} className="text-xs text-green-600 hover:underline">Approve</button>
              )}
              {comment.status !== 'REJECTED' && (
                <button onClick={() => updateStatus(comment, 'REJECTED')} className="text-xs text-amber-600 hover:underline">Reject</button>
              )}
              {comment.status !== 'SPAM' && (
                <button onClick={() => updateStatus(comment, 'SPAM')} className="text-xs text-gray-500 hover:underline">Spam</button>
              )}
              <button onClick={() => setDeleteTarget(comment)} className="text-xs text-red-600 hover:underline">Delete</button>
            </div>
          )}
        />
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
