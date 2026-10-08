import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { NewsItem } from '../types.ts';

interface BreakingTickerProps {
  onSelectArticle: (text: string) => void;
  breakingNewsList?: NewsItem[];
}

export default function BreakingTicker({ onSelectArticle, breakingNewsList = [] }: BreakingTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const defaultItems = [
    "মেঘনা পেট্রোলিয়ামের গোদনাইল ডিপো ইনচার্জ মো: মাহবুবুর রহমান (ডিএস মাহবুব)-এর বিরুদ্ধে 'দি ইনভেস্টিগেশন'-এর সমন্বিত অনুসন্ধানী প্রতিবেদন প্রকাশিত।",
    "জ্বালানি খাতে ডিপো সিন্ডিকেট ও তেল কারচুপি বন্ধে উচ্চপর্যায়ের জাতীয় তদন্ত দল গঠনের জোর দাবি।",
    "বগুড়ার উপ-শহরে ৮ তলা হাবিবা টাওয়ার ও জলেশ্বরীতলায় সাদিয়া গার্ডেনের ফ্ল্যাট অর্জনের ভূমি রেকর্ড পর্যালোচনা।",
    "বাজারে নিত্যপণ্যের কৃত্রিম সংকট রুখতে দেশব্যাপী জেলা প্রশাসনের সাঁড়াশি অভিযান চলমান।",
    "ব্যাংকিং খাতে শীর্ষ খেলাপি ঋণ আদায়ে কঠোর আইনি ব্যবস্থা নেওয়ার চূড়ান্ত ঘোষণা কেন্দ্রীয় ব্যাংকের।"
  ];

  const items = breakingNewsList.length > 0
    ? breakingNewsList.map(n => n.title)
    : defaultItems;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const currentHeadline = items[currentIndex] || items[0];

  return (
    <div className="bg-slate-100 border-y border-slate-300 py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Urgent/Breaking Label */}
        <div className="flex items-center gap-1.5 bg-red-600 text-white text-[10.5px] font-black uppercase px-2.5 py-0.5 rounded-none shadow-xs shrink-0 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          ব্রেকিং নিউজ
        </div>

        {/* Ticker text container */}
        <div className="flex-1 overflow-hidden relative h-5 flex items-center">
          <div 
            onClick={() => onSelectArticle(currentHeadline)}
            className="w-full text-xs font-bold text-slate-900 truncate hover:text-red-700 transition-all cursor-pointer font-serif"
            title={currentHeadline}
          >
            <span className="inline-block mr-1.5 text-red-600 font-extrabold">[তাজা খবর]</span>
            {currentHeadline}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrev}
            className="p-1 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all cursor-pointer"
            title="পূর্ববর্তী"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all cursor-pointer"
            title="পরবর্তী"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
