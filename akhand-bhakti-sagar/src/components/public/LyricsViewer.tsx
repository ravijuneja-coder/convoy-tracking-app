'use client';

import { useState } from 'react';

interface LyricsViewerProps {
  lyrics: string;
  title?: string;
}

export default function LyricsViewer({ lyrics, title }: LyricsViewerProps) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const fontSizeMap = { sm: '1.05rem', md: '1.2rem', lg: '1.4rem' };

  const handleCopy = async () => {
    try {
      const text = title ? `${title}\n\n${lyrics}` : lyrics;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = title ? `${title}\n\n${lyrics}` : lyrics;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="hi">
      <head>
        <meta charset="UTF-8">
        <title>${title || 'भजन'}</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Noto Sans Devanagari', sans-serif; font-size: 14pt; line-height: 2; margin: 2cm; color: #1A0A00; }
          h1 { font-size: 18pt; color: #7B1B1B; margin-bottom: 1em; text-align: center; }
          pre { white-space: pre-wrap; font-family: inherit; font-size: inherit; }
          @media print { body { margin: 1.5cm; } }
        </style>
      </head>
      <body>
        ${title ? `<h1>${title}</h1>` : ''}
        <pre>${lyrics.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-4 py-3 gap-3 flex-wrap"
        style={{
          background: 'linear-gradient(90deg, #7B1B1B, #4A0F0F)',
          borderBottom: '2px solid var(--gold)',
        }}
      >
        <span
          className="text-sm font-semibold"
          style={{ fontFamily: 'var(--font-devanagari)', color: '#FFD700' }}
        >
          📿 गीत / बोल
        </span>

        <div className="flex items-center gap-2">
          {/* Font size */}
          <div className="flex items-center gap-1" role="group" aria-label="अक्षर आकार">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className="w-8 h-8 rounded-md text-xs font-bold transition-all"
                style={{
                  background: fontSize === s ? '#D4AF37' : 'rgba(255,255,255,0.12)',
                  color: fontSize === s ? '#2D0A0A' : '#FFDDB0',
                  fontSize: s === 'sm' ? '0.7rem' : s === 'md' ? '0.85rem' : '1rem',
                }}
                aria-label={`${s === 'sm' ? 'छोटे' : s === 'md' ? 'मध्यम' : 'बड़े'} अक्षर`}
                aria-pressed={fontSize === s}
              >
                अ
              </button>
            ))}
          </div>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              fontFamily: 'var(--font-devanagari)',
              background: copied ? '#16A34A' : 'rgba(212,175,55,0.2)',
              color: copied ? '#FFFFFF' : '#D4AF37',
              border: `1px solid ${copied ? '#16A34A' : 'rgba(212,175,55,0.3)'}`,
            }}
          >
            {copied ? '✓ कॉपी हो गया' : '📋 कॉपी करें'}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all"
            style={{
              fontFamily: 'var(--font-devanagari)',
              background: 'rgba(255,255,255,0.1)',
              color: '#FFDDB0',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            🖨️ प्रिंट
          </button>
        </div>
      </div>

      {/* Lyrics content */}
      <div
        className="p-6 sm:p-8"
        style={{ background: 'linear-gradient(180deg, #FFFBF5, #FDF6EC)' }}
      >
        <pre
          className="whitespace-pre-wrap break-words"
          style={{
            fontFamily: 'var(--font-devanagari)',
            fontSize: fontSizeMap[fontSize],
            lineHeight: '2.2',
            color: 'var(--color-text-primary)',
            letterSpacing: '0.01em',
          }}
        >
          {lyrics}
        </pre>
      </div>
    </div>
  );
}
