'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: '🏠' },
  {
    label: 'Content',
    icon: '📝',
    children: [
      { label: 'All Posts', href: '/admin/posts' },
      { label: 'Add New', href: '/admin/posts/new' },
      { label: 'Drafts', href: '/admin/posts?status=draft' },
      { label: 'Scheduled', href: '/admin/posts?status=scheduled' },
    ],
  },
  { label: 'Categories', href: '/admin/categories', icon: '🏷️' },
  { label: 'Deities', href: '/admin/deities', icon: '🙏' },
  { label: 'Media Library', href: '/admin/media', icon: '🖼️' },
  { label: 'Comments', href: '/admin/comments', icon: '💬' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Content']);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href || (href !== '/admin' && pathname.startsWith(href.split('?')[0]));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e1e2e] text-white z-40 flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="text-saffron-400 font-bold text-lg leading-tight">
            🕉️ Akhand Bhakti
          </div>
          <div className="text-white/50 text-xs mt-0.5">Admin Panel</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(item => {
            if (item.children) {
              const isExpanded = expandedGroups.includes(item.label);
              const childActive = item.children.some(c => isActive(c.href));
              return (
                <div key={item.label} className="mb-1">
                  <button
                    onClick={() => toggleGroup(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors
                      ${childActive ? 'text-saffron-400' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className={`text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  {isExpanded && (
                    <div className="ml-9 mt-1 space-y-0.5">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors
                            ${isActive(child.href)
                              ? 'bg-saffron-500/20 text-saffron-400'
                              : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors
                  ${isActive(item.href!)
                    ? 'bg-saffron-500/20 text-saffron-400 font-medium'
                    : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
