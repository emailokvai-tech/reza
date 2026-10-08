import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  Share2, 
  MessageSquare, 
  Send, 
  Calendar, 
  Quote, 
  AlertCircle,
  ShieldAlert,
  Flame,
  FileText
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext.tsx';
import Header from './components/Header.tsx';
import BreakingTicker from './components/BreakingTicker.tsx';
import LeadNews from './components/LeadNews.tsx';
import EPaperSection from './components/EPaperSection.tsx';
import LegalConsultant from './components/LegalConsultant.tsx';
import SocialMediaFeed from './components/SocialMediaFeed.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import InvestigationLogo from './components/InvestigationLogo.tsx';
import NewsImage from './components/NewsImage.tsx';
import { NewsItem } from './types.ts';
import { LEAD_INVESTIGATIVE_ARTICLE } from './data/leadInvestigativeArticle.ts';

export default function App() {
  const { user } = useAuth();
  
  // Navigation & Filtering States
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

  // Update URL hash when category changes to /admin
  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'admin') {
      window.history.pushState(null, '', '/admin');
    } else if (window.location.pathname === '/admin') {
      window.history.pushState(null, '', '/');
    }
  };
  
  // News Data States
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Dynamic input states per article ID
  const [commentAuthors, setCommentAuthors] = useState<{[key: string]: string}>({});
  const [commentTexts, setCommentTexts] = useState<{[key: string]: string}>({});
  const [expandedComments, setExpandedComments] = useState<{[key: string]: boolean}>({});

  // Automation status tracker for administrative panel
  const [aggregatorStatus, setAggregatorStatus] = useState({
    lastRun: "০৭ অক্টোবর, ২০২৬",
    success: true,
    addedCount: 20,
    log: ["স্বয়ংক্রিয় আরএসএস ও অনুসন্ধানী সিন্ডিকেশন ইঞ্জিন প্রস্তুত।"],
    isProcessing: false
  });

  // Fetch news from the Express API
  const fetchNews = async () => {
    setLoadingNews(true);
    setNewsError(null);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setNewsList(data);
      } else {
        throw new Error('Failed to load articles from database.');
      }
    } catch (err: any) {
      console.warn("API unavailable or failed, using local fallback:", err);
      setNewsList([LEAD_INVESTIGATIVE_ARTICLE]);
    } finally {
      setLoadingNews(false);
    }
  };

  // Fetch News Aggregation tracker status
  const fetchAggregatorStatus = async () => {
    try {
      const res = await fetch('/api/admin/aggregation-status');
      if (res.ok) {
        const data = await res.json();
        setAggregatorStatus(data);
      }
    } catch (err) {
      console.error("Error fetching aggregator status:", err);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchAggregatorStatus();
  }, []);

  // Trigger News Aggregator from Admin Action
  const triggerAggregation = async () => {
    setAggregatorStatus(prev => ({ ...prev, isProcessing: true }));
    try {
      const res = await fetch('/api/admin/trigger-aggregation', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setAggregatorStatus(data);
        await fetchNews();
      }
    } catch (err: any) {
      console.error("Error triggering news aggregation:", err);
      setAggregatorStatus(prev => ({
        ...prev,
        isProcessing: false,
        log: [...prev.log, `ত্রুটি: ${err.message || err}`]
      }));
    }
  };

  // Upvote/Like handler
  const handleLike = async (id: string) => {
    try {
      const res = await fetch(`/api/news/${id}/like`, { method: 'POST' });
      if (res.ok) {
        const updatedItem = await res.json();
        setNewsList(prev => prev.map(item => item.id === id ? updatedItem : item));
      }
    } catch (err) {
      console.error("Error liking article:", err);
    }
  };

  // Share handler
  const handleShare = async (id: string, url?: string) => {
    try {
      const res = await fetch(`/api/news/${id}/share`, { method: 'POST' });
      if (res.ok) {
        const updatedItem = await res.json();
        setNewsList(prev => prev.map(item => item.id === id ? updatedItem : item));
        navigator.clipboard?.writeText?.(url || window.location.href);
        alert('সংবাদের লিংকটি ক্লিপবোর্ডে কপি করা হয়েছে!');
      }
    } catch (err) {
      console.error("Error sharing article:", err);
    }
  };

  // Comment insertion handler
  const handleCommentSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();
    const author = commentAuthors[id]?.trim() || user?.displayName || user?.email?.split('@')[0] || 'নাগরিক পাঠক';
    const text = commentTexts[id]?.trim() || '';
    if (!text) return;

    try {
      const res = await fetch(`/api/news/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text })
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setNewsList(prev => prev.map(item => item.id === id ? updatedItem : item));
        setCommentAuthors(prev => ({ ...prev, [id]: '' }));
        setCommentTexts(prev => ({ ...prev, [id]: '' }));
      }
    } catch (err) {
      console.error("Error inserting comment:", err);
    }
  };

  // Breaking news items
  const breakingNewsItems = newsList.filter(item => item.isBreaking || item.categoryLabel?.includes('ব্রেকিং'));

  // Filter local state list by category & search query
  const filteredNews = newsList.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'breaking') return matchesSearch && (item.isBreaking || item.categoryLabel?.includes('ব্রেকিং'));
    if (activeCategory === 'investigative') return matchesSearch && (item.categoryLabel?.includes('অনুসন্ধান') || !item.isBreaking);
    if (activeCategory === 'rights') return matchesSearch && item.category === 'rights';

    return matchesSearch && item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Top Navigation & Brand Section */}
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={handleCategorySelect} 
        onSearch={(query) => setSearchQuery(query)} 
      />

      {/* Breaking News Ticker with Dynamic Live Headlines */}
      <BreakingTicker 
        breakingNewsList={breakingNewsItems} 
        onSelectArticle={(text) => setSearchQuery(text)} 
      />

      {/* Main Newspaper Layout Body */}
      <main className="max-w-7xl mx-auto px-4 py-6" id="main-content">
        
        {activeCategory === 'legal' ? (
          <LegalConsultant />
        ) : activeCategory === 'social' ? (
          <SocialMediaFeed />
        ) : activeCategory === 'admin' ? (
          <AdminPanel 
            newsList={newsList}
            onRefreshNews={fetchNews}
            aggregatorStatus={aggregatorStatus}
            onTriggerAggregation={triggerAggregation}
          />
        ) : (
          /* Newspaper Stories Section */
          <div className="space-y-6">
            
            {/* Featured Lead investigative news only when on homepage 'all' and no search filter */}
            {activeCategory === 'all' && !searchQuery && (
              <LeadNews 
                newsList={newsList}
                onLike={handleLike}
                onShare={handleShare}
                onRefresh={fetchNews}
              />
            )}

            {/* E-Paper reader section beautifully integrated on front page */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="my-6">
                <EPaperSection />
              </div>
            )}

            {/* General News Grid Header & Filter */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-950 pb-2 mb-4 gap-2">
                <h2 className="text-sm md:text-base font-black text-slate-950 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-600 inline-block"></span>
                  {activeCategory === 'all' ? 'সর্বশেষ সংগৃহীত সংবাদ ও অনুসন্ধানী প্রতিবেদন' : 
                   activeCategory === 'investigative' ? '৫টি বিশেষ অনুসন্ধানী প্রতিবেদন' : 
                   activeCategory === 'breaking' ? '১৫টি তাজা ব্রেকিং নিউজ (লাইভ আরএসএস ফিড)' : 
                   'জাতীয় ও জনস্বার্থ বার্তা'}
                </h2>
                
                <div className="flex items-center gap-2">
                  {searchQuery && (
                    <span className="text-xs text-slate-700 font-bold bg-white border border-slate-300 px-2 py-0.5">
                      অনুসন্ধান: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="ml-1 text-red-600 font-black cursor-pointer">×</button>
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-slate-600 font-bold bg-slate-200 px-2 py-0.5">
                    মোট: {filteredNews.length} টি সংবাদ
                  </span>
                </div>
              </div>

              {loadingNews ? (
                <div className="text-center py-12 space-y-2 bg-white border border-slate-200">
                  <div className="w-8 h-8 border-4 border-slate-900 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-600 font-bold">সংবাদ ডাটাবেজ থেকে লোড হচ্ছে...</p>
                </div>
              ) : newsError ? (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-center space-y-2 max-w-md mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                  <p className="text-xs font-bold text-red-950">{newsError}</p>
                  <button 
                    onClick={fetchNews}
                    className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 transition-all cursor-pointer"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="bg-white border border-slate-200 p-8 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-900">কোনো সংবাদ পাওয়া যায়নি।</p>
                  <p className="text-[11px] text-slate-500">অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredNews.map((item) => (
                    <article 
                      key={item.id} 
                      className="bg-white border border-slate-200 hover:border-slate-800 transition-all duration-200 flex flex-col justify-between p-4 shadow-2xs"
                      id={`news-card-${item.id}`}
                    >
                      <div>
                        {/* News Category Badge & Time */}
                        <div className="flex justify-between items-center mb-2.5">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 tracking-wide ${
                            item.isBreaking ? 'bg-red-600 text-white' :
                            item.categoryLabel?.includes('অনুসন্ধান') ? 'bg-slate-950 text-white' :
                            'bg-slate-800 text-white'
                          }`}>
                            {item.categoryLabel || 'সংবাদ'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {item.date}
                          </span>
                        </div>

                        {/* News Card Featured Image with Skeleton / Blur-up */}
                        <div className="mb-3 overflow-hidden border border-slate-200">
                          <NewsImage 
                            src={item.image} 
                            alt={item.title} 
                            aspectRatio="video" 
                            className="w-full hover:scale-103 transition-transform duration-300"
                          />
                        </div>

                        {/* Title */}
                        <h3 className="text-sm md:text-[15px] font-black text-slate-950 leading-snug font-serif hover:text-red-700 transition-colors cursor-pointer mb-2">
                          {item.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-xs text-slate-700 text-justify leading-relaxed mb-3">
                          {item.excerpt}
                        </p>

                        {/* Highlighted Quote Callout block */}
                        {item.quote && (
                          <div className="bg-slate-50 border-l-3 border-red-600 p-2.5 my-3 relative italic text-[11px] text-slate-800 leading-relaxed text-justify font-serif">
                            <Quote className="w-4 h-4 text-red-300 absolute -top-1.5 -left-1 opacity-60" />
                            <p className="font-semibold">"{item.quote}"</p>
                          </div>
                        )}

                        {/* Collapsible details for full read */}
                        <details className="group border-t border-slate-100 pt-2.5 mt-2.5">
                          <summary className="text-[11px] font-black text-slate-900 hover:text-red-700 cursor-pointer flex items-center justify-between list-none">
                            <span>পূর্ণাঙ্গ প্রতিবেদন পড়ুন</span>
                            <span className="transition-transform group-open:rotate-180 text-xs font-mono">▼</span>
                          </summary>
                          <div className="text-[11px] md:text-xs text-slate-800 leading-relaxed text-justify space-y-2 mt-2 pt-2 border-t border-slate-50 font-sans whitespace-pre-line">
                            {item.body}
                            <div className="pt-2 text-[10px] text-slate-500 font-bold border-t border-slate-100 flex justify-between">
                              <span>প্রতিবেদক: {item.author}</span>
                              <span className="text-slate-600 font-mono">যাচাইকৃত ডেস্ক</span>
                            </div>
                          </div>
                        </details>
                      </div>

                      {/* Interactive Section */}
                      <div className="mt-4 border-t border-slate-200 pt-2.5">
                        {/* Engagement Statistics */}
                        <div className="flex justify-between items-center text-[10px] text-slate-500 pb-2 border-b border-slate-100 font-bold">
                          <span>{item.likes} জন সহমত</span>
                          <div className="flex gap-2">
                            <span>{item.comments?.length || 0} মতামত</span>
                            <span>•</span>
                            <span>{item.shares} শেয়ার</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center pt-2 text-xs font-bold text-slate-700">
                          <button 
                            onClick={() => handleLike(item.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-slate-600" /> সহমত
                          </button>
                          <button 
                            onClick={() => setExpandedComments(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-slate-600" /> মন্তব্য
                          </button>
                          <button 
                            onClick={() => handleShare(item.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                          >
                            <Share2 className="w-3.5 h-3.5 text-slate-600" /> শেয়ার
                          </button>
                        </div>

                        {/* Comments container */}
                        {expandedComments[item.id] && (
                          <div className="mt-3 bg-slate-50 p-2.5 border border-slate-200 space-y-2.5">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase">জনপ্রতিক্রিয়া:</h4>
                            
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                              {!item.comments || item.comments.length === 0 ? (
                                <p className="text-[9.5px] text-slate-500 italic">প্রথম মন্তব্যটি আপনার হোক।</p>
                              ) : (
                                item.comments.map((c) => (
                                  <div key={c.id} className="bg-white p-2 border border-slate-200 text-[10px] leading-relaxed">
                                    <div className="flex justify-between items-center mb-0.5">
                                      <span className="font-extrabold text-slate-900">{c.author}</span>
                                      <span className="text-[8px] text-slate-400 font-mono">{c.date}</span>
                                    </div>
                                    <p className="text-slate-700 text-justify">{c.text}</p>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Comment creation form */}
                            <form onSubmit={(e) => handleCommentSubmit(e, item.id)} className="space-y-1.5 pt-1.5 border-t border-slate-200">
                              <input 
                                type="text"
                                placeholder="আপনার নাম..."
                                value={commentAuthors[item.id] || ''}
                                onChange={(e) => setCommentAuthors(prev => ({ ...prev, [item.id]: e.target.value }))}
                                className="bg-white border border-slate-300 text-[10px] px-2 py-1 focus:outline-none w-full text-slate-800"
                                required
                              />
                              <div className="relative">
                                <input 
                                  type="text"
                                  placeholder="আপনার মতামত লিখুন..."
                                  value={commentTexts[item.id] || ''}
                                  onChange={(e) => setCommentTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="w-full bg-white border border-slate-300 text-[10px] pl-2 pr-8 py-1 focus:outline-none text-slate-800"
                                  required
                                />
                                <button type="submit" className="absolute right-1.5 top-1 text-slate-600 hover:text-slate-950 cursor-pointer">
                                  <Send className="w-3 h-3" />
                                </button>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Brand Footer Section - Clean GeneratePress Editorial Style */}
      <footer className="bg-slate-950 text-slate-300 py-12 px-4 mt-16 border-t-4 border-red-600 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          {/* Column 1: Brand & Identity */}
          <div className="space-y-3 md:col-span-1">
            <InvestigationLogo variant="footer" />
            <p className="text-xs text-slate-400 leading-relaxed text-justify mt-3 font-sans">
              দুর্নীতির বিরুদ্ধে আপসহীন অনুসন্ধানী সাংবাদিকতা। রাষ্ট্র ও জনগণের অধিকার প্রতিষ্ঠায় সর্বদা সোচ্চার ও নির্ভরযোগ্য তথ্যভাণ্ডার।
            </p>
            <div className="pt-2">
              <span className="inline-block bg-slate-900 border border-slate-800 text-red-400 text-[10px] font-mono font-bold px-2.5 py-1">
                VULTURE EYES INVESTIGATIVE DESK
              </span>
            </div>
          </div>
          
          {/* Column 2: Editorial & Publisher Panel */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider border-b border-slate-800 pb-1.5 text-red-500 font-serif">
              সম্পাদকীয় ও প্রকাশনা প্যানেল
            </h4>
            <div className="text-xs leading-relaxed text-slate-300 space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">সম্পাদক (Editor):</span>
                <p className="text-white font-extrabold text-[13px]">Tarek Anwar Khan</p>
              </div>
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">প্রকাশক (Publisher):</span>
                <p className="text-white font-extrabold text-[13px]">দেবাশীষ ঘোষ মিশু</p>
              </div>
              <div className="pt-1 text-[11px] text-slate-400">
                <p>বার্তা ও সম্পাদকীয় বিভাগ: <span className="font-mono text-slate-300">desk@vultureeyes.com</span></p>
                <p>হেড অফিস: লন্ডন ও ঢাকা</p>
              </div>
            </div>
          </div>

          {/* Column 3: UK Company Registration & Licensing */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider border-b border-slate-800 pb-1.5 text-red-500 font-serif">
              ইউকে কোম্পানি লাইসেন্স ও নিবন্ধন
            </h4>
            <div className="text-xs leading-relaxed text-slate-300 space-y-2">
              <div className="bg-slate-900 border border-slate-800 p-3 space-y-1.5">
                <p className="font-bold text-white text-[11.5px] leading-snug">
                  Operated under UK Company Registration No: <span className="text-amber-400 font-mono font-extrabold">17041560</span>
                </p>
                <p className="text-[10.5px] text-slate-400 font-mono">
                  (Registered in England & Wales)
                </p>
                <div className="pt-1.5 border-t border-slate-800">
                  <a 
                    href="https://find-and-update.company-information.service.gov.uk/company/17041560" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-[10.5px] px-3 py-1.5 transition-colors shadow-2xs"
                  >
                    <span>সরকারি ডাটাবেজে লাইসেন্স যাচাই</span>
                    <span className="font-mono text-xs">↗</span>
                  </a>
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                UK Companies House-এর অফিশিয়াল ডেজিগনেশনে পরিচালিত।
              </p>
            </div>
          </div>

          {/* Column 4: Policy & Anti-Corruption Commission Support */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider border-b border-slate-800 pb-1.5 text-red-500 font-serif">
              নীতিমালা ও আইনি অস্বীকৃতি
            </h4>
            <div className="space-y-2 text-justify">
              <div className="bg-slate-900/90 border-l-3 border-emerald-500 p-2.5 text-[11px] text-slate-200 leading-relaxed">
                <p className="font-bold text-emerald-400 text-[11.5px] mb-1">
                  নীতিমালা (Policy Disclaimer):
                </p>
                <p className="text-slate-300 font-medium">
                  "এটি দুর্নীতি দমন কমিশনের সাপোর্টিভ একটি প্রকাশনা সংস্থা।"
                </p>
              </div>
              <p className="text-[10.5px] leading-relaxed text-slate-400">
                সকল অনুসন্ধানী প্রতিবেদন অকাট্য দালিলিক প্রমাণের ভিত্তিতে জনস্বার্থে পরিবেশিত। তথ্যদাতার পূর্ণ নিরাপত্তা আন্তর্জাতিক হুইসেলব্লোয়ার সুরক্ষা নীতিমালার অধীন সংরক্ষিত।
              </p>
              <div className="text-[10px] text-slate-400 font-mono pt-1">
                জরুরি হটলাইন: দুদক ১০৬ | পুলিশ ৯৯৯
              </div>
            </div>
          </div>

        </div>

        {/* Clean GeneratePress-style copyright sub-footer */}
        <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-10 pt-4 flex flex-wrap justify-between items-center text-[11px] text-slate-400 font-mono gap-2">
          <span>
            &copy; {new Date().getFullYear()} <strong className="text-slate-200">Vulture Eyes (ভালচার আইস)</strong>. All rights reserved.
          </span>
          <span className="text-[10.5px]">
            UK Co Reg: 17041560 | সম্পাদক: Tarek Anwar Khan | প্রকাশক: দেবাশীষ ঘোষ মিশু
          </span>
        </div>
      </footer>
    </div>
  );
}
