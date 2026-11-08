import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Search, Menu, X, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import InvestigationLogo from './InvestigationLogo.tsx';

interface HeaderProps {
  onSearch: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onOpenAndroidInstall?: () => void;
}

export const JOYBARTA_FB_URL = "https://www.facebook.com/joynal.abedin.647594/";

export default function Header({ onSearch, activeCategory, setActiveCategory, onOpenAndroidInstall }: HeaderProps) {
  const { user, loginWithGoogle, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Bengali Digit conversion helper
  const toBengaliNumber = (num: string | number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      const bnMonths = [
        'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
        'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
      ];
      const bnDays = [
        'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
      ];

      const dayName = bnDays[now.getDay()];
      const day = toBengaliNumber(now.getDate());
      const month = bnMonths[now.getMonth()];
      const year = toBengaliNumber(now.getFullYear());
      
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'অপরাহ্ন' : 'পূর্বাহ্ন';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = toBengaliNumber(String(now.getMinutes()).padStart(2, '0'));
      const seconds = toBengaliNumber(String(now.getSeconds()).padStart(2, '0'));
      const hourStr = toBengaliNumber(hours);

      setCurrentDate(`${dayName}, ${day} ${month}, ${year}`);
      setCurrentTime(`${hourStr}:${minutes}:${seconds} ${ampm}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const navItems = [
    { id: 'all', label: 'প্রচ্ছদ' },
    { id: 'national', label: 'জাতীয়' },
    { id: 'investigation', label: 'বিশেষ অনুসন্ধান' },
    { id: 'rights', label: 'জনস্বার্থ ও নাগরিক অধিকার' },
    { id: 'economy', label: 'অর্থনীতি ও কৃষি' },
    { id: 'environment', label: 'পরিবেশ' },
    { id: 'create_post', label: '➕ নতুন সংবাদ প্রকাশ' },
    { id: 'admin', label: 'সম্পাদকীয় ড্যাশবোর্ড' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs font-sans">
      {/* Top Banner Info Bar */}
      <div className="bg-[#0b291e] text-slate-200 text-[10px] py-1.5 px-4 border-b border-emerald-950">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Leftside: Date, Location, Slogan */}
          <div className="flex items-center gap-3 font-medium text-slate-300">
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> ঢাকা, বাংলাদেশ
            </span>
            <span className="flex items-center gap-1 text-slate-100 font-bold">
              <Calendar className="w-3 h-3 text-red-400" />
              {currentDate || '০৫ নভেম্বর, ২০২৬'}
            </span>
            <span className="hidden sm:flex items-center gap-1 font-mono text-[9.5px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              {currentTime}
            </span>
            <span className="hidden md:inline text-emerald-800">|</span>
            <span className="hidden md:inline text-emerald-200 font-bold">
              জয়বার্তা: <span className="text-white font-extrabold">সত্যের সন্ধানে প্রতিদিন</span>
            </span>
          </div>

          {/* Right side: Subtle Social & Citizen Helplines */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <span className="text-slate-400 text-[9.5px]">নাগরিক সহায়তা:</span>
              <a href="tel:106" className="hover:text-red-400 font-bold text-amber-300 text-[10px]">দুদক ১০৬</a>
              <span className="text-emerald-900">|</span>
              <a href="tel:999" className="hover:text-emerald-400 font-bold text-slate-200 text-[10px]">জরুরি ৯৯৯</a>
            </div>

            {onOpenAndroidInstall && (
              <button
                onClick={onOpenAndroidInstall}
                className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-xs transition-all cursor-pointer shadow-2xs"
                title="সাংবাদিক জয়নাল ভাইয়ের জন্য স্ট্যান্ডঅ্যালন Android অ্যাপ"
              >
                <span>📲 Android App</span>
              </button>
            )}

            <div className="flex items-center gap-2 border-l border-emerald-900 pl-3">
              <a 
                href={JOYBARTA_FB_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-300 hover:text-white transition-colors"
                title="জয়বার্তা ফেসবুক পেজ"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Main Masthead Brand Row */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Left: Joybarta Brand Logo */}
        <div 
          className="flex items-center shrink-0 cursor-pointer" 
          onClick={() => setActiveCategory('all')}
          title="জয়বার্তা প্রচ্ছদ"
        >
          <InvestigationLogo variant="header" />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`px-3 py-1.5 font-bold text-[12px] transition-all duration-150 border-b-2 cursor-pointer whitespace-nowrap ${
                activeCategory === item.id
                  ? 'border-[#0f3d2e] text-[#0f3d2e] font-black bg-emerald-50/70'
                  : 'border-transparent text-slate-700 hover:text-[#0f3d2e] hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions (Search, Sign-in, Mobile Menu) */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-36 md:w-48 my-0.5">
            <input
              type="text"
              placeholder="জয়বার্তায় খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-xs pl-3 pr-8 py-1.5 border border-slate-300 focus:border-[#0f3d2e] focus:outline-none transition-all rounded-xs"
            />
            <button type="submit" className="absolute right-2.5 top-2 text-slate-400 hover:text-[#0f3d2e] cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* User Sign-in Control */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 px-2 py-1 text-slate-800 text-[10px] font-bold rounded-xs">
                  <UserIcon className="w-3 h-3 text-emerald-700" />
                  <span className="max-w-[70px] truncate">{user.displayName || user.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white font-bold text-[10px] px-2 py-1 transition-all cursor-pointer rounded-xs"
                >
                  <LogOut className="w-3 h-3" />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1 bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold text-[10.5px] px-3 py-1.5 transition-all cursor-pointer border border-[#0f3d2e] rounded-xs"
              >
                <LogIn className="w-3 h-3 text-emerald-300" />
                <span>লগইন</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-xs text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-50 border-t border-slate-200 py-3 px-4 space-y-1.5 animate-fadeIn">
          {onOpenAndroidInstall && (
            <button
              onClick={() => {
                onOpenAndroidInstall();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-xs mb-2 cursor-pointer shadow-xs"
            >
              <span>📲 জয়বার্তা Android অ্যাপ ইনস্টল করুন</span>
            </button>
          )}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveCategory(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-xs font-bold transition-all rounded-xs cursor-pointer ${
                activeCategory === item.id
                  ? 'bg-[#0f3d2e] text-white font-black'
                  : 'text-slate-800 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Auth Status */}
          <div className="border-t border-slate-200 pt-2.5 mt-2">
            {user ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 bg-slate-200 border border-slate-300 px-3 py-2 text-slate-800 text-[11px] font-bold rounded-xs">
                  <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="truncate">{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-red-700 text-white font-bold text-xs py-2 rounded-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  লগআউট করুন
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  loginWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 bg-[#0f3d2e] text-white font-bold text-xs py-2 rounded-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-300" />
                গুগল দিয়ে লগইন করুন
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
