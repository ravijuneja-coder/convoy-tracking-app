'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/Toast';

interface Deity {
  id: string;
  name: string;
  nameHindi?: string;
  slug: string;
  description?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  _count?: { posts: number };
}

const emptyForm = { name: '', nameHindi: '', slug: '', description: '', image: '', seoTitle: '', seoDescription: '' };

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function DeitiesPage() {
  const { addToast } = useToast();
  const [deities, setDeities] = useState<Deity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Deity | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Deity | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDeities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/deities');
      if (res.ok) setDeities((await res.json()).deities || []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDeities(); }, [fetchDeities]);

  const openModal = (deity?: Deity) => {
    setEditing(deity || null);
    setForm(deity ? {
      name: deity.name, nameHindi: deity.nameHindi || '', slug: deity.slug,
      description: deity.description || '', image: deity.image || '',
      seoTitle: deity.seoTitle || '', seoDescription: deity.seoDescription || '',
    } : emptyForm);
    setIsModalOpen(true);
  };

  const setField = (field: string, value: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) { addToast('Name is required', 'error'); return; }
    setIsSaving(true);
    try {
      const url = editing ? `/api/admin/deities/${editing.id}` : '/api/admin/deities';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      addToast(editing ? 'Deity updated' : 'Deity created', 'success');
      setIsModalOpen(false);
      fetchDeities();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/deities/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setDeities(prev => prev.filter(d => d.id !== deleteTarget.id));
      addToast('Deity deleted', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const columns: Column<Deity>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: d => (
        <div>
          <p className="font-medium text-gray-800">{d.name}</p>
          {d.nameHindi && <p className="text-xs text-gray-500 font-devanagari">{d.nameHindi}</p>}
        </div>
      ),
    },
    { key: 'slug', label: 'Slug', render: d => <span className="font-mono text-xs text-gray-600">{d.slug}</span> },
    { key: 'posts', label: 'Posts', render: d => <span className="text-gray-600">{d._count?.posts ?? 0}</span> },
  ];

  const fields = [
    { field: 'name', label: 'Name *', placeholder: 'e.g. Lord Krishna' },
    { field: 'nameHindi', label: 'Name (Hindi)', placeholder: 'e.g. श्री कृष्ण' },
    { field: 'slug', label: 'Slug', placeholder: 'e.g. lord-krishna' },
    { field: 'image', label: 'Image URL', placeholder: 'https://...' },
    { field: 'seoTitle', label: 'SEO Title', placeholder: '' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deities</h1>
          <p className="text-gray-500 text-sm">{deities.length} deities</p>
        </div>
        <button onClick={() => openModal()} className="px-4 py-2 bg-saffron-500 text-white rounded-lg text-sm font-medium hover:bg-saffron-600 transition-colors">
          + Add Deity
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <AdminTable
          columns={columns}
          rows={deities}
          isLoading={isLoading}
          searchPlaceholder="Search deities..."
          emptyMessage="No deities yet."
          actions={deity => (
            <>
              <button onClick={() => openModal(deity)} className="text-xs text-saffron-600 hover:underline">Edit</button>
              <button onClick={() => setDeleteTarget(deity)} className="text-xs text-red-600 hover:underline">Delete</button>
            </>
          )}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Deity' : 'Add Deity'}</h2>
            {fields.map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  value={(form as any)[field]}
                  onChange={e => setField(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
            ))}
            {['description', 'seoDescription'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace('seoD', 'SEO D')}</label>
                <textarea rows={2} value={(form as any)[field]} onChange={e => setField(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400" />
              </div>
            ))}
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={isSaving}
                className="px-4 py-2 text-sm bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 disabled:opacity-50 flex items-center gap-2">
                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Deity"
        message={`Delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
