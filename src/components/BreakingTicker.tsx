import React, { useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

interface BreakingTickerProps {
  onSelectArticle: (text: string) => void;
}

export default function BreakingTicker({ onSelectArticle }: BreakingTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tickerItems = [
    "ময়মনসিংহের তথাকথিত নেত্রী স্বপ্না সরকার ও মেহেদী সিন্ডিকেটের অমানবিক ব্ল্যাকমেইল চক্রের বিরুদ্ধে প্রথমা আলোর বিশেষ অনুসন্ধান জারি।",
    "ছাত্রী মেসের অন্তরালে মাদক ও দেহ ব্যবসা সিন্ডিকেটের অবাধ বিচরণ; অতিষ্ঠ মতিঝিলের সচেতন অভিভাবক ও যুবসমাজ।",
    "ডিবি অফিসের মাসোহারা জাল ও বিগত সরকারের পুলিশ কর্মকর্তাদের টাকার আত্মীয়তার নাটক ফাঁস!",
    "যৌতুক ও পারিবারিক সহিংসতা দমনে আরামবাগে ফ্রি লিগ্যাল এইড কেন্দ্রের নতুন ডেস্ক চালু; অভিযোগ জানাতে পারবেন সরাসরি অনলাইনে।",
    "বাগেরহাট ও ঢাকায় বাল্যবিবাহ রুখে দিয়ে অনন্য দৃষ্টান্ত স্থাপন করল সাহসী কিশোরী দল।"
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tickerItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === tickerItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-slate-50 border-y border-slate-200 py-1.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Urgent/Breaking Label */}
        <div className="flex items-center gap-1 bg-red-600 text-white text-[10px] md:text-xs font-black uppercase px-2.5 py-0.5 rounded-none shadow-none shrink-0 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5" />
          ব্রেকিং নিউজ
        </div>

        {/* Ticker text container */}
        <div className="flex-1 overflow-hidden relative h-5 flex items-center">
          {/* We do a beautiful sliding transition or simple static selection */}
          <div className="w-full text-xs font-bold text-slate-900 truncate hover:text-purple-800 transition-all cursor-pointer">
            <span className="inline-block mr-1.5 text-red-600 font-extrabold">[জরুরি]</span>
            {tickerItems[currentIndex]}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handlePrev}
            className="p-1 rounded-none bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-all cursor-pointer"
            title="পূর্ববর্তী"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1 rounded-none bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition-all cursor-pointer"
            title="পরবর্তী"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
