import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, PhoneCall, Search, Menu, X, ShieldAlert, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.tsx';
import InvestigationLogo from './InvestigationLogo.tsx';

interface HeaderProps {
  onSearch: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
}

export default function Header({ onSearch, activeCategory, setActiveCategory }: HeaderProps) {
  const { user, loginWithGoogle, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Bengali Digit conversion
  const toBengaliNumber = (num: string | number): string => {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
  };

  useEffect(() => {
    // Format Date & Time in Bengali
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
    { id: 'all', label: 'সব সংবাদ' },
    { id: 'investigative', label: 'বিশেষ অনুসন্ধান' },
    { id: 'breaking', label: '১৫টি ব্রেকিং নিউজ' },
    { id: 'rights', label: 'জাতীয় ও জনস্বার্থ' },
    { id: 'legal', label: 'আইনি সহায়তা ও লিগ্যাল এইড' },
    { id: 'social', label: 'সোশ্যাল ও পাবলিক ভয়েস' },
    { id: 'admin', label: 'এডমিন ও অটোমেশন' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      {/* Top Banner Information Bar with Publisher Credits */}
      <div className="bg-slate-950 text-slate-200 text-[10px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Leftside info */}
          <div className="flex items-center gap-3 font-medium text-slate-300">
            <span className="text-red-500 font-extrabold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> ঢাকা
            </span>
            <span className="flex items-center gap-1 text-slate-200 font-bold">
              <Calendar className="w-3 h-3 text-red-400" />
              {currentDate || '০৭ অক্টোবর, ২০২৬'}
            </span>
            <span className="hidden sm:flex items-center gap-1 font-mono text-[9.5px] text-slate-400">
              <Clock className="w-3 h-3 text-slate-400" />
              {currentTime}
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300 font-bold">
              প্রকাশক: <strong className="text-white font-black">মেহেদী হাসান</strong>
            </span>
          </div>

          {/* Emergency Helplines */}
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-extrabold text-amber-400 flex items-center gap-1 text-[10px]">
              <ShieldAlert className="w-3.5 h-3.5" /> জরুরি হেল্পলাইন:
            </span>
            <span className="text-slate-400 text-[9.5px]">দুদক:</span>
            <a href="tel:106" className="hover:text-red-400 transition-colors font-black text-amber-300">১০৬</a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[9.5px]">পুলিশ:</span>
            <a href="tel:999" className="hover:text-emerald-400 transition-colors font-black">৯৯৯</a>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 text-[9.5px]">লিগ্যাল এইড:</span>
            <a href="tel:16430" className="hover:text-emerald-400 transition-colors font-black">১৬৪৩০</a>
          </div>
        </div>
      </div>

      {/* Unified Brand, Navigation & Actions Row */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Left: Investigation Brand Logo */}
        <div className="flex items-center shrink-0" onClick={() => setActiveCategory('all')}>
          <InvestigationLogo variant="header" />
        </div>

        {/* Center: Desktop Navigation Links (Hidden on mobile) */}
        <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveCategory(item.id)}
              className={`px-2.5 py-1.5 rounded-none font-bold text-[11px] transition-all duration-150 border-b-2 uppercase tracking-wide cursor-pointer whitespace-nowrap ${
                activeCategory === item.id
                  ? 'border-red-600 text-slate-950 font-black bg-slate-100'
                  : 'border-transparent text-slate-700 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right: Actions (Search, Login, Mobile Menu Trigger) */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-36 md:w-48 my-0.5">
            <input
              type="text"
              placeholder="অনুসন্ধান করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 text-xs rounded-none pl-3 pr-8 py-1.5 border border-slate-300 focus:border-red-600 focus:outline-none transition-all"
            />
            <button type="submit" className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-950 cursor-pointer">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* User Sign-in Control */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-slate-100 border border-slate-300 px-2 py-1 text-slate-800 text-[10px] font-bold">
                  <UserIcon className="w-3 h-3 text-red-600" />
                  <span className="max-w-[70px] truncate">{user.displayName || user.email?.split("@")[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white font-bold text-[10px] px-2 py-1 transition-all cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                  <span>লগআউট</span>
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1 bg-slate-950 hover:bg-slate-800 text-white font-bold text-[10.5px] px-3 py-1.5 transition-all cursor-pointer border border-slate-900"
              >
                <LogIn className="w-3 h-3 text-red-500" />
                <span>লগইন</span>
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-100 border-t border-slate-200 py-2 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveCategory(item.id);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-none text-xs font-bold transition-all ${
                activeCategory === item.id
                  ? 'bg-slate-950 text-white font-black'
                  : 'text-slate-800 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Mobile Auth Status */}
          <div className="border-t border-slate-200 pt-2 mt-2">
            {user ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 bg-slate-200 border border-slate-300 px-3 py-2 text-slate-800 text-[11px] font-bold">
                  <UserIcon className="w-3.5 h-3.5 text-red-600" />
                  <span className="truncate">{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-red-700 text-white font-bold text-xs py-2"
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
                className="w-full flex items-center justify-center gap-1.5 bg-slate-950 text-white font-bold text-xs py-2"
              >
                <LogIn className="w-3.5 h-3.5 text-red-400" />
                গুগল দিয়ে লগইন করুন
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
