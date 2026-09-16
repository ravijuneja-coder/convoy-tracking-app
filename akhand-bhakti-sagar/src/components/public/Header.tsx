'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';

const navItems = [
  { label: 'होम', href: '/' },
  { label: 'भजन', href: '/bhajan' },
  { label: 'आरती', href: '/aarti' },
  { label: 'चालीसा', href: '/chalisa' },
  { label: 'मंत्र', href: '/mantra' },
  { label: 'स्तोत्र', href: '/stotra' },
  { label: 'भक्ति लेख', href: '/article' },
  { label: 'त्योहार', href: '/festival' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
        style={{
          background: 'linear-gradient(90deg, #4A0F0F 0%, #7B1B1B 40%, #4A0F0F 100%)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          top: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {/* Top accent strip */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg, #D4AF37, #FF6B00, #D4AF37)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex flex-col leading-tight group">
              <span
                className="text-xl sm:text-2xl font-bold tracking-wide"
                style={{
                  fontFamily: 'var(--font-devanagari)',
                  color: '#FFD700',
                  textShadow: '0 1px 8px rgba(212,175,55,0.4)',
                }}
              >
                🕉 अखंड भक्ति सागर
              </span>
              <span className="text-xs hidden sm:block" style={{ color: '#FFCBA4', letterSpacing: '0.08em' }}>
                भजन • आरती • चालीसा • मंत्र
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="मुख्य नेविगेशन">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 hover:text-yellow-300"
                  style={{
                    fontFamily: 'var(--font-devanagari)',
                    color: '#FFDDB0',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {searchOpen ? (
                <div className="hidden sm:block">
                  <SearchBar onClose={() => setSearchOpen(false)} autoFocus />
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="खोज खोलें"
                  className="p-2 rounded-full transition-colors hover:bg-white/10"
                  style={{ color: '#FFD700' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
                  </svg>
                </button>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 rounded-md transition-colors hover:bg-white/10"
                aria-label={menuOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
                aria-expanded={menuOpen}
                style={{ color: '#FFD700' }}
              >
                {menuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden flex flex-col"
          style={{ background: 'linear-gradient(160deg, #2D0A0A 0%, #4A0F0F 50%, #7B1B1B 100%)' }}
        >
          <div className="h-1" style={{ background: 'linear-gradient(90deg, #D4AF37, #FF6B00, #D4AF37)' }} />
          <div className="flex items-center justify-between px-4 h-16">
            <span
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD700' }}
            >
              🕉 अखंड भक्ति सागर
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="बंद करें"
              className="p-2"
              style={{ color: '#FFD700' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 pb-4">
            <SearchBar onClose={() => { setSearchOpen(false); setMenuOpen(false); }} />
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 text-xl rounded-lg mb-1 transition-colors hover:bg-white/10"
                style={{ fontFamily: 'var(--font-devanagari)', color: '#FFDDB0' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="px-6 py-6 text-center" style={{ color: 'rgba(255,220,176,0.5)', fontSize: '0.8rem', fontFamily: 'var(--font-devanagari)' }}>
            ॐ नमः शिवाय • हरे कृष्ण • जय माता दी
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16 pt-[env(safe-area-inset-top,0px)]" aria-hidden="true" />
    </>
  );
}
