import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  Share2, 
  MessageSquare, 
  Send, 
  Calendar, 
  Quote, 
  AlertCircle, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from './contexts/AuthContext.tsx';
import Header from './components/Header.tsx';
import BreakingTicker from './components/BreakingTicker.tsx';
import LeadNews from './components/LeadNews.tsx';
import EPaperSection from './components/EPaperSection.tsx';
import LegalConsultant from './components/LegalConsultant.tsx';
import SocialMediaFeed from './components/SocialMediaFeed.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import { NewsItem } from './types.ts';

export default function App() {
  const { user } = useAuth();
  
  // Navigation & Filtering States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // News Data States
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // Dynamic input states per article ID
  const [commentAuthors, setCommentAuthors] = useState<{[key: string]: string}>({});
  const [commentTexts, setCommentTexts] = useState<{[key: string]: string}>({});
  const [expandedComments, setExpandedComments] = useState<{[key: string]: boolean}>({});

  // Aggregator status tracker for administrative panel
  const [aggregatorStatus, setAggregatorStatus] = useState({
    lastRun: "কখনো নয়",
    success: false,
    addedCount: 0,
    log: ["সিস্টেম এখনো প্রথম অ্যাগ্রিগেশন সম্পন্ন করেনি।"],
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
      console.error("Error fetching news:", err);
      setNewsError("সংবাদ লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
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
        await fetchNews(); // Reload fresh database news articles
      }
    } catch (err: any) {
      console.error("Error triggering news aggregation:", err);
      setAggregatorStatus(prev => ({
        ...prev,
        isProcessing: false,
        log: [...prev.log, `Error: ${err.message || err}`]
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
    const author = commentAuthors[id]?.trim() || user?.displayName || user?.email?.split('@')[0] || 'ভিজিটর ইউজার';
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

  // Filter local state list by category & search query
  const filteredNews = newsList.filter(item => {
    const matchesSearch = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Top Navigation & Brand Section */}
      <Header 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        onSearch={(query) => setSearchQuery(query)} 
      />

      {/* Breaking News Ticker */}
      <BreakingTicker onSelectArticle={(text) => setSearchQuery(text)} />

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
            
            {/* Featured Lead news only when on homepage 'all' and no active search query is applied */}
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

            {/* General News Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-red-600 rounded-none inline-block"></span>
                  {activeCategory === 'all' ? 'সব সংবাদ' : 
                   activeCategory === 'rights' ? 'অধিকার কথা' : 
                   activeCategory === 'deprived' ? 'বঞ্চিতের কান্না' : 'সফলতার গল্প'}
                </h3>
                {searchQuery && (
                  <span className="text-xs text-slate-500 font-bold bg-slate-100 border border-slate-200 px-2 py-0.5">
                    অনুসন্ধান: "{searchQuery}"
                  </span>
                )}
              </div>

              {loadingNews ? (
                <div className="text-center py-12 space-y-2">
                  <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-500 font-bold">সংবাদ লোড হচ্ছে...</p>
                </div>
              ) : newsError ? (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 text-center space-y-2 max-w-md mx-auto">
                  <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
                  <p className="text-xs font-bold text-red-950">{newsError}</p>
                  <button 
                    onClick={fetchNews}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-none border border-slate-900 transition-all cursor-pointer"
                  >
                    পুনরায় চেষ্টা করুন
                  </button>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="bg-white border border-slate-200 p-8 text-center space-y-2">
                  <p className="text-xs font-bold text-slate-900">কোনো সংবাদ পাওয়া যায়নি।</p>
                  <p className="text-[11px] text-slate-500">অনুগ্রহ করে অন্য কোনো বিষয় বা কি-ওয়ার্ড দিয়ে অনুসন্ধান করুন।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.map((item) => (
                    <article 
                      key={item.id} 
                      className="bg-white border border-slate-200 hover:border-slate-800 transition-all duration-200 flex flex-col justify-between p-4"
                      id={`news-card-${item.id}`}
                    >
                      <div>
                        {/* News Category Badge & Time */}
                        <div className="flex justify-between items-center mb-2.5">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 tracking-wide ${
                            item.category === 'rights' ? 'bg-blue-600 text-white' :
                            item.category === 'deprived' ? 'bg-red-600 text-white' :
                            item.category === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                          }`}>
                            {item.categoryLabel}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 font-semibold">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {item.date}
                          </span>
                        </div>

                        {item.image && (
                          <div className="mb-3 overflow-hidden border border-slate-200 aspect-[16/9] w-full bg-slate-50">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        {/* Title */}
                        <h4 className="text-sm md:text-base font-black text-slate-900 leading-snug font-serif hover:text-purple-900 transition-colors cursor-pointer mb-2">
                          {item.title}
                        </h4>

                        {/* Excerpt */}
                        <p className="text-xs text-slate-600 text-justify leading-relaxed mb-3">
                          {item.excerpt}
                        </p>

                        {/* Highlighted Quote Callout block */}
                        {item.quote && (
                          <div className="bg-slate-50 border-l-4 border-slate-900 p-2.5 my-3 relative italic text-[11px] text-slate-700 leading-relaxed text-justify font-serif">
                            <Quote className="w-4 h-4 text-slate-300 absolute -top-1.5 -left-1 opacity-60" />
                            <p className="font-semibold">"{item.quote}"</p>
                          </div>
                        )}

                        {/* Collapsible details for full read */}
                        <details className="group border-t border-slate-100 pt-2.5 mt-2.5">
                          <summary className="text-[11px] font-black text-slate-900 hover:text-purple-900 cursor-pointer flex items-center justify-between list-none">
                            <span>বিস্তারিত পড়ুন</span>
                            <span className="transition-transform group-open:rotate-180 text-xs font-mono">▼</span>
                          </summary>
                          <div className="text-[11px] md:text-xs text-slate-800 leading-relaxed text-justify space-y-2 mt-2 pt-2 border-t border-slate-50 font-sans whitespace-pre-line">
                            {item.body}
                            <div className="pt-2 text-[10px] text-slate-500 font-bold border-t border-slate-100 flex justify-between">
                              <span>লেখক: {item.author}</span>
                              {item.isAIExpanded && (
                                <span className="text-purple-700 font-mono uppercase tracking-wider flex items-center gap-1 font-semibold">
                                  <Sparkles className="w-3 h-3" /> এআই সিঙ্ক ও বর্ধিত
                                </span>
                              )}
                            </div>
                          </div>
                        </details>
                      </div>

                      {/* Interactive Section */}
                      <div className="mt-4 border-t border-slate-150 pt-2.5">
                        {/* Engagement Statistics */}
                        <div className="flex justify-between items-center text-[10px] text-slate-500 pb-2 border-b border-slate-100 font-bold">
                          <span>{item.likes} জন সহমত</span>
                          <div className="flex gap-2">
                            <span>{item.comments?.length || 0} মন্তব্য</span>
                            <span>•</span>
                            <span>{item.shares} শেয়ার</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center pt-2 text-xs font-black text-slate-700">
                          <button 
                            onClick={() => handleLike(item.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-150"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-slate-600 animate-none" /> সহমত
                          </button>
                          <button 
                            onClick={() => setExpandedComments(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-150"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-slate-600" /> মন্তব্য
                          </button>
                          <button 
                            onClick={() => handleShare(item.id)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-150"
                          >
                            <Share2 className="w-3.5 h-3.5 text-slate-600" /> শেয়ার
                          </button>
                        </div>

                        {/* Comments container drawer inside card */}
                        {expandedComments[item.id] && (
                          <div className="mt-3 bg-slate-50 p-2 border border-slate-200 animate-fade-in space-y-2.5">
                            <h5 className="text-[10px] font-black text-slate-900 uppercase">জনপ্রতিক্রিয়া কলাম:</h5>
                            
                            <div className="space-y-1.5 max-h-32 overflow-y-auto">
                              {!item.comments || item.comments.length === 0 ? (
                                <p className="text-[9px] text-slate-400 italic">এখনো কোনো মন্তব্য দেওয়া হয়নি। প্রথম মন্তব্যটি আপনার হোক।</p>
                              ) : (
                                item.comments.map((c) => (
                                  <div key={c.id} className="bg-white p-2 border border-slate-150 text-[10px] leading-relaxed">
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
                              <div className="grid grid-cols-2 gap-1.5">
                                <input 
                                  type="text"
                                  placeholder="আপনার নাম..."
                                  value={commentAuthors[item.id] || ''}
                                  onChange={(e) => setCommentAuthors(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="bg-white border border-slate-300 text-[10px] px-2 py-1 focus:outline-none w-full text-slate-800"
                                  required={!user}
                                  disabled={!!user}
                                />
                                <span className="text-[8px] text-slate-400 flex items-center italic">
                                  {user ? `* ${user.displayName || user.email} হিসেবে পোস্ট` : '* যাচাই সাপেক্ষে প্রকাশিত হবে'}
                                </span>
                              </div>
                              <div className="relative">
                                <input 
                                  type="text"
                                  placeholder="আপনার প্রতিবাদী প্রতিক্রিয়া বাংলা ভাষায় লিখুন..."
                                  value={commentTexts[item.id] || ''}
                                  onChange={(e) => setCommentTexts(prev => ({ ...prev, [item.id]: e.target.value }))}
                                  className="w-full bg-white border border-slate-300 text-[10px] pl-2 pr-8 py-1 focus:outline-none text-slate-800"
                                  required
                                />
                                <button type="submit" className="absolute right-1.5 top-1 text-slate-600 hover:text-slate-900 cursor-pointer">
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

      {/* Brand Footer Section */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 mt-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <h4 className="text-white text-sm font-black uppercase tracking-wider">প্রথমা আলো</h4>
            <p className="text-[11px] leading-relaxed">
              সারাদেশের সর্বশেষ খবর ও বিশেষ অনুসন্ধানী প্রতিবেদনের নির্ভীক ও বস্তুনিষ্ঠ অনলাইন নিউজ পোর্টাল।
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-white text-sm font-black uppercase tracking-wider">সম্পাদনা ও প্রকাশনা</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              সম্পাদক: <strong className="text-slate-200">রেজাউল করিম</strong><br />
              প্রকাশক: <strong className="text-slate-200">শহিদুল ইসলাম উৎপল</strong><br />
              প্রধান কার্যালয়: মতিঝিল, আরামবাগ, মতিঝিল, ঢাকা, বাংলাদেশ।<br />
              ইমেল: contact@prothomaalo.org<br />
              জরুরি হটলাইন: ৯৯৯ (টোল-ফ্রি)
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-white text-sm font-black uppercase tracking-wider">আইনি সতর্কতা</h4>
            <p className="text-[11px] leading-relaxed text-slate-400">
              এই পোর্টালে প্রকাশিত সকল অনুসন্ধানী প্রতিবেদন ও বিশেষ সংবাদ জনস্বার্থে সংগৃহীত ও পরিবেশিত। এর অবৈধ নকল বা অননুমোদিত ব্যবহার আইনত দণ্ডনীয়।
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-6 pt-4 text-center text-[10px] text-slate-500 font-mono">
          &copy; {new Date().getFullYear()} প্রথমা আলো. সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    </div>
  );
}
