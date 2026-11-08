import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  Share2, 
  MessageSquare, 
  Calendar, 
  Quote, 
  AlertCircle,
  PlusCircle,
  X,
  CheckCircle,
  BookOpen,
  ChevronRight,
  User,
  Smartphone,
  Download,
  Video,
  Volume2
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext.tsx';
import Header from './components/Header.tsx';
import BreakingTicker from './components/BreakingTicker.tsx';
import LeadNews from './components/LeadNews.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import InvestigationLogo from './components/InvestigationLogo.tsx';
import NewsImage from './components/NewsImage.tsx';
import ArticleReaderModal from './components/ArticleReaderModal.tsx';
import AndroidInstallModal from './components/AndroidInstallModal.tsx';
import { NewsItem } from './types.ts';
import { JOYBARTA_SEED_POSTS } from './data/joybartaFacebookPosts.ts';

export default function App() {
  const { user } = useAuth();
  
  // Navigation & Category States
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin' || hash === '#/admin') {
        return 'admin';
      }
    }
    return 'all';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reader Modal State
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);

  // Android Standalone APK / PWA Modal State
  const [showAndroidModal, setShowAndroidModal] = useState(false);

  // Quick Post / News Publishing Modal State
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Form Fields (Journalist Joynal Bhai & Standard Publishing)
  const [postTitle, setPostTitle] = useState('');
  const [postCategory, setPostCategory] = useState('national');
  const [postAuthor, setPostAuthor] = useState('জয়নাল আবেদীন');
  const [postDate, setPostDate] = useState('০৫ নভেম্বর, ২০২৬');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [postBody, setPostBody] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postVideo, setPostVideo] = useState('');
  const [postQuote, setPostQuote] = useState('');

  // News Data States
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Handle URL change or history back/forward for /admin
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || hash === '#admin' || hash === '#/admin') {
        setActiveCategory('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const handleCategorySelect = (cat: string) => {
    if (cat === 'create_post') {
      setShowPublishForm(true);
      return;
    }
    setActiveCategory(cat);
    if (cat === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
  };

  // Convert English digits to Bengali digits
  const toBengaliNumber = (num: number | string): string => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(char => {
      const idx = parseInt(char);
      return !isNaN(idx) ? banglaDigits[idx] : char;
    }).join("");
  };

  // Fetch news from API
  const fetchNews = async () => {
    setLoadingNews(true);
    setNewsError(null);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setNewsList(data);
        } else {
          setNewsList([]);
        }
      } else {
        throw new Error('সংবাদ লোড করতে সমস্যা হয়েছে।');
      }
    } catch (err: any) {
      console.warn("API fallback to Joybarta posts:", err);
      setNewsList([...JOYBARTA_SEED_POSTS]);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Handle News Publishing
  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postBody.trim()) {
      alert('সংবাদের শিরোনাম ও বিস্তারিত বিবরণ প্রদান আবশ্যক।');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const categoriesMap: {[k: string]: string} = {
      national: 'জাতীয় সংবাদ',
      investigation: 'বিশেষ অনুসন্ধান',
      rights: 'জনস্বার্থ ও নাগরিক অধিকার',
      economy: 'অর্থনীতি ও কৃষি',
      environment: 'পরিবেশ ও জলবায়ু',
      opinion: 'মতামত ও সম্পাদকীয়'
    };

    const payload = {
      title: postTitle.trim(),
      excerpt: postExcerpt.trim() || (postBody.slice(0, 140) + '...'),
      body: postBody.trim(),
      category: postCategory,
      categoryLabel: categoriesMap[postCategory] || 'জাতীয় সংবাদ',
      author: postAuthor.trim() || 'জয়নাল আবেদীন',
      date: postDate.trim() || '০৫ নভেম্বর, ২০২৬',
      image: postImage.trim() || '', // If empty, clean text-only layout without any fake image
      videoUrl: postVideo.trim() || undefined,
      quote: postQuote.trim() || undefined
    };

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setPostTitle('');
        setPostExcerpt('');
        setPostBody('');
        setPostImage('');
        setPostVideo('');
        setPostQuote('');
        await fetchNews();
        setTimeout(() => {
          setShowPublishForm(false);
          setSubmitSuccess(false);
          setActiveCategory('all');
        }, 1000);
      } else {
        const err = await res.json();
        alert(`পাবলিশ ত্রুটি: ${err.error || 'ব্যর্থ হয়েছে'}`);
      }
    } catch (err: any) {
      alert(`সার্ভার ত্রুটি: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upvote/Like handler
  const handleLike = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const updatedItem = await res.json();
        setNewsList(prev => prev.map(item => item.id === id ? updatedItem : item));
        if (selectedArticle && selectedArticle.id === id) {
          setSelectedArticle(updatedItem);
        }
      }
    } catch (err) {
      console.error("Error liking article:", err);
    }
  };

  // Share handler
  const handleShare = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}/share`, { method: 'POST' });
      if (res.ok) {
        const updatedItem = await res.json();
        setNewsList(prev => prev.map(item => item.id === id ? updatedItem : item));
        if (selectedArticle && selectedArticle.id === id) {
          setSelectedArticle(updatedItem);
        }
        navigator.clipboard?.writeText?.(window.location.origin + `?news=${id}`);
        alert('সংবাদের লিংকটি কপি করা হয়েছে!');
      }
    } catch (err) {
      console.error("Error sharing article:", err);
    }
  };

  // Breaking & headline ticker items
  const breakingNewsItems = newsList.length > 0 
    ? (newsList.filter(item => item.isBreaking || item.categoryLabel?.includes('ব্রেকিং')).length > 0
        ? newsList.filter(item => item.isBreaking || item.categoryLabel?.includes('ব্রেকিং'))
        : newsList.slice(0, 6))
    : [];

  // Filter news list by category & search query
  const filteredNews = newsList.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'investigation') return matchesSearch && (item.category === 'investigation' || item.categoryLabel?.includes('অনুসন্ধান'));
    if (activeCategory === 'rights') return matchesSearch && (item.category === 'rights' || item.categoryLabel?.includes('অধিকার') || item.categoryLabel?.includes('স্বাস্থ্য'));
    if (activeCategory === 'economy') return matchesSearch && (item.category === 'economy' || item.categoryLabel?.includes('অর্থনীতি') || item.categoryLabel?.includes('কৃষি'));
    if (activeCategory === 'environment') return matchesSearch && (item.category === 'environment' || item.categoryLabel?.includes('পরিবেশ'));

    return matchesSearch && item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-[#0f3d2e] selection:text-white">
      {/* Top Header & Brand Masthead */}
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={handleCategorySelect} 
        onSearch={(query) => setSearchQuery(query)} 
        onOpenAndroidInstall={() => setShowAndroidModal(true)}
      />

      {/* Breaking News Ticker */}
      <BreakingTicker 
        breakingNewsList={breakingNewsItems} 
        onSelectArticle={(text) => setSearchQuery(text)} 
      />

      {/* Main Newspaper Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6" id="main-content">
        
        {activeCategory === 'admin' ? (
          <AdminPanel 
            newsList={newsList}
            onRefreshNews={fetchNews}
            aggregatorStatus={{
              lastRun: "০৫ নভেম্বর, ২০২৬",
              success: true,
              addedCount: newsList.length,
              log: ["সাংবাদিক জয়নাল ভাইয়ের সম্পাদকীয় ডেস্ক সচল ও প্রস্তুত।"],
              isProcessing: false
            }}
            onTriggerAggregation={async () => { await fetchNews(); }}
          />
        ) : (
          <div className="space-y-6">
            
            {/* Editorial Statement / Slogan Masthead */}
            <div className="bg-[#0f3d2e] border-l-4 border-red-600 text-white p-4 sm:p-5 rounded-xs shadow-xs flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-white rounded p-0.5 shrink-0 flex items-center justify-center shadow-xs">
                  <img src="/joybarta-logo.jpg" alt="জয়বার্তা" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif text-lg md:text-xl font-black text-white">
                      জয়বার্তা
                    </span>
                    <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-xs uppercase tracking-wide">
                      জাতীয় অনলাইন দৈনিক
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100 mt-0.5 max-w-2xl leading-relaxed">
                    "সত্যের সন্ধানে প্রতিদিন" — সম্পাদক ও প্রকাশক: জয়নাল আবেদীন। বস্তুনিষ্ঠ সাংবাদিকতায় জনগণের বিশ্বস্ত কণ্ঠস্বর।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowPublishForm(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xs inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-emerald-400"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>নতুন সংবাদ প্রকাশ</span>
                </button>

                <button
                  onClick={() => setShowAndroidModal(true)}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3.5 py-2 rounded-xs inline-flex items-center gap-1.5 transition-all shadow-xs cursor-pointer border border-red-400"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Android অ্যাপ</span>
                </button>
              </div>
            </div>

            {/* Featured Lead Story (Only on 'all' / Home and without active search query) */}
            {activeCategory === 'all' && !searchQuery && newsList.length > 0 && (
              <LeadNews 
                newsList={newsList}
                onLike={handleLike}
                onShare={handleShare}
                onSelectArticle={(article) => {
                  setAutoPlayAudio(false);
                  setSelectedArticle(article);
                }}
                onListenArticle={(article) => {
                  setAutoPlayAudio(true);
                  setSelectedArticle(article);
                }}
              />
            )}

            {/* Serial-by-Serial News Stream Section */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b-2 border-[#0f3d2e] pb-2 mb-4 gap-2">
                <h2 className="text-sm md:text-base font-black text-[#0f3d2e] uppercase tracking-wide flex items-center gap-2 font-serif">
                  <span className="w-3 h-3 bg-red-600 inline-block"></span>
                  {activeCategory === 'all' ? 'ধারাবাহিক সকল প্রকাশিত সংবাদ' : 
                   activeCategory === 'investigation' ? 'বিশেষ অনুসন্ধানী প্রতিবেদন' :
                   activeCategory === 'rights' ? 'জনস্বার্থ ও নাগরিক অধিকার' : 
                   activeCategory === 'economy' ? 'অর্থনীতি ও কৃষি সংবাদ' :
                   activeCategory === 'environment' ? 'পরিবেশ ও জলবায়ু' :
                   'জয়বার্তা সংবাদ'}
                </h2>
                
                <div className="flex items-center gap-2">
                  {searchQuery && (
                    <span className="text-xs text-slate-700 font-bold bg-white border border-slate-300 px-2 py-0.5 rounded-xs">
                      অনুসন্ধান: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="ml-1 text-red-600 font-black cursor-pointer">×</button>
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-emerald-900 font-bold bg-emerald-100/70 border border-emerald-200 px-2.5 py-0.5 rounded-xs">
                    মোট: {toBengaliNumber(filteredNews.length)} টি সংবাদ
                  </span>
                </div>
              </div>

              {loadingNews ? (
                <div className="text-center py-12 space-y-2 bg-white border border-slate-200">
                  <div className="w-8 h-8 border-4 border-[#0f3d2e] border-t-red-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-600 font-bold">সংবাদ লোড হচ্ছে...</p>
                </div>
              ) : newsError ? (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-center space-y-2 max-w-md mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                  <p className="text-xs font-bold text-red-950">{newsError}</p>
                  <button 
                    onClick={fetchNews}
                    className="bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold text-xs px-3.5 py-1.5 transition-all cursor-pointer rounded-xs"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                </div>
              ) : filteredNews.length === 0 ? (
                /* Ready State Dedicated to Journalist Joynal Bhai */
                <div className="bg-white border border-slate-200 p-8 text-center space-y-4 rounded-xs shadow-2xs max-w-xl mx-auto my-6">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-[#0f3d2e]">
                    <Smartphone className="w-8 h-8 text-emerald-700" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-slate-900 font-serif">
                      সাংবাদিক জয়নাল ভাইয়ের কন্ট্রোল ড্যাশবোর্ড প্রস্তুত
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      কোনো কাল্পনিক সংবাদ রাখা হয়নি। জয়নাল ভাইয়ের পেজের যেকোনো বাস্তব পোস্ট, ছবি বা ভিডিও হুবহু এখানে প্রকাশ করতে নিচের বাটনে ক্লিক করুন অথবা অ্যান্ড্রয়েড ফোনে স্ট্যান্ডঅ্যালন অ্যাপটি ইনস্টল করে নিন।
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={() => setShowPublishForm(true)}
                      className="bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold text-xs px-4 py-2.5 rounded-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>সংবাদ প্রকাশ করুন</span>
                    </button>
                    <button
                      onClick={() => setShowAndroidModal(true)}
                      className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs border border-red-400"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Android অ্যাপ ইনস্টল করুন</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Authentic Newspaper Articles Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredNews.map((item, index) => (
                    <article 
                      key={item.id} 
                      className="bg-white border border-slate-200 hover:border-[#0f3d2e] transition-all duration-200 flex flex-col justify-between p-4 shadow-2xs rounded-xs group"
                      id={`news-card-${item.id}`}
                    >
                      <div>
                        {/* Kicker / Serial Number & Dateline */}
                        <div className="flex justify-between items-center mb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 border border-slate-200 rounded-xs">
                              সংবাদ #{toBengaliNumber(index + 1)}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 tracking-wide rounded-xs ${
                              item.isBreaking ? 'bg-red-600 text-white' :
                              item.categoryLabel?.includes('অনুসন্ধান') ? 'bg-[#0f3d2e] text-white' :
                              'bg-slate-800 text-white'
                            }`}>
                              {item.categoryLabel || 'সংবাদ'}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {item.date}
                          </span>
                        </div>

                        {/* Real Photo Only (If no image, this block is completely skipped - NO fake images) */}
                        {item.image && item.image.trim() !== '' && (
                          <div 
                            className="mb-3 overflow-hidden border border-slate-300 bg-slate-100 rounded-xs flex items-center justify-center cursor-pointer p-1"
                            onClick={() => {
                              setAutoPlayAudio(false);
                              setSelectedArticle(item);
                            }}
                          >
                            <NewsImage 
                              src={item.image} 
                              alt={item.title} 
                              aspectRatio="auto"
                              objectFit="contain"
                              maxHeight="max-h-[260px]"
                              className="w-auto max-w-full hover:scale-102 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Video indicator if video is present */}
                        {item.videoUrl && item.videoUrl.trim() !== '' && (
                          <div 
                            className="mb-2 bg-slate-900 text-white text-[11px] p-2 flex items-center gap-1.5 rounded-xs cursor-pointer"
                            onClick={() => setSelectedArticle(item)}
                          >
                            <Video className="w-3.5 h-3.5 text-red-500" />
                            <span>ভিডিও সংযুক্ত রয়েছে (দেখতে ক্লিক করুন)</span>
                          </div>
                        )}

                        {/* Headline */}
                        <h3 
                          onClick={() => setSelectedArticle(item)}
                          className="text-base font-black text-slate-950 leading-snug font-serif hover:text-[#0f3d2e] transition-colors cursor-pointer mb-2"
                        >
                          {item.title}
                        </h3>

                        {/* Reporter byline */}
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold mb-2">
                          <User className="w-3 h-3 text-emerald-700" />
                          <span>{item.author || 'জয়নাল আবেদীন'}</span>
                        </div>

                        {/* Excerpt / Lead */}
                        <p className="text-xs text-slate-700 text-justify leading-relaxed mb-3 line-clamp-3">
                          {item.excerpt}
                        </p>

                        {/* Quote if present */}
                        {item.quote && (
                          <div className="bg-emerald-50/70 border-l-3 border-[#0f3d2e] p-2.5 my-2.5 relative italic text-[11px] text-slate-800 leading-relaxed text-justify font-serif">
                            <Quote className="w-3.5 h-3.5 text-emerald-400 absolute -top-1 -left-1 opacity-70" />
                            <p className="font-semibold">"{item.quote}"</p>
                          </div>
                        )}
                      </div>

                      {/* Footer Action Bar */}
                      <div className="mt-4 border-t border-slate-200 pt-2.5">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 pb-2 border-b border-slate-100 font-bold">
                          <span>{item.likes} জন সহমত</span>
                          <span>{item.comments?.length || 0} মতামত • {item.shares} শেয়ার</span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setAutoPlayAudio(false);
                                setSelectedArticle(item);
                              }}
                              className="bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold text-xs px-3 py-1.5 rounded-xs inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                              <span>পূর্ণাঙ্গ সংবাদ</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setAutoPlayAudio(true);
                                setSelectedArticle(item);
                              }}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs px-2.5 py-1.5 rounded-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="সংবাদ পাঠিকার কণ্ঠে শুনুন"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-rose-600" />
                              <span>শুনুন</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1 text-xs">
                            <button 
                              onClick={() => handleLike(item.id)}
                              className="p-1.5 text-slate-600 hover:text-[#0f3d2e] hover:bg-slate-100 rounded-xs transition-colors cursor-pointer"
                              title="সহমত"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleShare(item.id)}
                              className="p-1.5 text-slate-600 hover:text-[#0f3d2e] hover:bg-slate-100 rounded-xs transition-colors cursor-pointer"
                              title="শেয়ার"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}

      </main>

      {/* Full Article Reader Modal */}
      {selectedArticle && (
        <ArticleReaderModal 
          article={selectedArticle}
          onClose={() => {
            setSelectedArticle(null);
            setAutoPlayAudio(false);
          }}
          onLike={handleLike}
          onShare={handleShare}
          onArticleSelect={(art) => {
            setAutoPlayAudio(false);
            setSelectedArticle(art);
          }}
          relatedArticles={newsList.filter(n => n.id !== selectedArticle.id)}
          autoPlayAudio={autoPlayAudio}
        />
      )}

      {/* Android Standalone APK / PWA Modal */}
      <AndroidInstallModal 
        isOpen={showAndroidModal} 
        onClose={() => setShowAndroidModal(false)} 
      />

      {/* Quick News Publishing Modal */}
      {showPublishForm && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPublishForm(false);
          }}
        >
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-xs shadow-2xl border border-slate-300 p-6 space-y-4 my-6 font-sans">
            
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#0f3d2e]" />
                <h3 className="text-base font-black text-slate-950 font-serif">
                  সংবাদ প্রকাশ করুন (সাংবাদিক জয়নাল ভাই ডেস্ক)
                </h3>
              </div>
              <button 
                onClick={() => setShowPublishForm(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 text-xs font-bold flex items-center gap-2 rounded-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>সংবাদটি সফলভাবে জয়বার্তা পোর্টালে প্রকাশিত হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handlePublishSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  সংবাদের শিরোনাম (Headline) <span className="text-red-600">*</span>:
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="পোস্টের মূল শিরোনাম লিখুন..."
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] font-bold font-serif text-slate-900 rounded-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">বিভাগ / ক্যাটাগরি:</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-xs"
                  >
                    <option value="national">জাতীয় সংবাদ</option>
                    <option value="investigation">বিশেষ অনুসন্ধান</option>
                    <option value="rights">জনস্বার্থ ও নাগরিক অধিকার</option>
                    <option value="economy">অর্থনীতি ও কৃষি</option>
                    <option value="environment">পরিবেশ ও জলবায়ু</option>
                    <option value="opinion">মতামত ও সম্পাদকীয়</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">প্রতিবেদক:</label>
                  <input
                    type="text"
                    value={postAuthor}
                    onChange={(e) => setPostAuthor(e.target.value)}
                    placeholder="জয়নাল আবেদীন"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">তারিখ ও স্থান:</label>
                  <input
                    type="text"
                    value={postDate}
                    onChange={(e) => setPostDate(e.target.value)}
                    placeholder="০৫ নভেম্বর, ২০২৬"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    আসল ছবির লিংক (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    placeholder="ফেসবুক ছবির URL (ছবি না থাকলে খালি রাখুন)"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block italic">
                    * ছবি না থাকলে খালি রাখুন; কোনো কৃত্রিম ছবি আসবে না।
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    ভিডিও লিংক (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={postVideo}
                    onChange={(e) => setPostVideo(e.target.value)}
                    placeholder="ফেসবুক ভিডিও বা ইউটিউব ভিডিও URL"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  সংক্ষিপ্ত সারাংশ (Lead / Excerpt):
                </label>
                <textarea
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  placeholder="সংবাদের সূচনা বা সারসংক্ষেপ (ঐচ্ছিক)..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  মূল লেখার সম্পূর্ণ বিবরণ <span className="text-red-600">*</span>:
                </label>
                <textarea
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                  placeholder="ফেসবুক পোস্টের মূল লেখাটি হুবহু এখানে পেস্ট করুন (একটি শব্দও পরিবর্তন হবে না)..."
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-xs leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  উদ্ধৃতি বা বিশেষ বক্তব্য (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={postQuote}
                  onChange={(e) => setPostQuote(e.target.value)}
                  placeholder="যেমন: সত্যের সন্ধানে প্রতিদিন — জয়নাল আবেদীন।"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-xs italic"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xs cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold px-6 py-2 rounded-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'প্রকাশিত হচ্ছে...' : 'হুবহু প্রকাশ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Newspaper Footer */}
      <footer className="bg-[#081f17] text-slate-300 py-10 px-4 mt-16 border-t-4 border-red-600 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          {/* Column 1: Joybarta Brand & Motto */}
          <div className="space-y-3">
            <InvestigationLogo variant="footer" />
            <p className="text-xs text-slate-300 leading-relaxed text-justify mt-2 font-sans">
              "সত্যের সন্ধানে প্রতিদিন" — সত্য, ন্যায় ও বস্তুনিষ্ঠ সাংবাদিকতার প্রত্যয় নিয়ে প্রকাশিত জাতীয় অনলাইন দৈনিক সংবাদপত্র।
            </p>
          </div>

          {/* Column 2: Editorial & Publication Identity */}
          <div className="space-y-2.5">
            <h4 className="text-white text-xs font-black uppercase tracking-wider border-b border-emerald-900 pb-1.5 text-emerald-400 font-serif">
              সম্পাদকীয় ও পরিচালনা
            </h4>
            <div className="text-xs text-slate-300 space-y-1.5">
              <p><strong className="text-white">সম্পাদক ও প্রকাশক:</strong> জয়নাল আবেদীন (Joynal Abedin)</p>
              <p><strong className="text-white">প্রধান কার্যালয়:</strong> ঢাকা ও ময়মনসিংহ, বাংলাদেশ</p>
              <p><strong className="text-white">সম্পাদকীয় বিভাগ:</strong> desk@joybarta.com</p>
            </div>
          </div>

          {/* Column 3: Citizen Helplines & Mobile APK Notice */}
          <div className="space-y-2.5">
            <h4 className="text-white text-xs font-black uppercase tracking-wider border-b border-emerald-900 pb-1.5 text-emerald-400 font-serif">
              মোবাইল অ্যাপ ও নাগরিক সেবা
            </h4>
            <div className="text-xs leading-relaxed text-slate-300 space-y-1.5">
              <button 
                onClick={() => setShowAndroidModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs my-1"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android স্ট্যান্ডঅ্যালন অ্যাপ ডাউনলোড</span>
              </button>
              <p className="text-[11px] text-slate-400 pt-1">
                জরুরি পুলিশ ৯৯৯ | দুদক ১০৬ | তথ্য সেবা ৩৩৩
              </p>
              <p className="text-[11px] text-slate-400">
                জয়বার্তায় প্রকাশিত সংবাদের যাবতীয় স্বত্ব সংরক্ষিত।
              </p>
            </div>
          </div>

        </div>

        {/* Clean Copyright Bar */}
        <div className="max-w-7xl mx-auto border-t border-emerald-950 mt-8 pt-4 flex flex-wrap justify-between items-center text-[11px] text-slate-400 font-mono gap-2">
          <span>
            &copy; {new Date().getFullYear()} <strong className="text-slate-100">জয়বার্তা (Joybarta)</strong>. সর্বস্বত্ব সংরক্ষিত।
          </span>
          <span className="text-[10.5px] text-slate-300">
            সত্যের সন্ধানে প্রতিদিন | প্রকাশক ও সম্পাদক: জয়নাল আবেদীন
          </span>
        </div>
      </footer>
    </div>
  );
}
