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
  GitBranch,
  CloudUpload
} from 'lucide-react';
import { NewsItem } from '../types.ts';
import NewsImage from './NewsImage.tsx';

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
  
  // Tab states: 'dashboard', 'articles', 'manage', 'social'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create' | 'manage' | 'social'>('dashboard');

  // Search in manage tab
  const [manageSearch, setManageSearch] = useState('');

  // Editing article state
  const [editingArticle, setEditingArticle] = useState<NewsItem | null>(null);
  const [isUpdatingArticle, setIsUpdatingArticle] = useState(false);

  // New article form state
  const [newArticle, setNewArticle] = useState({
    title: '',
    excerpt: '',
    body: '',
    author: 'সম্পাদকীয় অনুসন্ধানী সেল | Vulture Eyes',
    category: 'rights',
    categoryLabel: 'বিশেষ অনুসন্ধান',
    image: '',
    date: '',
    quote: ''
  });
  const [isSubmittingArticle, setIsSubmittingArticle] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Social media custom post form state
  const [newSocial, setNewSocial] = useState({
    portalName: 'Vulture Eyes',
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
    if (adminPassword === 'admin' || adminPassword === 'vulture2026' || adminPassword === 'investigation2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('ভুল পাসওয়ার্ড। অনুগ্রহ করে সঠিক পাসওয়ার্ড প্রদান করুন। (ডেমো: admin)');
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
      const bnDate = newArticle.date.trim() || getTodayBanglaDate();

      const payload = {
        id: `news-custom-${Date.now()}`,
        title: newArticle.title.trim(),
        excerpt: newArticle.excerpt.trim() || newArticle.title.trim(),
        body: newArticle.body.trim(),
        date: bnDate,
        author: newArticle.author.trim() || 'সম্পাদকীয় অনুসন্ধানী সেল | Vulture Eyes',
        category: newArticle.category,
        categoryLabel: newArticle.categoryLabel,
        image: newArticle.image.trim() || undefined,
        likes: 15,
        shares: 6,
        comments: [],
        quote: newArticle.quote.trim() || undefined
      };

      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitMessage('সংবাদটি সফলভাবে ডাটাবেজে প্রকাশিত হয়েছে এবং Vercel লাইভ পোর্টালে সিঙ্ক করা হয়েছে!');
        setNewArticle({
          title: '',
          excerpt: '',
          body: '',
          author: 'সম্পাদকীয় অনুসন্ধানী সেল | Vulture Eyes',
          category: 'rights',
          categoryLabel: 'বিশেষ অনুসন্ধান',
          image: '',
          date: '',
          quote: ''
        });
        await onRefreshNews();
        setActiveTab('manage');
      } else {
        throw new Error('ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      alert('সংবাদ প্রকাশ করতে সমস্যা হয়েছে: ' + (err.message || 'ত্রুটি'));
    } finally {
      setIsSubmittingArticle(false);
    }
  };

  // Update existing article handler
  const handleUpdateArticle = async (e: React.FormEvent) => {
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
        alert('সংবাদটি সফলভাবে আপডেট করা হয়েছে!');
        setEditingArticle(null);
        await onRefreshNews();
      } else {
        throw new Error('আপডেট ব্যর্থ হয়েছে');
      }
    } catch (err: any) {
      alert('আপডেট করতে সমস্যা হয়েছে: ' + (err.message || 'ত্রুটি'));
    } finally {
      setIsUpdatingArticle(false);
    }
  };

  // Delete article handler
  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে এই সংবাদটি মুছে ফেলতে চান?\n\n"${title}"`)) {
      return;
    }

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('সংবাদটি সফলভাবে মুছে ফেলা হয়েছে!');
        await onRefreshNews();
      } else {
        throw new Error('মুছে ফেলা সম্ভব হয়নি');
      }
    } catch (err: any) {
      alert('ত্রুটি: ' + (err.message || 'ডিলিট ব্যর্থ'));
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
          portalName: 'Vulture Eyes',
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

  const filteredNewsList = newsList.filter(item => {
    if (!manageSearch.trim()) return true;
    const query = manageSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query) ||
      item.categoryLabel?.toLowerCase().includes(query) ||
      item.excerpt.toLowerCase().includes(query)
    );
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border border-slate-300 p-6 shadow-sm relative" id="admin-login-card">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-slate-950 text-white rounded-none flex items-center justify-center mx-auto mb-3 border border-slate-800">
            <Lock className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-black text-slate-950 uppercase tracking-wide font-serif">
            Vulture Eyes (ভালচার আইস)
          </h3>
          <p className="text-[11px] font-mono text-red-700 font-bold uppercase mt-0.5">
            এডমিন ড্যাশবোর্ড প্যানেল (/admin)
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            ম্যানুয়াল সংবাদ প্রকাশনা, এডিট, ডিলিট ও অটোমেশন কন্ট্রোল
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
              প্রবেশ পাসওয়ার্ড (Admin Password):
            </label>
            <input
              type="password"
              placeholder="পাসওয়ার্ড লিখুন (ডিফল্ট: admin)"
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

        <div className="mt-5 border-t border-slate-200 pt-3 text-[10.5px] text-slate-500 space-y-1">
          <div className="flex justify-between items-center">
            <span>পাসওয়ার্ড:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 border border-slate-200">admin</span>
          </div>
          <p className="text-[9.5px] text-slate-400">
            * পাসওয়ার্ড দ্বারা সুরক্ষিত। সফল প্রবেশে সম্পূর্ণ কন্ট্রোল প্যানেল চালু হবে।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-300 rounded-none p-4 md:p-6 shadow-sm space-y-6" id="admin-panel-dashboard">
      
      {/* Admin Panel Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-950 text-white border border-slate-800">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm md:text-base font-black text-slate-950 uppercase tracking-wider">
                Vulture Eyes - এডমিন ও কন্ট্রোল প্যানেল
              </h2>
              <span className="bg-red-600 text-white font-mono text-[9px] px-1.5 py-0.5 font-bold uppercase">
                /admin ACTIVE
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500 mt-0.5">
              সম্পাদক: <strong className="text-slate-800">Tarek Anwar Khan</strong> | প্রকাশক: <strong className="text-slate-800">দেবাশীষ ঘোষ মিশু</strong> | UK Reg: 17041560
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-red-600 border border-slate-300 bg-slate-50 px-2.5 py-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> লাইভ সাইট দেখুন
          </a>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="bg-red-700 border border-red-800 hover:bg-red-600 text-white font-bold text-[10.5px] px-3 py-1.5 rounded-none transition-all cursor-pointer"
          >
            লগআউট করুন
          </button>
        </div>
      </div>

      {/* Admin navigation tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50 border">
        <button
          onClick={() => { setActiveTab('dashboard'); setEditingArticle(null); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-white text-slate-950 font-black border-t-2 border-t-red-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Rss className="w-4 h-4 text-red-600" /> ড্যাশবোর্ড ও অটোমেশন
        </button>
        <button
          onClick={() => { setActiveTab('create'); setEditingArticle(null); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'create' ? 'bg-white text-slate-950 font-black border-t-2 border-t-red-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" /> নতুন নিউজ সাবমিট করুন
        </button>
        <button
          onClick={() => { setActiveTab('manage'); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'manage' ? 'bg-white text-slate-950 font-black border-t-2 border-t-red-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Edit3 className="w-4 h-4 text-indigo-600" /> প্রকাশিত সব নিউজ এডিট / ডিলিট ({newsList.length})
        </button>
        <button
          onClick={() => { setActiveTab('social'); setEditingArticle(null); }}
          className={`flex items-center gap-1.5 px-4 py-2.5 font-bold text-xs border-r border-slate-200 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'social' ? 'bg-white text-slate-950 font-black border-t-2 border-t-red-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4 text-slate-600" /> সোশ্যাল নিউজ ফিড
        </button>
      </div>

      {/* Tab 1: Dashboard & Automation */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-3.5 flex justify-between items-center">
              <div>
                <p className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">মোট প্রকাশিত নিউজ</p>
                <p className="text-xl font-black font-mono text-slate-900 mt-0.5">{newsList.length} টি</p>
              </div>
              <FileText className="w-7 h-7 text-slate-400" />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 flex justify-between items-center">
              <div>
                <p className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">সোশ্যাল মিডিয়া পোস্ট</p>
                <p className="text-xl font-black font-mono text-slate-900 mt-0.5">{socialList.length} টি</p>
              </div>
              <Radio className="w-7 h-7 text-slate-400" />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 flex justify-between items-center">
              <div>
                <p className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">অটোমেশন স্ট্যাটাস</p>
                <p className="text-xs font-black text-emerald-600 mt-1">২৪ ঘণ্টার দৈনিক আরএসএস সচল</p>
              </div>
              <CheckCircle className="w-7 h-7 text-emerald-500" />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3.5 flex justify-between items-center">
              <div>
                <p className="text-[10.5px] text-slate-500 font-bold uppercase tracking-wider">Vercel Auto Sync</p>
                <p className="text-xs font-black text-indigo-600 mt-1">GitHub CI/CD সংযুক্ত</p>
              </div>
              <CloudUpload className="w-7 h-7 text-indigo-500" />
            </div>
          </div>

          {/* RSS Aggregator Controls & Logs */}
          <div className="bg-slate-950 text-white p-5 border border-slate-900 rounded-none space-y-4">
            <div className="flex flex-wrap justify-between items-center border-b border-slate-900 pb-3 gap-3">
              <div className="flex items-center gap-2">
                <Rss className={`w-5 h-5 text-red-500 ${aggregatorStatus.isProcessing ? 'animate-pulse' : ''}`} />
                <div>
                  <h4 className="text-xs md:text-sm font-black text-white uppercase tracking-wider font-serif">
                    স্বয়ংক্রিয় আরএসএস ও অনুসন্ধানী সিন্ডিকেশন ইঞ্জিন (Vulture Eyes Engine)
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    প্রতিদিন দেশের ১৫টি ব্রেকিং নিউজ এবং ৫টি অনুসন্ধানী প্রতিবেদন স্বয়ংক্রিয়ভাবে সংগ্রহ ও সংরক্ষণ করে
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
              <div className="bg-slate-950 p-3 font-mono text-[9.5px] text-slate-300 border border-slate-800 max-h-40 overflow-y-auto space-y-1">
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

      {/* Tab 2: Manual News Creation Form */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-4 md:p-6">
            <h4 className="text-sm font-black text-slate-950 border-b border-slate-200 pb-2 mb-4 uppercase tracking-wide flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                ম্যানুয়ালি নতুন সংবাদ সাবমিট করার ফরম (Vulture Eyes Post)
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-normal">
                লাইভ ডাটাবেজ সংরক্ষণ
              </span>
            </h4>

            <form onSubmit={handleCreateArticle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    সংবাদের শিরোনাম (Headline) <span className="text-red-600">*</span>:
                  </label>
                  <input
                    type="text"
                    placeholder="অনুসন্ধানী শিরোনাম..."
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    প্রতিবেদক / সোর্স:
                  </label>
                  <input
                    type="text"
                    value={newArticle.author}
                    onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    ক্যাটাগরি:
                  </label>
                  <select
                    value={newArticle.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let label = 'বিশেষ অনুসন্ধান';
                      if (cat === 'deprived') label = 'বঞ্চিতের কান্না ও দুর্নীতি';
                      if (cat === 'success') label = 'সফলতার গল্প';
                      if (cat === 'legal') label = 'আইনি সহায়তা ও লিগ্যাল এইড';
                      setNewArticle({ ...newArticle, category: cat, categoryLabel: label });
                    }}
                    className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                  >
                    <option value="rights">বিশেষ অনুসন্ধান (Investigative)</option>
                    <option value="deprived">বঞ্চিতের কান্না ও দুর্নীতি</option>
                    <option value="success">সফলতার গল্প</option>
                    <option value="legal">আইনি সহায়তা ও লিগ্যাল এইড</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    সংবাদের সময় / তারিখ (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    placeholder={`ডিফল্ট: ${getTodayBanglaDate()}`}
                    value={newArticle.date}
                    onChange={(e) => setNewArticle({ ...newArticle, date: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    ফিচারড ইমেজ URL (ছবির লিংক):
                  </label>
                  <input
                    type="text"
                    placeholder="https://... বা /src/assets/images/..."
                    value={newArticle.image}
                    onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Image preview if URL provided */}
              {newArticle.image && (
                <div className="p-3 bg-white border border-slate-200 flex items-center gap-3">
                  <div className="w-24 h-16 shrink-0 overflow-hidden border border-slate-300 bg-slate-100">
                    <NewsImage src={newArticle.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">ছবি প্রিভিউ (Image Preview)</span>
                    <p className="text-xs text-slate-700 truncate max-w-md font-mono">{newArticle.image}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                  সংবাদ সারসংক্ষেপ (Excerpt) <span className="text-red-600">*</span>:
                </label>
                <textarea
                  placeholder="সংবাদের একটি আকর্ষণীয় ও সংক্ষেপিত সারসংক্ষেপ..."
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-sans"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                  সংবাদের মূল বিস্তারিত বিষয়বস্তু (Body Content) <span className="text-red-600">*</span>:
                </label>
                <textarea
                  placeholder="পূর্ণাঙ্গ অনুসন্ধানী প্রতিবেদন, সাক্ষ্য-প্রমাণ ও তদন্তের তথ্য..."
                  value={newArticle.body}
                  onChange={(e) => setNewArticle({ ...newArticle, body: e.target.value })}
                  rows={8}
                  className="w-full bg-white border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 font-sans leading-relaxed"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                  হাইলাইট উক্তি / কোটেশন (Bold Quote - ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  placeholder="প্রতিবেদনের কোনো গুরুত্বপূর্ণ মন্তব্য বা সাহসী বক্তব্য..."
                  value={newArticle.quote}
                  onChange={(e) => setNewArticle({ ...newArticle, quote: e.target.value })}
                  className="w-full bg-white border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                />
              </div>

              {submitMessage && (
                <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 p-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{submitMessage}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewArticle({
                      title: '',
                      excerpt: '',
                      body: '',
                      author: 'সম্পাদকীয় অনুসন্ধানী সেল | Vulture Eyes',
                      category: 'rights',
                      categoryLabel: 'বিশেষ অনুসন্ধান',
                      image: '',
                      date: '',
                      quote: ''
                    });
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-4 transition-colors cursor-pointer"
                >
                  রিসেট ফরম
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingArticle}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2 px-6 rounded-none flex items-center gap-1.5 cursor-pointer border border-slate-900 shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-red-500" />
                  {isSubmittingArticle ? "প্রকাশ হচ্ছে..." : "নিউজ সাবমিট করুন (Publish)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 3: Manage / Edit / Delete Existing News */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          {/* Edit Modal / Inline Editor if an article is being edited */}
          {editingArticle ? (
            <div className="bg-amber-50/70 border-2 border-amber-500 p-5 shadow-md space-y-4">
              <div className="flex justify-between items-center border-b border-amber-300 pb-2">
                <h4 className="text-sm font-black text-slate-950 uppercase flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-700" />
                  সংবাদ সম্পাদনা (Editing Article): <span className="font-mono text-xs text-amber-800">ID: {editingArticle.id}</span>
                </h4>
                <button
                  onClick={() => setEditingArticle(null)}
                  className="p-1 text-slate-600 hover:text-slate-950 cursor-pointer"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateArticle} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                      শিরোনাম (Title):
                    </label>
                    <input
                      type="text"
                      value={editingArticle.title}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                      প্রতিবেদক / লেখক:
                    </label>
                    <input
                      type="text"
                      value={editingArticle.author}
                      onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                      className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                      ক্যাটাগরি:
                    </label>
                    <select
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                      className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                    >
                      <option value="rights">বিশেষ অনুসন্ধান</option>
                      <option value="deprived">বঞ্চিতের কান্না ও দুর্নীতি</option>
                      <option value="success">সফলতার গল্প</option>
                      <option value="legal">আইনি সহায়তা</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                      তারিখ / সময়:
                    </label>
                    <input
                      type="text"
                      value={editingArticle.date}
                      onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                      className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                      ছবির লিংক (Image URL):
                    </label>
                    <input
                      type="text"
                      value={editingArticle.image || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                      className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                      placeholder="ছবির লিংক..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    সংক্ষিপ্ত সারসংক্ষেপ (Excerpt):
                  </label>
                  <textarea
                    rows={2}
                    value={editingArticle.excerpt}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2 text-xs text-slate-800 focus:outline-none focus:border-amber-600"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    মূল বিস্তারিত সংবাদ (Body Text):
                  </label>
                  <textarea
                    rows={8}
                    value={editingArticle.body}
                    onChange={(e) => setEditingArticle({ ...editingArticle, body: e.target.value })}
                    className="w-full bg-white border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-600 font-sans leading-relaxed"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 uppercase">
                    উদ্ধৃতি / কোটেশন (Bold Quote):
                  </label>
                  <input
                    type="text"
                    value={editingArticle.quote || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, quote: e.target.value })}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                    placeholder="কোটেশন..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-1.5 px-4 cursor-pointer"
                  >
                    বাতিল করুন
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingArticle}
                    className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs py-1.5 px-5 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isUpdatingArticle ? "আপডেট হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন (Save Updates)"}
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {/* List of articles with Search & Actions */}
          <div className="bg-slate-50 border border-slate-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-200 pb-3">
              <div>
                <h4 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide">
                  প্রকাশিত সমস্ত খবরের তালিকা ({newsList.length} টি)
                </h4>
                <p className="text-[10.5px] text-slate-500">
                  যেকোনো সংবাদের শিরোনাম, বিবরণ, ছবি বা তারিখ পরিবর্তন অথবা সরাসরি ডিলিট করুন
                </p>
              </div>

              {/* Search bar inside manage */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="খবর খুঁজুন..."
                  value={manageSearch}
                  onChange={(e) => setManageSearch(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-xs pl-3 pr-8 py-1.5 text-slate-800 focus:outline-none focus:border-red-600"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2" />
              </div>
            </div>

            {filteredNewsList.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">কোনো সংবাদ পাওয়া যায়নি।</p>
            ) : (
              <div className="divide-y divide-slate-200 bg-white border border-slate-200">
                {filteredNewsList.map((item) => (
                  <div key={item.id} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Image Thumbnail */}
                      <div className="w-20 h-14 shrink-0 overflow-hidden border border-slate-200 bg-slate-100 hidden sm:block">
                        <NewsImage src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="bg-slate-900 text-white font-bold px-1.5 py-0.2">
                            {item.categoryLabel || item.category}
                          </span>
                          <span className="text-slate-400 font-mono">•</span>
                          <span className="text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {item.date}
                          </span>
                          <span className="text-slate-400 font-mono">•</span>
                          <span className="text-slate-600 font-medium truncate max-w-[150px]">
                            {item.author}
                          </span>
                        </div>

                        <h5 className="text-xs md:text-[13px] font-black text-slate-950 font-serif line-clamp-1">
                          {item.title}
                        </h5>

                        <p className="text-[11px] text-slate-600 line-clamp-1">
                          {item.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons (Edit & Delete) */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => {
                          setEditingArticle(item);
                          window.scrollTo({ top: 150, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 transition-colors cursor-pointer"
                        title="সম্পাদনা করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                        এডিট
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(item.id, item.title)}
                        className="flex items-center gap-1 text-[11px] font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 px-3 py-1.5 transition-colors cursor-pointer"
                        title="ডিলিট করুন"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        ডিলিট
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Social Media Feed moderation */}
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
                    <option value="Vulture Eyes">Vulture Eyes (ভালচার আইস)</option>
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
                    placeholder="উদা: VultureEyes, দুর্নীতি, তেল_সিন্ডিকেট"
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
