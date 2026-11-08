import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface NewsImageProps {
  src?: string;
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'wide' | 'square' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'auto';
  maxHeight?: string;
}

export default function NewsImage({
  src,
  alt,
  className = '',
  aspectRatio = 'auto',
  objectFit = 'contain',
  maxHeight = 'max-h-[520px]'
}: NewsImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Authentic newspaper photo renderer: returns null if no valid image is provided,
  // ensuring strict adherence to "no artificial or fake stock placeholder images" rule.
  if (!src || src.trim() === '' || error) {
    return null;
  }

  // Portrait photos (like historical figures and leaders) must never be cropped
  const isPortraitPhoto = src.includes('feee930b') || aspectRatio === 'portrait';

  const aspectClass =
    aspectRatio === 'video' && !isPortraitPhoto
      ? 'aspect-video'
      : aspectRatio === 'wide' && !isPortraitPhoto
      ? 'aspect-[21/9]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'portrait'
      ? 'aspect-[3/4]'
      : 'aspect-auto';

  const fitClass = (objectFit === 'contain' || isPortraitPhoto) ? 'object-contain' : 'object-cover';

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-slate-900/5 border border-slate-200/90 flex items-center justify-center ${className}`}
    >
      {/* Subtle loader while fetching actual image */}
      {!loaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-100 animate-pulse">
          <ImageIcon className="w-5 h-5 text-slate-300" />
        </div>
      )}

      {/* Authentic news photograph - Full uncropped resolution */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${maxHeight} w-auto max-w-full ${fitClass} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
