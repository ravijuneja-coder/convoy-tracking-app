'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/Toast';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPage() {
  const { addToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) setMedia((await res.json()).media || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMedia(); }, [fetchMedia]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/admin/media/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
      addToast('File uploaded', 'success');
      fetchMedia();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/media/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setMedia(prev => prev.filter(m => m.id !== deleteTarget.id));
      addToast('File deleted', 'success');
    } catch {
      addToast('Failed to delete file', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    addToast('URL copied to clipboard', 'info');
  };

  const filtered = media.filter(m =>
    !search || m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 text-sm">{media.length} files</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-saffron-500 text-white rounded-lg text-sm font-medium hover:bg-saffron-600 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {isUploading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</>
            ) : '+ Upload'}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center text-gray-500">
          {search ? 'No files match your search.' : 'No files uploaded yet. Click Upload to add your first file.'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm group">
              <div className="aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-gray-800 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatBytes(item.size)} · {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete File"
        message={`Delete "${deleteTarget?.filename}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
