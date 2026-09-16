'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
  initialQuery?: string;
}

export default function SearchBar({ onClose, autoFocus, initialQuery = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex items-center gap-2 w-full"
    >
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="search"
          id="site-search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="भजन, आरती, चालीसा खोजें..."
          aria-label="साइट खोज"
          className="w-full px-4 py-2.5 pr-10 rounded-lg text-sm outline-none transition-all"
          style={{
            fontFamily: 'var(--font-devanagari)',
            background: 'rgba(255,255,255,0.12)',
            color: '#FFFFFF',
            border: '1px solid rgba(212,175,55,0.3)',
            '::placeholder': { color: 'rgba(255,220,176,0.6)' },
          } as React.CSSProperties}
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-1"
            aria-label="खोज साफ करें"
            style={{ color: 'rgba(255,220,176,0.6)' }}
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
        style={{
          fontFamily: 'var(--font-devanagari)',
          background: '#D4AF37',
          color: '#2D0A0A',
          whiteSpace: 'nowrap',
        }}
      >
        खोजें
      </button>
    </form>
  );
}
