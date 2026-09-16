'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const attemptsRef = useRef<{ count: number; lockedUntil: number }>({ count: 0, lockedUntil: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const state = attemptsRef.current;
    if (Date.now() < state.lockedUntil) {
      const mins = Math.ceil((state.lockedUntil - Date.now()) / 60000);
      setError(`Too many attempts. Try again in ${mins} minute(s).`);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        state.count += 1;
        if (state.count >= MAX_ATTEMPTS) {
          state.lockedUntil = Date.now() + LOCKOUT_MS;
          state.count = 0;
          setError('Too many failed attempts. Locked for 15 minutes.');
        } else {
          setError(data.error || 'Invalid credentials');
        }
        return;
      }

      state.count = 0;
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-cream-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕉️</div>
          <h1 className="text-2xl font-bold text-gray-900">Akhand Bhakti Sagar</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Login</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Sign in to continue</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white font-medium rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          🙏 Akhand Bhakti Sagar — Admin Panel
        </p>
      </div>
    </div>
  );
}
