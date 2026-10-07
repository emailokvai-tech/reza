import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, Share2, MessageSquare, Search, Send, CheckCircle2, Globe, Radio, Sparkles } from 'lucide-react';

export interface SocialMediaPost {
  id: string;
  portalName: string;
  portalUsername: string;
  portalLogo: string;
  isVerified: boolean;
  timeAgo: string;
  content: string;
  hashtags: string[];
  likes: number;
  commentsCount: number;
  shares: number;
  comments: Array<{ id: string; author: string; text: string; date: string }>;
  sourceUrl: string;
}

export default function SocialMediaFeed() {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPortal, setSelectedPortal] = useState('all');
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  
  // Custom comment form states
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');

  // Fetch social media news from server API
  const fetchSocialMediaNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/social-media');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error("Error fetching social media news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialMediaNews();
  }, []);

  // Handle Like action
  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/social-media/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  // Handle Share action
  const handleShare = async (postId: string) => {
    try {
      const res = await fetch(`/api/social-media/${postId}/share`, { method: 'POST' });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
        // Copy link to clipboard
        navigator.clipboard?.writeText?.(updatedPost.sourceUrl || window.location.href);
        alert('সোশ্যাল পোস্টের লিংকটি ক্লিপবোর্ডে কপি করা হয়েছে!');
      }
    } catch (err) {
      console.error("Error sharing post:", err);
    }
  };

  // Handle Comment submit
  const handleCommentSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    try {
      const res = await fetch(`/api/social-media/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: commentAuthor, text: commentText })
      });
      if (res.ok) {
        const updatedPost = await res.json();
        setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
        setCommentAuthor('');
        setCommentText('');
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery.trim() === '' || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.portalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPortal = selectedPortal === 'all' || post.portalName === selectedPortal;

    return matchesSearch && matchesPortal;
  });

  // Extract unique portal names for the filter dropdown
  const uniquePortals = Array.from(new Set(posts.map(p => p.portalName)));

  return (
    <div className="space-y-6" id="social-media-news-feed">
      {/* Search and filter controls panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-none flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="p-1.5 bg-slate-900 text-red-500">
            <Radio className="w-4 h-4 animate-pulse text-red-500" />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-black text-slate-950 uppercase tracking-wide flex items-center gap-1">
              সোশ্যাল মিডিয়া সংবাদ ডেস্ক <span className="bg-red-700 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-none font-bold uppercase">LIVE</span>
            </h3>
            <p className="text-[10px] text-slate-500">বিভিন্ন শীর্ষ পোর্টালের আরএসএস ও ফেসবুক ফিড থেকে সংগৃহীত সর্বশেষ {posts.length} টি খবর</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          {/* Custom portal filter */}
          <select
            value={selectedPortal}
            onChange={(e) => setSelectedPortal(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs px-3 py-2 rounded-none focus:outline-none focus:border-slate-800"
          >
            <option value="all">সকল সোর্স (All Portals)</option>
            {uniquePortals.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Inline Feed Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="সোশ্যাল সংবাদ অনুসন্ধান..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs pl-8 pr-3 py-2 rounded-none focus:outline-none focus:border-slate-800 w-full sm:w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 space-y-2">
          <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-bold">সোশ্যাল মিডিয়া নিউজ পোর্টাল ফিড লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex justify-between items-center text-[11px] text-slate-500 px-1">
            <p>দেখানো হচ্ছে: <span className="font-bold text-slate-900">{filteredPosts.length}</span> টি সংবাদ</p>
            <p className="font-mono bg-slate-100 px-2 py-0.5 border border-slate-200">সিস্টেম রিমোট আরএসএস সিঙ্ক: সচল</p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-white border border-slate-200 p-8 text-center space-y-2">
              <p className="text-xs font-bold text-slate-900">কোনো সোশ্যাল সংবাদ খুঁজে পাওয়া যায়নি।</p>
              <p className="text-[11px] text-slate-500">অনুগ্রহ করে অনুসন্ধানের কী-ওয়ার্ড বা ফিল্টার পরিবর্তন করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-slate-200 rounded-none p-4 hover:border-slate-800 transition-all flex flex-col justify-between"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {/* Profile Avatar */}
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center border border-slate-800">
                          {post.portalLogo}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-extrabold text-slate-950 leading-none">{post.portalName}</h4>
                            {post.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-current" />}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{post.portalUsername}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-50 border border-slate-200 px-2 py-0.5">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span>{post.timeAgo}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-xs text-slate-800 text-justify leading-relaxed whitespace-pre-line">
                      {post.content}
                    </div>

                    {/* Hashtags */}
                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {post.hashtags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-bold text-blue-700 hover:underline cursor-pointer">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions & Comment list */}
                  <div className="mt-4 border-t border-slate-150 pt-2.5">
                    {/* Engagement Counts */}
                    <div className="flex justify-between items-center text-[10.5px] text-slate-500 pb-2 border-b border-slate-100">
                      <span>{post.likes} জন সহমত প্রকাশ করেছেন</span>
                      <div className="flex gap-2">
                        <span>{post.commentsCount} মন্তব্য</span>
                        <span>•</span>
                        <span>{post.shares} শেয়ার</span>
                      </div>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex justify-between items-center pt-2 text-xs font-bold text-slate-600">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1 bg-slate-50 hover:bg-slate-100"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> সহমত
                      </button>

                      <button
                        onClick={() => setExpandedCommentsId(expandedCommentsId === post.id ? null : post.id)}
                        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1 bg-slate-50 hover:bg-slate-100"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> মতামত দিন
                      </button>

                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1 bg-slate-50 hover:bg-slate-100"
                      >
                        <Share2 className="w-3.5 h-3.5" /> শেয়ার
                      </button>
                    </div>

                    {/* Expanded Comments Drawer */}
                    <AnimatePresence>
                      {expandedCommentsId === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 bg-slate-50 p-2.5 border border-slate-200 space-y-2.5 overflow-hidden"
                        >
                          <h5 className="text-[10px] font-black text-slate-900 uppercase">মতামত ও প্রতিক্রিয়া কলাম:</h5>
                          
                          {/* Comments list */}
                          <div className="space-y-1.5 max-h-36 overflow-y-auto">
                            {post.comments.length === 0 ? (
                              <p className="text-[10px] text-slate-400 italic">এখনো কোনো মতামত দেওয়া হয়নি। প্রথম মতামতটি আপনার হোক।</p>
                            ) : (
                              post.comments.map(c => (
                                <div key={c.id} className="bg-white p-2 border border-slate-150 text-[11px]">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-extrabold text-slate-900">{c.author}</span>
                                    <span className="text-[9px] text-slate-400">{c.date}</span>
                                  </div>
                                  <p className="text-slate-700 leading-snug">{c.text}</p>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Submit custom comment form */}
                          <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="space-y-1.5 pt-1.5 border-t border-slate-200">
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                placeholder="আপনার নাম..."
                                value={commentAuthor}
                                onChange={(e) => setCommentAuthor(e.target.value)}
                                className="bg-white border border-slate-250 text-[10px] px-2 py-1 focus:outline-none"
                                required
                              />
                              <span className="text-[8px] text-slate-400 flex items-center">
                                * জনস্বার্থে যাচাই করা হবে
                              </span>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="আপনার সাহসী প্রতিবাদ বা সংহতি জানান..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full bg-white border border-slate-250 text-[10px] pl-2 pr-8 py-1 focus:outline-none"
                                required
                              />
                              <button type="submit" className="absolute right-1.5 top-1 text-slate-600 hover:text-slate-900">
                                <Send className="w-3 h-3" />
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
