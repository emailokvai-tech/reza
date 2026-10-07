import React, { useState } from 'react';
import { ThumbsUp, Share2, MessageSquare, ShieldAlert, AlertTriangle, Send, Sparkles, Quote } from 'lucide-react';
import { NewsItem } from '../types.ts';

interface LeadNewsProps {
  newsList: NewsItem[];
  onLike: (id: string) => void;
  onShare: (id: string, url?: string) => void;
  onRefresh: () => void;
}

export default function LeadNews({ newsList, onLike, onShare, onRefresh }: LeadNewsProps) {
  // Identify the lead news and secondary news from the list
  const leadArticle = newsList.find(item => item.id === 'news-mymensingh-cyber-syndicate') || newsList.find(item => item.id === 'news-morshed-syndicate') || newsList.find(item => item.id === 'news-iqbal-brokerage') || newsList[0];
  const secondArticle = newsList.find(item => item.id === 'news-morshed-syndicate') || newsList.find(item => item.id === 'news-iqbal-brokerage') || newsList.find(item => item.id === 'news-iqbal-lead') || newsList.find(item => item.id !== leadArticle?.id) || newsList[1];

  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  if (!leadArticle) {
    return (
      <div className="bg-white border border-slate-200 p-6 text-center animate-pulse">
        <div className="h-4 bg-slate-200 w-1/3 mx-auto mb-3"></div>
        <div className="h-8 bg-slate-200 w-3/4 mx-auto mb-2"></div>
        <div className="h-4 bg-slate-200 w-1/2 mx-auto"></div>
      </div>
    );
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/news/${leadArticle.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: commentAuthor, text: commentText })
      });
      if (res.ok) {
        setCommentAuthor('');
        setCommentText('');
        onRefresh(); // Refresh parent news list to show new comment
      }
    } catch (err) {
      console.error("Error adding comment in LeadNews:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Helper to remove any author or reporter information from the beginning of the text
  const cleanBodyText = (text: string): string => {
    if (!text) return "";
    // Remove typical Bangladeshi reporter headers if they appear at the start
    return text
      .replace(/^(নিজস্ব প্রতিবেদক|ময়মনসিংহ সদর|ময়মনসিংহ|বিশেষ প্রতিনিধি)\s*(?:\||:|-)?\s*/i, "")
      .trim();
  };

  return (
    <div className="space-y-4" id="lead-news-container">
      {/* Grid containing primary investigative lead and secondary detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Area: Main Featured Story (8 columns) - Highly compact heading */}
        <div className="lg:col-span-8 bg-white border border-slate-200 p-4 md:p-5 shadow-none flex flex-col justify-between" id="primary-investigative-lead">
          <div>
            {/* Top Label Badge - Compact & Minimalist */}
            <div className="flex items-center gap-1.5 mb-2.5 text-[10px]">
              <span className="flex items-center gap-1 bg-red-600 text-white font-black px-1.5 py-0.5 tracking-wide uppercase">
                <ShieldAlert className="w-3 h-3 text-white" />
                বিশেষ অনুসন্ধানী প্রতিবেদন
              </span>
              <span className="text-slate-400 font-bold">•</span>
              <span className="text-slate-500 font-bold">{leadArticle.date}</span>
              {leadArticle.isAIExpanded && (
                <>
                  <span className="text-slate-400 font-bold">•</span>
                  <span className="text-purple-700 font-black flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> এআই সিঙ্ক
                  </span>
                </>
              )}
            </div>

            {/* Title - Compact line-height & letter spacing */}
            <h2 className="text-lg md:text-xl font-black text-slate-900 font-serif leading-tight hover:text-purple-900 transition-colors tracking-tight">
              {leadArticle.title}
            </h2>

            {leadArticle.image && (
              <div className="my-3 overflow-hidden border border-slate-200 aspect-[16/9] w-full bg-slate-100">
                <img 
                  src={leadArticle.image} 
                  alt={leadArticle.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Excerpt - Compact & Elegant banner */}
            <p className="text-[12px] text-slate-800 font-bold bg-slate-50 border-l-3 border-slate-900 p-2.5 mt-2 leading-relaxed text-justify">
              {leadArticle.excerpt}
            </p>

            {/* Main Body Content - Cleaned of starting reporter credits */}
            <div className="text-slate-800 text-[12px] md:text-[12.5px] leading-relaxed text-justify space-y-3 font-sans mt-3 whitespace-pre-line">
              {cleanBodyText(leadArticle.body)}
            </div>

            {/* Highlighted Quote Callout block */}
            {leadArticle.quote && (
              <div className="bg-slate-50 border-l-3 border-purple-800 p-2.5 my-3 relative italic text-[11px] text-slate-700 leading-relaxed text-justify font-serif">
                <Quote className="w-4 h-4 text-purple-200 absolute -top-1.5 -left-1 opacity-60" />
                <p className="font-semibold">"{leadArticle.quote}"</p>
              </div>
            )}
            
            {/* AUTHOR / REPORTER INFO AT THE VERY END OF THE STORY BODY */}
            <div className="border-t border-slate-100 mt-4 pt-2 text-right">
              <span className="text-[11px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 border border-slate-200">
                প্রতিবেদনটি পরিবেশন করেছেন: <strong className="text-slate-800">{leadArticle.author || "নিজস্ব প্রতিবেদক"}</strong>
              </span>
            </div>
          </div>

          {/* Post Interaction (Like, Share, Comment indicators) */}
          <div className="mt-4">
            <div className="flex items-center justify-between border-y border-slate-200 py-2">
              <button
                onClick={() => onLike(leadArticle.id)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 text-xs font-bold text-slate-700"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-slate-600" />
                সহমত ({leadArticle.likes})
              </button>
              
              <button
                onClick={() => onShare(leadArticle.id)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 text-xs font-bold text-slate-700"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-600" />
                শেয়ার ({leadArticle.shares})
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 text-xs font-bold text-slate-700"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-700" />
                মন্তব্য ({leadArticle.comments?.length || 0})
              </button>
            </div>

            {/* Interactive Comments Form & Feed */}
            {showComments && (
              <div className="mt-3 bg-slate-50 p-3 border border-slate-200 space-y-3">
                <h3 className="text-xs font-black text-slate-900 border-b border-slate-200 pb-1.5 uppercase">
                  জনগণের প্রতিক্রিয়া ও প্রতিবাদ কলাম
                </h3>
                
                <form onSubmit={handleCommentSubmit} className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="আপনার নাম..."
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="bg-white border border-slate-300 px-3 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                      required
                    />
                    <span className="text-[10px] text-slate-500 flex items-center italic">
                      * যাচাই সাপেক্ষে প্রকাশিত হবে।
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="এই অপরাধের বিরুদ্ধে আপনার মতামত বাংলা ভাষায় লিখুন..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-white border border-slate-300 pl-3 pr-10 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-800"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="absolute right-1.5 top-1 text-slate-600 hover:text-slate-900 cursor-pointer p-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                {/* Comment list items */}
                <div className="space-y-2 max-h-48 overflow-y-auto pt-1">
                  {!leadArticle.comments || leadArticle.comments.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">এখনো কোনো মন্তব্য দেওয়া হয়নি। প্রথম মন্তব্যটি আপনার হোক।</p>
                  ) : (
                    leadArticle.comments.map((comment) => (
                      <div key={comment.id} className="bg-white border border-slate-200 p-2.5 shadow-none text-[11px] leading-relaxed">
                        <div className="flex justify-between items-center mb-1 font-bold">
                          <span className="text-slate-900">{comment.author}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{comment.date}</span>
                        </div>
                        <p className="text-slate-700 text-justify">
                          {comment.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Secondary Lead Undercover Story (4 columns) - Highly compact */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {secondArticle ? (
            <div className="bg-slate-950 text-slate-100 border border-slate-800 p-4 shadow-none flex flex-col justify-between flex-1" id="undercover-story-card">
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
                  <span className="bg-red-600 text-white text-[9px] font-black uppercase px-1.5 py-0.5 tracking-wide animate-pulse">
                    তাজা খবর
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{secondArticle.date}</span>
                </div>

                {/* Headline */}
                <h3 className="text-sm font-extrabold font-sans text-white leading-tight mb-2 tracking-tight hover:text-purple-300 transition-colors">
                  {secondArticle.title}
                </h3>
                
                {secondArticle.image && (
                  <div className="my-2.5 overflow-hidden border border-slate-800 aspect-[16/9] w-full bg-slate-900">
                    <img 
                      src={secondArticle.image} 
                      alt={secondArticle.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                {/* Body / Excerpt */}
                <p className="text-[11px] text-slate-300 text-justify leading-relaxed mb-3">
                  {secondArticle.excerpt}
                </p>

                {/* Dynamic Details block */}
                <div className="space-y-2.5 border-t border-slate-800 pt-2.5">
                  <p className="text-[10.5px] text-slate-400 text-justify leading-relaxed">
                    {cleanBodyText(secondArticle.body).substring(0, 240)}...
                  </p>
                  
                  {secondArticle.quote && (
                    <div className="border-l-2 border-amber-500/40 pl-2 py-0.5 my-2">
                      <p className="text-[10.5px] text-amber-400 font-serif italic text-justify">
                        "{secondArticle.quote}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* REPORTER INFO AT THE VERY END OF THE SECONDARY CARD */}
              <div className="mt-4 border-t border-slate-800 pt-2 flex justify-between items-center">
                <span className="text-[9.5px] text-slate-500 font-bold">
                  লেখক: {secondArticle.author || "নিজস্ব প্রতিবেদক"}
                </span>
                <button
                  onClick={() => onLike(secondArticle.id)}
                  className="flex items-center gap-1 text-[10px] text-slate-300 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-2 py-0.5"
                >
                  <ThumbsUp className="w-3 h-3 text-amber-500" /> সহমত ({secondArticle.likes})
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 text-slate-100 border border-slate-800 p-4 shadow-none flex-1 flex items-center justify-center text-xs text-slate-500">
              কোনো সংযোগ সংবাদ পাওয়া যায়নি।
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
