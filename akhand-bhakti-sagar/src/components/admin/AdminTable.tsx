'use client';

import { useState, useMemo } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface AdminTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  rows: T[];
  actions?: (row: T) => React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
  isLoading?: boolean;
  bulkActions?: React.ReactNode;
}

export default function AdminTable<T extends { id: string | number }>({
  columns,
  rows,
  actions,
  searchable = true,
  searchPlaceholder = 'Search...',
  pageSize = 20,
  emptyMessage = 'No records found.',
  isLoading = false,
  bulkActions,
}: AdminTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter(row =>
      columns.some(col => {
        const val = (row as any)[col.key];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  }, [rows, search, columns]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String((a as any)[sortKey] ?? '');
      const bv = String((b as any)[sortKey] ?? '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map(r => r.id)));
  };

  const toggleRow = (id: string | number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        {searchable && (
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={searchPlaceholder}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 w-64"
          />
        )}
        {bulkActions && selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{selected.size} selected</span>
            {bulkActions}
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {bulkActions && (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === paginated.length && paginated.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
              )}
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider
                    ${col.sortable ? 'cursor-pointer select-none hover:text-gray-900' : ''}`}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </span>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0) + (bulkActions ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-saffron-500 rounded-full animate-spin" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0) + (bulkActions ? 1 : 0)} className="px-4 py-12 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {bulkActions && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        className="rounded"
                      />
                    </td>
                  )}
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(row) : String((row as any)[col.key] ?? '—')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
            >
              ←
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pg = i + Math.max(1, page - 2);
              if (pg > totalPages) return null;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`px-3 py-1 rounded border transition-colors
                    ${page === pg ? 'bg-saffron-500 text-white border-saffron-500' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
