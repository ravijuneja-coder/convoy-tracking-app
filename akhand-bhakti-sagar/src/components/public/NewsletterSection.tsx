'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setStatus('error');
      setMessage('कृपया एक वैध ईमेल पता दर्ज करें।');
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('धन्यवाद! आप सफलतापूर्वक जुड़ गए हैं। भक्ति का आशीर्वाद आपके साथ हो! 🙏');
        setEmail('');
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setMessage(data.message || 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।');
      }
    } catch {
      setStatus('error');
      setMessage('नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <section
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, #2D0A0A 0%, #7B1B1B 50%, #4A0F0F 100%)',
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Decorative OM */}
        <div
          className="text-4xl mb-4"
          aria-hidden="true"
          style={{ color: '#D4AF37' }}
        >
          🕉
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold mb-3"
          style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD700', textWrap: 'balance' }}
        >
          नए भजन और आरती पाएं सीधे इनबॉक्स में
        </h2>
        <p
          className="text-sm sm:text-base mb-8"
          style={{ fontFamily: 'var(--font-devanagari)', color: 'rgba(255,220,176,0.75)' }}
        >
          रोज़ सुबह एक नया भजन या आरती आपके ईमेल पर। भक्ति में जुड़े रहें।
        </p>

        {status === 'success' ? (
          <div
            className="px-6 py-4 rounded-xl text-base font-medium"
            style={{
              fontFamily: 'var(--font-devanagari)',
              background: 'rgba(22,163,74,0.15)',
              color: '#86EFAC',
              border: '1px solid rgba(22,163,74,0.3)',
            }}
          >
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                ईमेल पता
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
                placeholder="आपका ईमेल पता..."
                required
                className="w-full px-5 py-3.5 rounded-lg text-sm outline-none transition-all"
                style={{
                  fontFamily: 'var(--font-devanagari)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  border: status === 'error' ? '2px solid #F87171' : '1px solid rgba(212,175,55,0.3)',
                  backdropFilter: 'blur(4px)',
                }}
                aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3.5 rounded-lg font-bold text-sm transition-all disabled:opacity-70 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                fontFamily: 'var(--font-devanagari)',
                background: '#D4AF37',
                color: '#2D0A0A',
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'loading' ? 'प्रतीक्षा करें...' : 'सदस्य बनें 🙏'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p
            id="newsletter-error"
            className="mt-2 text-sm"
            style={{ fontFamily: 'var(--font-devanagari)', color: '#FCA5A5' }}
            role="alert"
          >
            {message}
          </p>
        )}

        <p
          className="mt-4 text-xs"
          style={{ color: 'rgba(255,220,176,0.5)', fontFamily: 'var(--font-devanagari)' }}
        >
          हम आपकी जानकारी कभी साझा नहीं करेंगे। किसी भी समय सदस्यता रद्द करें।
        </p>
      </div>
    </section>
  );
}
