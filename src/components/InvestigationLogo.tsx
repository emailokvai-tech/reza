import React, { useState } from 'react';

interface LogoProps {
  variant?: 'header' | 'footer' | 'epaper' | 'large' | 'card';
  className?: string;
  showSubtitle?: boolean;
}

export default function InvestigationLogo({ 
  variant = 'header', 
  className = '',
  showSubtitle = true 
}: LogoProps) {
  const [imgError, setImgError] = useState(false);
  const logoUrl = "/joybarta-logo.jpg";

  // SVG Fallback representing the Joybarta Emblem: Book, Pen Nib, and Red Flame
  const JoybartaSvg = ({ sizeClass = "w-8 h-8" }: { sizeClass?: string }) => (
    <svg 
      className={`${sizeClass} shrink-0`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="জয়বার্তা লোগো প্রতীক"
    >
      {/* Red Flame */}
      <path 
        d="M50 8 C44 20, 56 26, 48 36 C42 28, 38 20, 44 14 C36 22, 38 34, 46 42 C48 38, 52 34, 52 28 C56 34, 62 40, 58 48 C64 42, 66 32, 60 22 C56 16, 52 12, 50 8 Z" 
        fill="#dc2626" 
      />
      {/* Upward Pen Nib */}
      <path 
        d="M50 38 L62 58 L54 60 L54 68 L46 68 L46 60 L38 58 Z" 
        fill="#124835" 
        stroke="#ffffff" 
        strokeWidth="1.5" 
      />
      <circle cx="50" cy="54" r="2.5" fill="#ffffff" />
      <line x1="50" y1="54" x2="50" y2="40" stroke="#ffffff" strokeWidth="1.5" />
      
      {/* Open Book Pages */}
      <path 
        d="M50 68 C35 62, 20 64, 10 70 C22 78, 36 78, 50 84 C64 78, 78 78, 90 70 C80 64, 65 62, 50 68 Z" 
        fill="#0f3d2e" 
      />
      <path 
        d="M50 72 C37 66, 24 67, 14 72" 
        stroke="#22c55e" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path 
        d="M50 72 C63 66, 76 67, 86 72" 
        stroke="#22c55e" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
    </svg>
  );

  if (variant === 'epaper') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <div className="flex flex-col items-center gap-2">
          {!imgError ? (
            <img 
              src={logoUrl} 
              alt="জয়বার্তা" 
              onError={() => setImgError(true)}
              className="h-24 md:h-32 object-contain filter drop-shadow-sm" 
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#0f3d2e] rounded-md p-2 flex items-center justify-center border-2 border-emerald-600 shadow-sm">
                <JoybartaSvg sizeClass="w-12 h-12" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-black font-serif text-[#0f3d2e] tracking-tight leading-none">
                  জয়বার্তা
                </h1>
                <p className="text-xs md:text-sm font-bold text-red-600 tracking-wider mt-1">
                  সত্যের সন্ধানে প্রতিদিন
                </p>
              </div>
            </div>
          )}
          <div className="border-t-2 border-b border-[#0f3d2e] py-1 px-8 mt-1 w-full max-w-xl flex justify-between items-center text-[11px] font-bold text-slate-700">
            <span>জাতীয় দৈনিক সংবাদপত্র</span>
            <span className="text-red-600">•</span>
            <span>সত্যের সন্ধানে প্রতিদিন</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        {!imgError ? (
          <img 
            src={logoUrl} 
            alt="জয়বার্তা - সত্যের সন্ধানে প্রতিদিন" 
            onError={() => setImgError(true)}
            className="h-28 md:h-36 object-contain filter drop-shadow-md" 
          />
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#0f3d2e] rounded-lg flex items-center justify-center p-3 border-2 border-emerald-500 shadow-md mb-2">
              <JoybartaSvg sizeClass="w-16 h-16" />
            </div>
            <span className="text-3xl md:text-4xl font-black font-serif text-[#0f3d2e] tracking-tight block leading-none">
              জয়বার্তা
            </span>
            <span className="text-xs md:text-sm font-bold text-red-600 mt-1 block tracking-wider">
              সত্যের সন্ধানে প্রতিদিন
            </span>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="w-12 h-12 bg-white rounded-md p-1 border border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
          {!imgError ? (
            <img 
              src={logoUrl} 
              alt="জয়বার্তা" 
              onError={() => setImgError(true)}
              className="w-full h-full object-contain" 
            />
          ) : (
            <JoybartaSvg sizeClass="w-8 h-8" />
          )}
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="text-xl font-black text-white font-serif tracking-tight">
            জয়বার্তা
          </span>
          <span className="text-[10.5px] font-bold text-emerald-400 mt-1">
            সত্যের সন্ধানে প্রতিদিন
          </span>
        </div>
      </div>
    );
  }

  // Header / Default variant
  return (
    <div className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}>
      {/* Brand Icon or uploaded logo emblem */}
      <div className="relative h-11 md:h-12 flex items-center justify-center shrink-0">
        {!imgError ? (
          <img 
            src={logoUrl} 
            alt="জয়বার্তা লোগো" 
            onError={() => setImgError(true)}
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-103" 
          />
        ) : (
          <div className="w-10 h-10 bg-[#0f3d2e] rounded flex items-center justify-center p-1 border border-emerald-600">
            <JoybartaSvg sizeClass="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl md:text-2xl font-black text-[#0f3d2e] font-serif tracking-tight group-hover:text-red-700 transition-colors">
            জয়বার্তা
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] md:text-[10.5px] font-bold text-red-600">
              সত্যের সন্ধানে প্রতিদিন
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
