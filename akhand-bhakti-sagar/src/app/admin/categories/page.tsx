'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useToast } from '@/components/admin/Toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  _count?: { posts: number };
}

const emptyForm: Omit<Category, 'id'> = {
  name: '',
  slug: '',
  description: '',
  image: '',
  seoTitle: '',
  seoDescription: '',
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export default function CategoriesPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Omit<Category, 'id'>>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openModal = (cat?: Category) => {
    setEditing(cat || null);
    setForm(cat ? { name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image || '', seoTitle: cat.seoTitle || '', seoDescription: cat.seoDescription || '' } : emptyForm);
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
      const url = editing ? `/api/admin/categories/${editing.id}` : '/api/admin/categories';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      addToast(editing ? 'Category updated' : 'Category created', 'success');
      setIsModalOpen(false);
      fetchCategories();
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
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setCategories(prev => prev.filter(c => c.id !== deleteTarget.id));
      addToast('Category deleted', 'success');
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const columns: Column<Category>[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'slug', label: 'Slug', render: c => <span className="font-mono text-xs text-gray-600">{c.slug}</span> },
    { key: 'posts', label: 'Posts', render: c => <span className="text-gray-600">{c._count?.posts ?? 0}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm">{categories.length} categories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-saffron-500 text-white rounded-lg text-sm font-medium hover:bg-saffron-600 transition-colors"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <AdminTable
          columns={columns}
          rows={categories}
          isLoading={isLoading}
          searchPlaceholder="Search categories..."
          emptyMessage="No categories yet."
          actions={cat => (
            <>
              <button onClick={() => openModal(cat)} className="text-xs text-saffron-600 hover:underline">Edit</button>
              <button onClick={() => setDeleteTarget(cat)} className="text-xs text-red-600 hover:underline">Delete</button>
            </>
          )}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">{editing ? 'Edit Category' : 'Add Category'}</h2>
            {[
              { field: 'name', label: 'Name *', placeholder: 'e.g. Krishna Bhajans' },
              { field: 'slug', label: 'Slug', placeholder: 'e.g. krishna-bhajans' },
              { field: 'image', label: 'Image URL', placeholder: 'https://...' },
              { field: 'seoTitle', label: 'SEO Title', placeholder: '' },
            ].map(({ field, label, placeholder }) => (
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
            {[
              { field: 'description', label: 'Description' },
              { field: 'seoDescription', label: 'SEO Description' },
            ].map(({ field, label }) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <textarea
                  rows={2}
                  value={(form as any)[field]}
                  onChange={e => setField(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400"
                />
              </div>
            ))}
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Category"
        message={`Delete "${deleteTarget?.name}"? Posts in this category won't be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
