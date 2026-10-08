import React, { useState } from 'react';
import { Newspaper, Image as ImageIcon } from 'lucide-react';

interface NewsImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'wide' | 'square' | 'auto';
}

export default function NewsImage({
  src,
  alt,
  className = '',
  aspectRatio = 'video'
}: NewsImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'wide'
      ? 'aspect-[21/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : '';

  // Fallback if no src provided or image fails to load
  if (!src || error) {
    return (
      <div
        className={`w-full ${aspectClass} bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 select-none relative overflow-hidden group ${className}`}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:12px_12px]" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-1.5">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <Newspaper className="w-5 h-5 text-red-600" />
          </div>
          <span className="text-[11px] font-bold text-slate-600 line-clamp-1 max-w-[90%]">
            {alt || 'Vulture Eyes সংবাদ চিত্র'}
          </span>
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
            VULTURE EYES DESK
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-slate-200 border border-slate-200/80 ${className}`}
    >
      {/* Skeleton / Blur-up placeholder while loading */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse">
          <ImageIcon className="w-6 h-6 text-slate-400 opacity-60 animate-bounce" />
          <span className="text-[9.5px] font-mono text-slate-400 mt-1 font-bold">
            ছবি লোড হচ্ছে...
          </span>
        </div>
      )}

      {/* Actual image with smooth fade-in and scale-in */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-all duration-500 ease-out ${
          loaded
            ? 'opacity-100 scale-100 blur-0'
            : 'opacity-0 scale-105 blur-md'
        }`}
      />
    </div>
  );
}
