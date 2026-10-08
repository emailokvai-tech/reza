import React from 'react';

interface LogoProps {
  variant?: 'header' | 'footer' | 'epaper' | 'large';
  className?: string;
}

export default function InvestigationLogo({ variant = 'header', className = '' }: LogoProps) {
  if (variant === 'epaper') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <div className="flex items-center gap-3">
          {/* Investigative Emblem */}
          <svg className="w-10 h-10 md:w-12 md:h-12 text-red-600 shrink-0" viewBox="0 0 48 48" fill="none">
            <circle cx="22" cy="22" r="14" stroke="#DC2626" strokeWidth="3" />
            <path d="M32 32L42 42" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
            <circle cx="22" cy="22" r="6" stroke="#0F172A" strokeWidth="2.5" />
            <path d="M22 10V14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 22H14" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 30V34" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            <path d="M30 22H34" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div className="text-left">
            <h1 className="text-3xl md:text-5xl font-black font-serif text-slate-950 tracking-tight leading-none">
              দি ইনভেস্টিগেশন
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] md:text-xs font-mono font-black tracking-[0.25em] text-red-700 uppercase">
                THE INVESTIGATION
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[9px] md:text-[10.5px] font-bold text-slate-600">
                জাতীয় অনুসন্ধানী দৈনিক
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
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-none flex items-center justify-center text-white shadow-sm">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <div>
            <span className="text-3xl md:text-4xl font-black font-serif text-slate-950 tracking-tight block leading-none">
              দি ইনভেস্টিগেশন
            </span>
            <span className="text-xs font-mono tracking-[0.25em] text-red-700 font-extrabold uppercase mt-1 block">
              THE INVESTIGATION
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-600 font-bold mt-2 tracking-wide">
          সত্যের সন্ধানে নির্ভীক অনুসন্ধানী সাংবাদিকতা
        </p>
      </div>
    );
  }

  // Header / Default compact
  return (
    <div className={`flex items-center gap-2.5 cursor-pointer select-none ${className}`}>
      {/* Brand Icon */}
      <div className="relative w-8 h-8 md:w-9 md:h-9 bg-slate-950 text-white flex items-center justify-center border-b-2 border-red-600 shrink-0">
        <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"></circle>
          <line x1="21" y1="21" x2="16" y2="16"></line>
          <path d="M11 8v6"></path>
          <path d="M8 11h6"></path>
        </svg>
        <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-red-600"></span>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1">
          <span className="text-lg md:text-2xl font-black text-slate-950 font-serif tracking-tight">
            দি ইনভেস্টিগেশন
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[8.5px] md:text-[9.5px] font-mono font-black tracking-[0.22em] text-red-700 uppercase">
            THE INVESTIGATION
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
