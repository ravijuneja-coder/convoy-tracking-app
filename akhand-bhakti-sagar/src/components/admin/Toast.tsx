'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const icons: Record<ToastVariant, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const colors: Record<ToastVariant, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-amber-500',
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg pointer-events-auto
              animate-slide-up min-w-[280px] max-w-sm ${colors[toast.variant]}`}
          >
            <span className="text-lg font-bold">{icons[toast.variant]}</span>
            <span className="flex-1 text-sm">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
