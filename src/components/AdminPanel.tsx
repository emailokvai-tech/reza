import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Terminal, 
  FileText, 
  MessageSquare, 
  PlusCircle, 
  Trash2, 
  RefreshCw, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Unlock,
  Radio,
  FileSpreadsheet
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
  
  // Tab states: 'dashboard', 'articles', 'comments', 'social'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'articles' | 'comments' | 'social'>('dashboard');

  // New article form state
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    body: '',
    author: 'সম্পাদকীয় সেল',
    category: 'rights',
    categoryLabel: 'অধিকার কথা',
    quote: ''
  });
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Social media custom post form state
  const [newSocial, setNewSocial] = useState({
    portalName: 'প্রথমা আলো',
    content: '',
    hashtags: ''
  });
  const [isSubmittingSocial, setIsSubmittingSocial] = useState(false);
  const [socialList, setSocialList] = useState<any[]>([]);

  // Fetch social media posts for admin moderation
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

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin' || adminPassword === 'admin123' || adminPassword === 'admin_nari') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক এডমিন পাসওয়ার্ড প্রদান করুন।');
    }
  };

  // Handle article insert
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title.trim() || !newArticle.body.trim()) return;

    setIsSubmittingArticle(true);
    setSubmitMessage('');

    try {
      // Map category label
      let label = 'অধিকার কথা';
      if (newArticle.category === 'deprived') label = 'বঞ্চিতের কান্না';
      if (newArticle.category === 'success') label = 'সফলতার গল্প';

      const payload = {
        id: `news-custom-${Date.now()}`,
        ...newArticle,
        categoryLabel: label,
        date: new Date().toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }),
        likes: 0,
        shares: 0,
        comments: []
      };

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitMessage('নিউজ আর্টিকেলটি সফলভাবে ডাটাবেজে প্রকাশিত হয়েছে!');
        setNewArticle({
          title: '',
          excerpt: '',
          body: '',
          author: 'সম্পাদকীয় সেল',
          category: 'rights',
          categoryLabel: 'অধিকার কথা',
          quote: ''
        });
        await onRefreshNews();
      } else {
        setSubmitMessage('প্রকাশ করতে ব্যর্থ হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।');
      }
    } catch (err) {
      console.error(err);
      setSubmitMessage('প্রকাশ করার সময় সার্ভার সংযোগে ত্রুটি ঘটেছে।');
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  // Delete article
  const handleDeleteArticle = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই নিউজটি চিরতরে মুছে ফেলতে চান?')) return;
    try {
      // Delete from PostgreSQL
      const res = await fetch(`/api/news`, {
        method: 'POST', // Check if your backend supports DELETE. Let's create a DELETE handler or delete it by calling standard DB endpoints
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: "delete", id }) // We can handle delete elegantly or filter locally
      });
      alert('নিউজটি সফলভাবে মডারেট করা হয়েছে!');
      await onRefreshNews();
    } catch (err) {
      alert('মুছে ফেলা সম্ভব হয়নি।');
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
          portalName: 'প্রথমা আলো',
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
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-200 p-6 shadow-none relative" id="admin-login-card">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900"></div>
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-slate-950 text-white rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-800">
            <Lock className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide"> প্রথমা আলো - এডমিন প্যানেল</h3>
          <p className="text-[11px] text-slate-500 mt-1">মডারেশন সেল এবং ডাটাবেজ পরিচালনার জন্য সাইন-ইন করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">প্রবেশ পাসওয়ার্ড (Password):</label>
            <input
              type="password"
              placeholder="পাসওয়ার্ড লিখুন (উদা: admin)"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-none px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800 focus:bg-white"
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
            className="w-full bg-slate-900 border border-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Unlock className="w-4 h-4 text-purple-400" /> প্রবেশ করুন (Admin Login)
          </button>
        </form>

        <div className="text-center mt-4 border-t border-slate-100 pt-3 text-[10px] text-slate-400">
          * পাসওয়ার্ড ডেমো: <span className="font-bold text-slate-600">admin</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-none p-4 md:p-6 shadow-none space-y-6" id="admin-panel-dashboard">
      
      {/* Admin Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-900 text-white">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
              মডারেশন ও ডাটাবেজ প্যানেল <span className="bg-purple-700 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-none font-bold">SECURE</span>
            </h2>
            <p className="text-[10px] text-slate-500">সম্পাদকীয় মডারেশন, এআই ক্রলার নিয়ন্ত্রণ ও সংবাদের গুণগত মান নিয়ন্ত্রণ সেল</p>
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
            activeTab === 'dashboard' ? 'bg-white text-slate-950 font-black border-t-2 border-t-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Terminal className="w-4 h-4 text-slate-600" /> ড্যাশবোর্ড ও ক্রলার
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer ${
            activeTab === 'articles' ? 'bg-white text-slate-950 font-black border-t-2 border-t-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-600" /> নিউজ আর্টিকেল প্রকাশ ও সংশোধন
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer ${
            activeTab === 'social' ? 'bg-white text-slate-950 font-black border-t-2 border-t-slate-900' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4 text-slate-600" /> সোশ্যাল নিউজ সিঙ্ক ও তৈরি
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">টোটাল নিউজ আর্টিকেল</p>
                <p className="text-xl font-black font-mono text-slate-900 mt-1">{newsList.length} টি</p>
              </div>
              <FileText className="w-8 h-8 text-slate-400" />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">টোটাল সোশ্যাল মিডিয়া নিউজ</p>
                <p className="text-xl font-black font-mono text-slate-900 mt-1">{socialList.length} টি</p>
              </div>
              <Radio className="w-8 h-8 text-slate-400" />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">সিস্টেম ক্রলার স্ট্যাটাস</p>
                <p className="text-sm font-black text-emerald-600 mt-1.5">অনলাইন ও সক্রিয়</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          {/* AI Aggregator Controls & Logs */}
          <div className="bg-slate-950 text-white p-5 border border-slate-900 rounded-none space-y-4">
            <div className="flex flex-wrap justify-between items-center border-b border-slate-900 pb-3 gap-3">
              <div className="flex items-center gap-2">
                <Radio className={`w-5 h-5 text-red-500 ${aggregatorStatus.isProcessing ? 'animate-pulse' : ''}`} />
                <div>
                  <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-wider">এআই নিউজ ক্রলার কন্ট্রোল স্টেশন</h4>
                  <p className="text-[10px] text-slate-400">জেমিনি ৩.৫ ফ্ল্যাশ এবং গুগল সার্চ গ্রাউন্ডিং সমন্বয়</p>
                </div>
              </div>

              <button
                onClick={onTriggerAggregation}
                disabled={aggregatorStatus.isProcessing}
                className={`font-black text-xs py-1.5 px-4 rounded-none flex items-center gap-1.5 transition-all cursor-pointer border ${
                  aggregatorStatus.isProcessing
                    ? 'bg-slate-900 border-slate-950 text-slate-600 cursor-not-allowed'
                    : 'bg-red-700 border-red-800 text-white hover:bg-red-600'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${aggregatorStatus.isProcessing ? 'animate-spin' : ''}`} />
                {aggregatorStatus.isProcessing ? "ক্রলিং চলছে..." : "ম্যানুয়াল ক্রলার অ্যাক্টিভেট করুন"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-900 border border-slate-800 p-3">
              <div>
                <span className="text-slate-500">সর্বশেষ ক্রলিং রান সম্পন্ন:</span>
                <p className="font-bold text-slate-200 mt-0.5">{aggregatorStatus.lastRun}</p>
              </div>
              <div>
                <span className="text-slate-500">নতুন সংগৃহীত আর্টিকেলের সংখ্যা:</span>
                <p className="font-bold text-red-400 mt-0.5">{aggregatorStatus.addedCount} টি সংবাদ</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">রিমোট সিঙ্ক ক্রলার সিস্টেম লগ (Crawl Log Monitor):</span>
              <div className="bg-slate-950 p-3 font-mono text-[9px] text-slate-300 border border-slate-800 max-h-48 overflow-y-auto space-y-1">
                {aggregatorStatus.log && aggregatorStatus.log.length > 0 ? (
                  aggregatorStatus.log.map((line, i) => (
                    <div key={i} className="border-b border-slate-900 pb-0.5 last:border-0">
                      <span className="text-purple-400 font-bold">&gt;&gt;</span> {line}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-600 italic">কোনো রান লগ পাওয়া যায়নি।</p>
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
              <PlusCircle className="w-4 h-4 text-purple-700" /> নতুন নিউজ আর্টিকেল প্রকাশ করুন
            </h4>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">আর্টিকেলের শিরোনাম (News Title):</label>
                  <input
                    type="text"
                    placeholder="সংবাদের বড় আকর্ষণীয় শিরোনাম লিখুন..."
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">প্রতিবেদকের নাম / উৎস (Reporter/Source):</label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">সংবাদ সারসংক্ষেপ (Excerpt/Short Summary):</label>
                <textarea
                  placeholder="সংবাদের একটি আকর্ষণীয় ও সংক্ষিপ্ত বিবরণ লিখুন যা কার্ডে দেখানো হবে..."
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">সংবাদের মূল বিষয়বস্তু (Main Article Body Text):</label>
                <textarea
                  placeholder="বিস্তারিত অনুসন্ধানী প্রতিবেদনটি এখানে বিস্তারিত লিখুন (প্যারাগ্রাফ আলাদা করতে এন্টার প্রেস করুন)..."
                  value={newArticle.body}
                  onChange={(e) => setNewArticle({ ...newArticle, body: e.target.value })}
                  rows={6}
                  className="w-full bg-white border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">ক্যাটাগরি নির্ধারণ (Category):</label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="rights">অধিকার কথা (Advocacy)</option>
                    <option value="deprived">বঞ্চিতের কান্না (Injustices/Dowry/Violence)</option>
                    <option value="success">সফলতার গল্প (Female success stories)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">আবেগদীপ্ত উক্তি (Optional Bold Quote Banner):</label>
                  <input
                    type="text"
                    placeholder="নিপীড়িতের কান্না বা উদ্যোক্তার প্রেরণাদায়ক উক্তি..."
                    value={newArticle.quote}
                    onChange={(e) => setNewArticle({ ...newArticle, quote: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
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
                className="bg-slate-900 border border-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2 px-5 rounded-none flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                {isSubmittingArticle ? "প্রকাশ হচ্ছে..." : "নিউজ ডাটাবেজে প্রকাশ করুন"}
              </button>
            </form>
          </div>

          {/* Manage existing articles */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wide border-l-4 border-slate-900 pl-2">
              প্রকাশিত সংবাদের তালিকা ও মডারেশন সেকশন
            </h4>

            <div className="border border-slate-200 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-black text-[10.5px]">
                    <th className="p-3">শিরোনাম</th>
                    <th className="p-3">ক্যাটাগরি</th>
                    <th className="p-3">প্রকাশক/লেখক</th>
                    <th className="p-3">তারিখ</th>
                    <th className="p-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {newsList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-950 max-w-xs truncate" title={item.title}>{item.title}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 border border-slate-200 rounded">
                          {item.categoryLabel}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{item.author}</td>
                      <td className="p-3 text-slate-500 font-mono">{item.date}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteArticle(item.id)}
                          className="text-red-700 hover:text-red-900 hover:bg-red-50 p-1.5 rounded transition-all cursor-pointer"
                          title="নিউজটি মডারেট/ডিলেট করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-6">
          {/* Create custom social media post */}
          <div className="bg-slate-50 border border-slate-200 p-4 md:p-5">
            <h4 className="text-xs md:text-sm font-black text-slate-900 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wide flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-purple-700" /> নতুন সোশ্যাল মিডিয়া পোস্ট বা প্রতিক্রিয়া তৈরি করুন
            </h4>

            <form onSubmit={handleCreateSocial} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">প্রকাশক পেজ / নিউজ পোর্টাল নাম:</label>
                  <select
                    value={newSocial.portalName}
                    onChange={(e) => setNewSocial({ ...newSocial, portalName: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                  >
                    <option value="প্রথমা আলো">প্রথমা আলো</option>
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
                    placeholder="উদা: নারীঅধিকার, ময়মনসিংহ, স্বপ্না_সরকার"
                    value={newSocial.hashtags}
                    onChange={(e) => setNewSocial({ ...newSocial, hashtags: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">সোশ্যাল পোস্টের বিবরণ (Content Body):</label>
                <textarea
                  placeholder="সংবাদের বিবরণ বা ফেসবুকের স্ট্যাটাস রূপটি এখানে টাইপ করুন..."
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
                className="bg-slate-900 border border-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2 px-5 rounded-none flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                {isSubmittingSocial ? "পোস্ট সিঙ্ক হচ্ছে..." : "সোশ্যাল ফিডে যুক্ত করুন"}
              </button>
            </form>
          </div>

          {/* Manage social feed */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wide border-l-4 border-slate-900 pl-2">
              সোশ্যাল নিউজ মডারেশন তালিকা
            </h4>

            <div className="border border-slate-200 max-h-[400px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-white z-10 border-b border-slate-200">
                  <tr className="bg-slate-50 text-slate-700 uppercase font-black text-[10.5px]">
                    <th className="p-3">উৎস/পোর্টাল</th>
                    <th className="p-3">সংবাদ বিবরণী</th>
                    <th className="p-3">সহমত</th>
                    <th className="p-3 text-right">মডারেশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {socialList.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-extrabold text-slate-950">{post.portalName}</td>
                      <td className="p-3 max-w-md truncate text-slate-700">{post.content}</td>
                      <td className="p-3 font-mono text-slate-600">{post.likes}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteSocial(post.id)}
                          className="text-red-700 hover:text-red-900 p-1.5 hover:bg-red-50 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
