import React from 'react';

interface LogoProps {
  variant?: 'header' | 'footer' | 'epaper' | 'large';
  className?: string;
}

export default function InvestigationLogo({ variant = 'header', className = '' }: LogoProps) {
  // SVG of a sharp, vigilant Vulture (শকুনির প্রতীকী লোগো - তীক্ষ্ণ দৃষ্টি ও দুর্নীতির ওপর নজরদারি)
  const VultureIcon = ({ sizeClass = "w-7 h-7" }: { sizeClass?: string }) => (
    <svg
      className={`${sizeClass} shrink-0`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Vulture Eyes Logo"
    >
      {/* Outer vigilance shield / ring */}
      <circle cx="24" cy="24" r="22" className="stroke-red-600" strokeWidth="2.5" strokeDasharray="3 2" />
      
      {/* Vulture stylized silhouette with keen eye and sharp hooked beak */}
      {/* Head & neck curve */}
      <path
        d="M13 36 C13 30, 16 26, 20 22 C23 19, 25 15, 25 11 C25 8, 28 6, 31 7 C34 8, 36 10, 36 14 C36 16, 38 18, 41 20 C42 21, 40 23, 37 23 C34 23, 31 22, 29 23 C25 25, 23 29, 21 36 Z"
        className="fill-slate-900"
      />
      {/* Sharp predatory hooked beak */}
      <path
        d="M36 14 C39 16, 43 18, 42 22 C40 23, 38 21, 36 19 Z"
        className="fill-red-600"
      />
      {/* Vigilant piercing eye (Vulture Eye) */}
      <circle cx="31" cy="13" r="3.2" className="fill-amber-400" />
      <circle cx="31.6" cy="12.8" r="1.5" className="fill-slate-950" />
      <circle cx="32" cy="12.3" r="0.5" className="fill-white" />
      
      {/* Wing feathers / investigative focus lines */}
      <path d="M12 36 L26 26" className="stroke-red-600" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 40 L28 29" className="stroke-slate-900" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 42 L32 32" className="stroke-red-600" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );

  if (variant === 'epaper') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-950 p-2 flex items-center justify-center border-2 border-red-600 shadow-sm">
            <VultureIcon sizeClass="w-9 h-9 md:w-10 md:h-10 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-black font-serif text-slate-950 tracking-tight leading-none">
              ভালচার আইস
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] md:text-xs font-mono font-black tracking-[0.25em] text-red-700 uppercase">
                VULTURE EYES
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[9px] md:text-[10.5px] font-bold text-slate-600">
                জাতীয় ও আন্তর্জাতিক অনুসন্ধানী অনলাইন দৈনিক
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'large') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-slate-950 flex items-center justify-center p-2.5 border-2 border-red-600 shadow-sm">
            <VultureIcon sizeClass="w-9 h-9" />
          </div>
          <div>
            <span className="text-3xl md:text-4xl font-black font-serif text-slate-950 tracking-tight block leading-none">
              ভালচার আইস
            </span>
            <span className="text-xs font-mono tracking-[0.25em] text-red-700 font-extrabold uppercase mt-1 block">
              VULTURE EYES
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-600 font-bold mt-2 tracking-wide text-center">
          দুর্নীতির ওপর তীক্ষ্ণ নজরদারি ও অনুসন্ধানী সাংবাদিকতা
        </p>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="w-10 h-10 bg-slate-900 border border-slate-700 p-1.5 flex items-center justify-center shrink-0">
          <VultureIcon sizeClass="w-7 h-7" />
        </div>
        <div className="flex flex-col leading-none text-left">
          <span className="text-xl font-black text-white font-serif tracking-tight">
            ভালচার আইস
          </span>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-red-500 uppercase mt-1">
            VULTURE EYES
          </span>
        </div>
      </div>
    );
  }

  // Header / Default compact
  return (
    <div className={`flex items-center gap-2.5 cursor-pointer select-none group ${className}`}>
      {/* Brand Icon with Vulture badge */}
      <div className="relative w-9 h-9 md:w-10 md:h-10 bg-slate-950 text-white flex items-center justify-center border-b-2 border-red-600 shrink-0 p-1 shadow-xs group-hover:border-red-500 transition-colors">
        <VultureIcon sizeClass="w-7 h-7" />
        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-red-600"></span>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg md:text-2xl font-black text-slate-950 font-serif tracking-tight group-hover:text-red-700 transition-colors">
            ভালচার আইস
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[8.5px] md:text-[9.5px] font-mono font-black tracking-[0.22em] text-red-700 uppercase">
            VULTURE EYES
          </span>
          <span className="hidden sm:inline text-[8px] text-slate-400">•</span>
          <span className="hidden sm:inline text-[8.5px] font-bold text-slate-500">
            অনুসন্ধানী সংবাদপত্র
          </span>
        </div>
      </div>
    </div>
  );
}
