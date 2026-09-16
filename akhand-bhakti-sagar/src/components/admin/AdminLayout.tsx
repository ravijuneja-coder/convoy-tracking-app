'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { ToastProvider } from './Toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  userEmail?: string;
}

export default function AdminLayout({ children, userEmail }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top header */}
          <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open sidebar"
              >
                ☰
              </button>
              <h1 className="text-gray-800 font-semibold text-sm hidden sm:block">
                Akhand Bhakti Sagar — Admin
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-saffron-600 transition-colors hidden sm:block"
              >
                View Site ↗
              </a>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center text-white text-sm font-bold">
                  {userEmail ? userEmail[0].toUpperCase() : 'A'}
                </div>
                <span className="text-sm text-gray-700 hidden md:block">{userEmail || 'Admin'}</span>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
