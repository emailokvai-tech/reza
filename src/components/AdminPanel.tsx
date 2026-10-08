import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Terminal, 
  FileText, 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Unlock,
  Radio,
  Rss
} from 'lucide-react';
import { NewsItem } from '../types';

interface AdminPanelProps {
  newsList: NewsItem[];
  onRefreshNews: () => Promise<void>;
  aggregatorStatus: {
    lastRun: string;
    success: boolean;
    addedCount: number;
    log: string[];
    isProcessing: boolean;
  };
  onTriggerAggregation: () => Promise<void>;
}

export default function AdminPanel({
  newsList,
  onRefreshNews,
  aggregatorStatus,
  onTriggerAggregation
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Tab states: 'dashboard', 'articles', 'social'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'articles' | 'social'>('dashboard');

  // New article form state
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    body: '',
    author: 'সম্পাদকীয় অনুসন্ধানী সেল | দি ইনভেস্টিগেশন',
    category: 'rights',
    categoryLabel: 'বিশেষ অনুসন্ধান',
    quote: ''
  });
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Social media custom post form state
  const [newSocial, setNewSocial] = useState({
    portalName: 'দি ইনভেস্টিগেশন',
    content: '',
    hashtags: ''
  });
  const [isSubmittingSocial, setIsSubmittingSocial] = useState(false);
  const [socialList, setSocialList] = useState<any[]>([]);

  // Fetch social media posts for moderation
  const fetchSocialPosts = async () => {
    try {
      const res = await fetch('/api/social-media');
      if (res.ok) {
        const data = await res.json();
        setSocialList(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSocialPosts();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin' || adminPassword === 'investigation2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন। (ডেমো: admin)');
    }
  };

  // Create article handler
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title.trim() || !newArticle.body.trim()) {
      alert('শিরোনাম ও বিস্তারিত লেখা আবশ্যক।');
      return;
    }

    setIsSubmittingArticle(true);
    setSubmitMessage('');

    try {
      const now = new Date();
      const bnDate = `${now.getDate()} অক্টোবর, ২০২৬`;

      const payload = {
        id: `news-custom-${Date.now()}`,
        title: newArticle.title,
        excerpt: newArticle.excerpt || newArticle.title,
        body: newArticle.body,
        date: bnDate,
        author: newArticle.author || 'সম্পাদকীয় অনুসন্ধানী সেল | দি ইনভেস্টিগেশন',
        category: newArticle.category,
        categoryLabel: newArticle.categoryLabel,
        likes: 12,
        shares: 4,
        comments: [],
        quote: newArticle.quote || undefined
      };

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitMessage('সংবাদটি সফলভাবে ডাটাবেজে প্রকাশিত হয়েছে!');
        setNewArticle({
          title: '',
          excerpt: '',
          body: '',
          author: 'সম্পাদকীয় অনুসন্ধানী সেল | দি ইনভেস্টিগেশন',
          category: 'rights',
          categoryLabel: 'বিশেষ অনুসন্ধান',
          quote: ''
        });
        await onRefreshNews();
      } else {
        throw new Error('ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      alert('সংবাদ প্রকাশ করতে সমস্যা হয়েছে: ' + (err.message || 'ত্রুটি'));
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  // Create Social Media post
  const handleCreateSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.content.trim()) return;

    setIsSubmittingSocial(true);
    try {
      const hashtagsArr = newSocial.hashtags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const res = await fetch('/api/social-media/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portalName: newSocial.portalName,
          content: newSocial.content,
          hashtags: hashtagsArr
        })
      });

      if (res.ok) {
        alert('সোশ্যাল মিডিয়া সংবাদ পোস্ট সফলভাবে সিঙ্ক হয়েছে!');
        setNewSocial({
          portalName: 'দি ইনভেস্টিগেশন',
          content: '',
          hashtags: ''
        });
        await fetchSocialPosts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingSocial(false);
    }
  };

  // Delete Social Media post
  const handleDeleteSocial = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই সোশ্যাল পোস্টটি মুছে দিতে চান?')) return;
    try {
      const res = await fetch(`/api/social-media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('পোস্টটি মুছে ফেলা হয়েছে।');
        await fetchSocialPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 p-6 shadow-sm relative" id="admin-login-card">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-slate-950 text-white rounded-none flex items-center justify-center mx-auto mb-3 border border-slate-800">
            <Lock className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide">দি ইনভেস্টিগেশন - এডমিন প্যানেল</h3>
          <p className="text-[11px] text-slate-500 mt-1">মডারেশন সেল ও অটোমেশন ইঞ্জিন পরিচালনার জন্য সাইন-ইন করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">প্রবেশ পাসওয়ার্ড (Password):</label>
            <input
              type="password"
              placeholder="পাসওয়ার্ড লিখুন (ডেমো: admin)"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
              required
            />
          </div>

          {authError && (
            <p className="text-[10.5px] font-bold text-red-600 bg-red-50 border border-red-200 p-2 text-justify">
              <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-red-600" />
              {authError}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-950 border border-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Unlock className="w-4 h-4 text-red-400" /> প্রবেশ করুন (Admin Login)
          </button>
        </form>

        <div className="text-center mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
          * পাসওয়ার্ড: <span className="font-bold text-slate-700">admin</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-none p-4 md:p-6 shadow-sm space-y-6" id="admin-panel-dashboard">
      
      {/* Admin Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-950 text-white">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              সম্পাদকীয় ও অটোমেশন কন্ট্রোল স্টেশন <span className="bg-red-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-none font-bold">LIVE</span>
            </h2>
            <p className="text-[10px] text-slate-500">স্বয়ংক্রিয় আরএসএস সিন্ডিকেশন ও ডাটাবেজ মডারেশন সেল | প্রকাশক: মেহেদী হাসান</p>
          </div>
        </div>

        <button
          onClick={() => setIsAuthenticated(false)}
          className="bg-red-700 border border-red-800 hover:bg-red-600 text-white font-bold text-[10.5px] px-3 py-1.5 rounded-none transition-all cursor-pointer"
        >
          লগআউট করুন
        </button>
      </div>

      {/* Admin navigation tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50 border">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'bg-white text-slate-950 font-black border-t-2 border-t-red-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Rss className="w-4 h-4 text-red-600" /> স্বয়ংক্রিয় আরএসএস ও ড্যাশবোর্ড
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer ${
            activeTab === 'articles' ? 'bg-white text-slate-950 font-black border-t-2 border-t-red-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-600" /> নিউজ আর্টিকেল প্রকাশ ও সংশোধন
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer ${
            activeTab === 'social' ? 'bg-white text-slate-950 font-black border-t-2 border-t-red-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4 text-slate-600" /> সোশ্যাল নিউজ ফিড পরিচালনা
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">ডাটাবেজ নিউজ সংখ্যা</p>
                <p className="text-xl font-black font-mono text-slate-900 mt-1">{newsList.length} টি</p>
              </div>
              <FileText className="w-8 h-8 text-slate-400" />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">সোশ্যাল মিডিয়া পোস্ট</p>
                <p className="text-xl font-black font-mono text-slate-900 mt-1">{socialList.length} টি</p>
              </div>
              <Radio className="w-8 h-8 text-slate-400" />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">অটোমেশন স্ট্যাটাস</p>
                <p className="text-sm font-black text-emerald-600 mt-1.5">২৪ ঘণ্টার স্বয়ংক্রিয় সিঙ্ক সক্রিয়</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          {/* RSS Aggregator Controls & Logs */}
          <div className="bg-slate-950 text-white p-5 border border-slate-900 rounded-none space-y-4">
            <div className="flex flex-wrap justify-between items-center border-b border-slate-900 pb-3 gap-3">
              <div className="flex items-center gap-2">
                <Rss className={`w-5 h-5 text-red-500 ${aggregatorStatus.isProcessing ? 'animate-pulse' : ''}`} />
                <div>
                  <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-wider">
                    স্বয়ংক্রিয় আরএসএস সিন্ডিকেশন ও সংবাদ সংগ্রাহক
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    প্রতিদিন দেশের ১৫টি ব্রেকিং নিউজ এবং ৫টি অনুসন্ধানী প্রতিবেদন স্বয়ংক্রিয়ভাবে সংগ্রহ ও সরবরাহ করে
                  </p>
                </div>
              </div>

              <button
                onClick={onTriggerAggregation}
                disabled={aggregatorStatus.isProcessing}
                className={`font-black text-xs py-2 px-4 rounded-none flex items-center gap-1.5 transition-all cursor-pointer border ${
                  aggregatorStatus.isProcessing
                    ? 'bg-slate-900 border-slate-950 text-slate-600 cursor-not-allowed'
                    : 'bg-red-600 border-red-700 text-white hover:bg-red-700'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${aggregatorStatus.isProcessing ? 'animate-spin' : ''}`} />
                {aggregatorStatus.isProcessing ? "সংবাদ সংগ্রহ চলছে..." : "এখনই আরএসএস সিঙ্ক করুন"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-900 border border-slate-800 p-3">
              <div>
                <span className="text-slate-400">সর্বশেষ সিন্ডিকেশন সম্পন্ন:</span>
                <p className="font-bold text-slate-100 mt-0.5">{aggregatorStatus.lastRun}</p>
              </div>
              <div>
                <span className="text-slate-400">সক্রিয় সংবাদ সংগ্রহ সংখ্যা:</span>
                <p className="font-bold text-red-400 mt-0.5">১৫টি ব্রেকিং ও ৫টি অনুসন্ধানী প্রতিবেদন</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                স্বয়ংক্রিয় আরএসএস ও ডাটাবেজ সিস্টেম লগ (Sync Logs):
              </span>
              <div className="bg-slate-950 p-3 font-mono text-[9.5px] text-slate-300 border border-slate-800 max-h-48 overflow-y-auto space-y-1">
                {aggregatorStatus.log && aggregatorStatus.log.length > 0 ? (
                  aggregatorStatus.log.map((line, i) => (
                    <div key={i} className="border-b border-slate-900 pb-0.5 last:border-0">
                      <span className="text-red-500 font-bold">&gt;&gt;</span> {line}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 italic">লগ পাওয়া যায়নি।</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Create new article form */}
          <div className="bg-slate-50 border border-slate-200 p-4 md:p-5">
            <h4 className="text-xs md:text-sm font-black text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-red-600" /> নতুন অনুসন্ধানী প্রতিবেদন প্রকাশ করুন
            </h4>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">আর্টিকেলের শিরোনাম (News Title):</label>
                  <input
                    type="text"
                    placeholder="অনুসন্ধানী শিরোনাম..."
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">প্রতিবেদকের নাম / উৎস:</label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">সংবাদ সারসংক্ষেপ (Excerpt):</label>
                <textarea
                  placeholder="সংবাদের একটি আকর্ষণীয় সারসংক্ষেপ..."
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">সংবাদের মূল বিষয়বস্তু (Body Text):</label>
                <textarea
                  placeholder="পূর্ণাঙ্গ অনুসন্ধানী প্রতিবেদন..."
                  value={newArticle.body}
                  onChange={(e) => setNewArticle({ ...newArticle, body: e.target.value })}
                  rows={6}
                  className="w-full bg-white border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-sans"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">ক্যাটাগরি:</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="rights">বিশেষ অনুসন্ধান (Investigative)</option>
                    <option value="deprived">বঞ্চিতের কান্না ও দুর্নীতি</option>
                    <option value="success">সফলতার গল্প</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">উদ্ধৃতি / কোটেশন (Bold Quote):</label>
                  <input
                    type="text"
                    placeholder="অনুসন্ধানী মন্তব্য বা উক্তি..."
                    value={newArticle.quote}
                    onChange={(e) => setNewArticle({ ...newArticle, quote: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {submitMessage && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5">
                  {submitMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmittingArticle}
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2 px-5 rounded-none flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                {isSubmittingArticle ? "প্রকাশ হচ্ছে..." : "নিউজ ডাটাবেজে প্রকাশ করুন"}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-4 md:p-5">
            <h4 className="text-xs md:text-sm font-black text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-red-600" /> নতুন সোশ্যাল মিডিয়া পোস্ট বা প্রতিক্রিয়া
            </h4>

            <form onSubmit={handleCreateSocial} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">প্রকাশক পেজ:</label>
                  <select
                    value={newSocial.portalName}
                    onChange={(e) => setNewSocial({ ...newSocial, portalName: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                  >
                    <option value="দি ইনভেস্টিগেশন">দি ইনভেস্টিগেশন</option>
                    <option value="প্রথম আলো">প্রথম আলো</option>
                    <option value="বিবিসি বাংলা">বিবিসি বাংলা</option>
                    <option value="ডয়চে ভেলে বাংলা">ডয়চে ভেলে বাংলা</option>
                    <option value="যুগান্তর">যুগান্তর</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">হ্যাশট্যাগ তালিকা (কমা দিয়ে আলাদা করুন):</label>
                  <input
                    type="text"
                    placeholder="উদা: ইনভেস্টিগেশন, দুর্নীতি, তেল_সিন্ডিকেট"
                    value={newSocial.hashtags}
                    onChange={(e) => setNewSocial({ ...newSocial, hashtags: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">পোস্টের বিবরণ:</label>
                <textarea
                  placeholder="সংবাদ বিবরণ বা সামাজিক প্রতিক্রিয়া..."
                  value={newSocial.content}
                  onChange={(e) => setNewSocial({ ...newSocial, content: e.target.value })}
                  rows={4}
                  className="w-full bg-white border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmittingSocial}
                className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2 px-5 rounded-none flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                {isSubmittingSocial ? "পোস্ট হচ্ছে..." : "সোশ্যাল ফিডে যুক্ত করুন"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
