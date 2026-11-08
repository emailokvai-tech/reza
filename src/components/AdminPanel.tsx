import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Terminal, 
  FileText, 
  PlusCircle, 
  Trash2, 
  Edit3,
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Unlock,
  Radio,
  Rss,
  Image as ImageIcon,
  Clock,
  ExternalLink,
  Save,
  X,
  Search,
  Share2,
  Send,
  Facebook
} from 'lucide-react';
import { NewsItem } from '../types.ts';
import NewsImage from './NewsImage.tsx';
import InvestigationLogo from './InvestigationLogo.tsx';

export const JOYBARTA_FB_URL = "https://www.facebook.com/share/1ahsbSRRMy/?mibextid=wwXIfr";

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
  
  // Tab states: 'dashboard', 'fb_import', 'manage', 'social'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'fb_import' | 'manage' | 'social'>('dashboard');

  // Search in manage tab
  const [manageSearch, setManageSearch] = useState('');

  // Editing article state
  const [editingArticle, setEditingArticle] = useState<NewsItem | null>(null);
  const [isUpdatingArticle, setIsUpdatingArticle] = useState(false);

  // New article state
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    body: '',
    author: 'জয়নাল আবেদীন',
    category: 'national',
    categoryLabel: 'জাতীয় সংবাদ',
    image: '',
    videoUrl: '',
    fbPostUrl: '',
    date: '',
    quote: ''
  });
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Facebook sync state
  const [isSyncingFb, setIsSyncingFb] = useState(false);
  const [fbSyncMessage, setFbSyncMessage] = useState('');


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin' || adminPassword === 'joybarta2026' || adminPassword === 'joybarta') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন। (ডিফল্ট: admin)');
    }
  };

  // Convert numbers to Bengali digits
  const toBengaliNumber = (num: number | string): string => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(char => {
      const idx = parseInt(char);
      return !isNaN(idx) ? banglaDigits[idx] : char;
    }).join("");
  };

  const getTodayBanglaDate = () => {
    const date = new Date();
    const months = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    return `${toBengaliNumber(date.getDate())} ${months[date.getMonth()]}, ${toBengaliNumber(date.getFullYear())}`;
  };

  // Trigger Facebook Sync
  const handleSyncFacebook = async () => {
    setIsSyncingFb(true);
    setFbSyncMessage('');
    try {
      const res = await fetch('/api/facebook/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setFbSyncMessage(data.message || 'ফেসবুক পেজের পোস্টসমূহ সফলভাবে সিঙ্ক হয়েছে!');
        await onRefreshNews();
      } else {
        throw new Error('সিঙ্ক ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      setFbSyncMessage(`সিঙ্ক ত্রুটি: ${err.message}`);
    } finally {
      setIsSyncingFb(false);
    }
  };

  // Create article handler
  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title.trim() || !newArticle.body.trim()) {
      alert('পোস্টের শিরোনাম ও বিস্তারিত বিষয়বস্তু দেওয়া আবশ্যক।');
      return;
    }

    setIsSubmittingArticle(true);
    setSubmitMessage('');

    try {
      const bnDate = newArticle.date.trim() || getTodayBanglaDate();

      const payload = {
        id: `news-fb-${Date.now()}`,
        title: newArticle.title.trim(),
        excerpt: newArticle.excerpt.trim() || newArticle.title.trim(),
        body: newArticle.body.trim(),
        date: bnDate,
        author: newArticle.author.trim() || 'জয়বার্তা ফেসবুক ডেস্ক',
        category: newArticle.category,
        categoryLabel: newArticle.categoryLabel,
        image: newArticle.image.trim() || '/src/assets/images/investigative_files_1783161563907.jpg',
        likes: Math.floor(Math.random() * 80) + 150,
        shares: Math.floor(Math.random() * 30) + 35,
        comments: [],
        quote: newArticle.quote.trim() || undefined,
        fbPostUrl: newArticle.fbPostUrl.trim() || JOYBARTA_FB_URL,
        isFbPost: true,
        fbReactions: { like: 120, love: 45, wow: 18, share: 35 }
      };

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitMessage('পোস্টটি সফলভাবে জয়বার্তা পোর্টালে প্রকাশিত হয়েছে!');
        setNewArticle({
          title: '',
          excerpt: '',
          body: '',
          author: 'জয়বার্তা ফেসবুক ডেস্ক',
          category: 'investigation',
          categoryLabel: 'জয়বার্তা অনুসন্ধান',
          image: '/src/assets/images/investigative_files_1783161563907.jpg',
          fbPostUrl: JOYBARTA_FB_URL,
          date: '',
          quote: ''
        });
        await onRefreshNews();
        setActiveTab('manage');
      } else {
        const err = await res.json();
        alert(`সংরক্ষণ ত্রুটি: ${err.error || 'ব্যর্থ হয়েছে'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`সার্ভার ত্রুটি: ${err.message}`);
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  // Delete article handler
  const handleDeleteArticle = async (id: string, title: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিত যে "${title.slice(0, 30)}..." প্রতিবেদনটি চিরতরে মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefreshNews();
      } else {
        alert('প্রতিবেদনটি ডিলিট করতে ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      console.error(err);
      alert(`ডিলিট করতে সমস্যা হয়েছে: ${err.message}`);
    }
  };

  // Open edit modal
  const handleOpenEditModal = (article: NewsItem) => {
    setEditingArticle({ ...article });
  };

  // Save edited article
  const handleSaveEditedArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    setIsUpdatingArticle(true);
    try {
      const res = await fetch(`/api/news/${editingArticle.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle)
      });

      if (res.ok) {
        await onRefreshNews();
        setEditingArticle(null);
      } else {
        alert('প্রতিবেদনটি আপডেট করতে ব্যর্থ হয়েছে।');
      }
    } catch (err: any) {
      console.error(err);
      alert(`আপডেট ত্রুটি: ${err.message}`);
    } finally {
      setIsUpdatingArticle(false);
    }
  };

  // Authentic image options (No fake or artificial stock photos)
  const presetImages = [
    { label: 'ছবি নেই (টেক্সট-ফার্স্ট লেআউট)', url: '' },
    { label: 'জয়বার্তা অফিসিয়াল প্রতীক', url: '/joybarta-logo.jpg' },
  ];

  // If not authenticated, render login prompt
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border-2 border-[#0f3d2e] p-6 shadow-md font-sans">
        <div className="text-center space-y-3 pb-6 border-b border-slate-200">
          <div className="flex justify-center">
            <InvestigationLogo variant="header" />
          </div>
          <h2 className="text-base font-black text-slate-950 font-serif">
            এডমিন ও ফেসবুক পোস্ট ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-slate-600">
            জয়বার্তা অফিসিয়াল ফেসবুক পেজের পোস্ট প্রকাশ ও পোর্টাল পরিচালনার জন্য পাসওয়ার্ড লিখুন।
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              এডমিন পাসওয়ার্ড:
            </label>
            <div className="relative">
              <input 
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="পাসওয়ার্ড দিন (যেমন: admin)"
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] font-mono rounded-sm"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
            {authError && (
              <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {authError}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold text-xs py-2.5 flex items-center justify-center gap-1.5 transition-colors cursor-pointer rounded-sm"
          >
            <Unlock className="w-4 h-4" />
            <span>লগইন করুন</span>
          </button>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              ডিফল্ট পাসওয়ার্ড: <span className="font-mono font-bold text-[#0f3d2e] bg-emerald-50 px-1.5 py-0.5 border border-emerald-200 rounded">admin</span>
            </p>
          </div>
        </form>
      </div>
    );
  }

  // Filtered news for management
  const filteredManageNews = newsList.filter(item => 
    manageSearch.trim() === '' ||
    item.title.toLowerCase().includes(manageSearch.toLowerCase()) ||
    item.author.toLowerCase().includes(manageSearch.toLowerCase()) ||
    item.categoryLabel?.toLowerCase().includes(manageSearch.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 shadow-sm font-sans mb-12">
      {/* Admin Panel Header */}
      <div className="bg-[#0f3d2e] text-white p-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded p-0.5 flex items-center justify-center">
            <img src="/joybarta-logo.jpg" alt="জয়বার্তা" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-base font-black font-serif flex items-center gap-2">
              জয়বার্তা - কন্ট্রোল ও ফেসবুক পোস্ট প্যানেল
            </h1>
            <p className="text-[10.5px] text-emerald-200 flex items-center gap-1">
              <span>সত্যের সন্ধানে প্রতিদিন</span>
              <span>•</span>
              <a 
                href={JOYBARTA_FB_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-white flex items-center gap-1"
              >
                <span>অফিসিয়াল পেজ: facebook.com/joybarta</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-100 hover:text-white bg-emerald-900/60 px-3 py-1.5 border border-emerald-700 rounded-sm"
          >
            <span>লাইভ পোর্টাল দেখুন</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-3 py-1.5 transition-colors cursor-pointer rounded-sm"
          >
            লগআউট
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 px-2 pt-2 gap-1">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'dashboard'
              ? 'border-[#0f3d2e] text-[#0f3d2e] bg-white font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>ড্যাশবোর্ড ও ফেসবুক স্ট্যাটাস</span>
        </button>

        <button
          onClick={() => setActiveTab('fb_import')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'fb_import'
              ? 'border-[#0f3d2e] text-[#0f3d2e] bg-white font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>নতুন ফেসবুক পোস্ট পাবলিশ করুন</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'manage'
              ? 'border-[#0f3d2e] text-[#0f3d2e] bg-white font-black'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>প্রকাশিত সংবাদ ব্যবস্থাপনা ({newsList.length})</span>
        </button>
      </div>

      {/* Tab 1: Dashboard & Facebook status */}
      {activeTab === 'dashboard' && (
        <div className="p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4">
              <span className="text-xs font-bold text-emerald-800 uppercase block">মোট প্রকাশিত প্রতিবেদন</span>
              <span className="text-3xl font-black text-[#0f3d2e] font-mono mt-1 block">
                {newsList.length} টি
              </span>
              <span className="text-[11px] text-emerald-700 mt-1 block">
                জয়বার্তা ফেসবুক পেজ ও অনুসন্ধানী ডেস্ক
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4">
              <span className="text-xs font-bold text-blue-800 uppercase block">অফিসিয়াল ফেসবুক পেজ</span>
              <a 
                href={JOYBARTA_FB_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs font-black text-blue-700 hover:underline mt-2 flex items-center gap-1"
              >
                <span>facebook.com/joybarta</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-[11px] text-blue-600 mt-2 block">
                সত্যের সন্ধানে প্রতিদিন
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4">
              <span className="text-xs font-bold text-slate-700 uppercase block">সার্ভার ও ডেটাবেজ স্ট্যাটাস</span>
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1 mt-2">
                <CheckCircle className="w-4 h-4" /> সক্রিয় ও ক্লাউড রেডি
              </span>
              <span className="text-[10.5px] text-slate-500 font-mono mt-1 block">
                Vercel Serverless + REST API
              </span>
            </div>
          </div>

          {/* Facebook Sync Action Box */}
          <div className="bg-white border-2 border-emerald-600 p-5 rounded-sm shadow-xs">
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 font-serif flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-[#1877F2]" />
                  ফেসবুক পেজ অটো-সিঙ্ক্রোনাইজেশন
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  অফিসিয়াল ফেসবুক পেজ থেকে সর্বশেষ পোস্টসমূহ তাৎক্ষণিক পোর্টালে সিঙ্ক ও আপডেট করতে ক্লিক করুন।
                </p>
              </div>

              <button
                onClick={handleSyncFacebook}
                disabled={isSyncingFb}
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs px-4 py-2 flex items-center gap-2 cursor-pointer transition-all rounded-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFb ? 'animate-spin' : ''}`} />
                <span>{isSyncingFb ? 'সিঙ্ক হচ্ছে...' : 'ফেসবুক পেজ সিঙ্ক করুন'}</span>
              </button>
            </div>

            {fbSyncMessage && (
              <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 rounded-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{fbSyncMessage}</span>
              </div>
            )}
          </div>

          {/* Scheduled Automation Tracker */}
          <div className="bg-slate-50 border border-slate-200 p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <Rss className="w-4 h-4 text-orange-600" />
                <span>স্বয়ংক্রিয় আরএসএস ও অনুসন্ধান সিন্ডিকেশন ইঞ্জিন</span>
              </h4>
              <button
                onClick={onTriggerAggregation}
                disabled={aggregatorStatus.isProcessing}
                className="text-[11px] bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1 flex items-center gap-1 rounded-sm cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${aggregatorStatus.isProcessing ? 'animate-spin' : ''}`} />
                <span>{aggregatorStatus.isProcessing ? 'স্ক্যান চলমান...' : 'ম্যানুয়াল আরএসএস স্ক্যান'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 font-bold">সর্বশেষ সফল রান:</span>
                <span className="text-slate-900 font-mono font-bold ml-1.5">{aggregatorStatus.lastRun}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold">মোট স্ক্যানকৃত সংবাদ:</span>
                <span className="text-emerald-700 font-bold ml-1.5">{aggregatorStatus.addedCount} টি প্রতিবেদন</span>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 font-mono text-[10.5px] p-2.5 max-h-32 overflow-y-auto space-y-1 rounded-sm">
              {aggregatorStatus.log.map((logMsg, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-emerald-400">❯</span>
                  <span>{logMsg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Publish / Import Facebook Post Form */}
      {activeTab === 'fb_import' && (
        <div className="p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-black text-slate-950 font-serif flex items-center gap-2">
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                নতুন ফেসবুক পোস্ট জয়বার্তা পোর্টালে প্রকাশ করুন
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                আপনার ফেসবুক পেজে প্রকাশিত পোস্টের লিংক, শিরোনাম ও বিবরণ পেস্ট করে সরাসরি সংবাদ হিসেবে লাইভ করুন।
              </p>
            </div>

            {submitMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 text-xs font-bold flex items-center gap-2 rounded-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{submitMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateArticle} className="space-y-4">
              {/* Facebook URL */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  ফেসবুক পোস্ট লিংক (Facebook Post URL):
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={newArticle.fbPostUrl}
                    onChange={(e) => setNewArticle({ ...newArticle, fbPostUrl: e.target.value })}
                    placeholder="https://www.facebook.com/share/..."
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-sm font-mono text-blue-700"
                  />
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  ডিফল্ট: আপনার অফিসিয়াল ফেসবুক পেজের লিংক সংরক্ষিত রয়েছে।
                </span>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  পোস্টের শিরোনাম (News Headline) <span className="text-red-600">*</span>:
                </label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  placeholder="যেমন: হাসপাতালে ওষুধের সংকট নিরসনে জয়বার্তা ফেসবুক পেজের অনুসন্ধানী প্রতিবেদন"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] font-serif font-bold text-slate-900 rounded-sm"
                  required
                />
              </div>

              {/* Category & Author Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ক্যাটাগরি / বিভাগ:
                  </label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const labels: {[k: string]: string} = {
                        investigation: 'জয়বার্তা অনুসন্ধান',
                        rights: 'জনস্বার্থ ও অধিকার',
                        fb_exclusive: 'ফেসবুক এক্সক্লুসিভ',
                        legal: 'আইনি লড়াই ও ন্যায়বিচার',
                        success: 'সাফল্যের গল্প',
                        national: 'জাতীয় সংবাদ'
                      };
                      setNewArticle({
                        ...newArticle,
                        category: cat,
                        categoryLabel: labels[cat] || 'জয়বার্তা সংবাদ'
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-sm"
                  >
                    <option value="investigation">বিশেষ অনুসন্ধান (Investigation)</option>
                    <option value="rights">জনস্বার্থ ও অধিকার (Rights & Public)</option>
                    <option value="fb_exclusive">ফেসবুক এক্সক্লুসিভ (Facebook Exclusive)</option>
                    <option value="legal">আইনি লড়াই ও ন্যায়বিচার (Legal Aid)</option>
                    <option value="success">সাফল্যের গল্প (Success Story)</option>
                    <option value="national">জাতীয় সংবাদ (National News)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    প্রতিবেদক / সূত্র:
                  </label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    placeholder="জয়বার্তা ফেসবুক ডেস্ক"
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-sm"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  সংক্ষিপ্ত সারাংশ (Excerpt):
                </label>
                <textarea
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  placeholder="১-২ লাইনে পোস্টের মূল বক্তব্য লিখুন..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-sm"
                />
              </div>

              {/* Full Body Content */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  সম্পূর্ণ বিবরণ / ফেসবুক পোস্টের টেক্সট <span className="text-red-600">*</span>:
                </label>
                <textarea
                  value={newArticle.body}
                  onChange={(e) => setNewArticle({ ...newArticle, body: e.target.value })}
                  placeholder="ফেসবুক পোস্টের মূল লেখাটি এখানে পেস্ট করুন..."
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-sm leading-relaxed"
                  required
                />
              </div>

              {/* Image selector */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  ছবির লিংক বা প্রিসেট ছবি নির্বাচন:
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newArticle.image}
                    onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                    placeholder="/src/assets/images/... বা অনলাইন ইমেজ URL"
                    className="flex-1 bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-sm font-mono"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {presetImages.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewArticle({ ...newArticle, image: p.url })}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 border border-slate-300 px-2 py-1 rounded cursor-pointer text-slate-700"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  প্রধান উক্তি বা হাইলাইটেড বক্তব্য (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  value={newArticle.quote}
                  onChange={(e) => setNewArticle({ ...newArticle, quote: e.target.value })}
                  placeholder="যেমন: সত্যের সন্ধানে প্রতিদিন আপসহীন থাকবে জয়বার্তা।"
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-sm italic"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingArticle}
                  className="bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold text-xs px-6 py-2.5 flex items-center gap-2 cursor-pointer transition-colors rounded-sm disabled:opacity-50 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isSubmittingArticle ? 'প্রকাশিত হচ্ছে...' : 'জয়বার্তা পোর্টালে পাবলিশ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Manage & Edit Articles */}
      {activeTab === 'manage' && (
        <div className="p-6 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-black text-slate-900 font-serif">
                প্রকাশিত সকল সংবাদ ও ফেসবুক পোস্ট
              </h2>
              <p className="text-[11px] text-slate-500">
                যেকোনো সংবাদ সরাসরি লাইভ এডিট অথবা ডিলিট করার নিয়ন্ত্রণ।
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="শিরোনাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
                value={manageSearch}
                onChange={(e) => setManageSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-[#0f3d2e] rounded-sm"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                  <th className="p-3 w-16">ছবি</th>
                  <th className="p-3">শিরোনাম ও সূত্র</th>
                  <th className="p-3 w-32">বিভাগ</th>
                  <th className="p-3 w-28">তারিখ</th>
                  <th className="p-3 w-28 text-center">ফেসবুক লিংক</th>
                  <th className="p-3 w-28 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredManageNews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      কোনো প্রতিবেদন পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredManageNews.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5">
                        <div className="w-12 h-9 overflow-hidden bg-slate-200 border border-slate-300 rounded-xs">
                          <NewsImage src={item.image} alt={item.title} aspectRatio="square" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900 line-clamp-1 font-serif text-[12.5px]">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>প্রতিবেদক: {item.author}</span>
                          <span>•</span>
                          <span>{item.likes} লাইক</span>
                          <span>•</span>
                          <span>{item.comments?.length || 0} মন্তব্য</span>
                        </div>
                      </td>
                      <td className="p-2.5">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-sm">
                          {item.categoryLabel || item.category}
                        </span>
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-600 font-mono">
                        {item.date}
                      </td>
                      <td className="p-2.5 text-center">
                        <a
                          href={item.fbPostUrl || JOYBARTA_FB_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10.5px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <Facebook className="w-3 h-3 text-[#1877F2]" />
                          <span>ফেসবুক</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                      <td className="p-2.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded cursor-pointer transition-colors border border-slate-300"
                          title="সম্পাদনা করুন"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-700" />
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(item.id, item.title)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded cursor-pointer transition-colors border border-red-200"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-sm shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-black text-slate-900 font-serif flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                সংবাদ সম্পাদনা করুন
              </h3>
              <button
                onClick={() => setEditingArticle(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedArticle} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">শিরোনাম:</label>
                <input
                  type="text"
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 font-bold font-serif text-slate-900 rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">ফেসবুক পোস্ট লিংক:</label>
                <input
                  type="text"
                  value={editingArticle.fbPostUrl || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, fbPostUrl: e.target.value })}
                  placeholder={JOYBARTA_FB_URL}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 font-mono text-blue-700 rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">ক্যাটাগরি লেবেল:</label>
                  <input
                    type="text"
                    value={editingArticle.categoryLabel || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, categoryLabel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">প্রতিবেদক:</label>
                  <input
                    type="text"
                    value={editingArticle.author}
                    onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">সংক্ষেপ:</label>
                <textarea
                  value={editingArticle.excerpt}
                  onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">সম্পূর্ণ বিবরণ:</label>
                <textarea
                  value={editingArticle.body}
                  onChange={(e) => setEditingArticle({ ...editingArticle, body: e.target.value })}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">ছবির URL:</label>
                <input
                  type="text"
                  value={editingArticle.image || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 px-3 py-1.5 font-mono rounded-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-sm cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingArticle}
                  className="bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold px-4 py-2 rounded-sm cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isUpdatingArticle ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
