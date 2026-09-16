'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  videoType?: string | null;
  videoUrl?: string | null;
  embedCode?: string | null;
  title?: string;
}

function getYouTubeEmbedUrl(url: string): string {
  if (!url) return '';
  // Already an embed URL
  if (url.includes('youtube.com/embed/')) return url;
  // youtu.be short URL
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;
  // Standard watch URL
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}?rel=0&modestbranding=1`;
  return url;
}

export default function VideoPlayer({ videoType, videoUrl, embedCode, title }: VideoPlayerProps) {
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (!videoUrl && !embedCode) return null;

  // If raw embed code is provided
  if (embedCode && videoType === 'embed') {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
        <div
          className="px-4 py-3 text-sm font-semibold"
          style={{
            background: 'linear-gradient(90deg, #7B1B1B, #4A0F0F)',
            color: '#FFD700',
            fontFamily: 'var(--font-devanagari)',
          }}
        >
          🎵 वीडियो
        </div>
        <div
          className="w-full"
          dangerouslySetInnerHTML={{ __html: embedCode }}
          style={{ aspectRatio: '16/9' }}
        />
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(videoUrl || '');
  if (!embedUrl) return null;

  // Extract video ID for thumbnail
  const videoIdMatch = embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);
  const videoId = videoIdMatch?.[1];
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
      {/* Header */}
      <div
        className="px-4 py-3 text-sm font-semibold flex items-center gap-2"
        style={{
          background: 'linear-gradient(90deg, #7B1B1B, #4A0F0F)',
          color: '#FFD700',
          fontFamily: 'var(--font-devanagari)',
          borderBottom: '2px solid var(--gold)',
        }}
      >
        ▶ वीडियो भजन
      </div>

      {/* Video area */}
      <div className="relative w-full" style={{ aspectRatio: '16/9', background: '#000' }}>
        {!playing && thumbnailUrl ? (
          /* Lazy preview */
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full flex items-center justify-center group"
            aria-label={`${title || 'वीडियो'} चलाएं`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={title || 'वीडियो थंबनेल'}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
            <div
              className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
              style={{ background: '#FF0000', boxShadow: '0 4px 24px rgba(255,0,0,0.5)' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </button>
        ) : (
          <iframe
            src={playing ? `${embedUrl}&autoplay=1` : embedUrl}
            title={title || 'भजन वीडियो'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            onLoad={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
        )}
      </div>
    </div>
  );
}
