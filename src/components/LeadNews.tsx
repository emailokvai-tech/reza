import React, { useState } from 'react';
import { ThumbsUp, Share2, MessageSquare, ShieldAlert, AlertTriangle, Send, Quote, FileText, CheckCircle2 } from 'lucide-react';
import { NewsItem } from '../types.ts';
import EvidenceDossier from './EvidenceDossier.tsx';

interface LeadNewsProps {
  newsList: NewsItem[];
  onLike: (id: string) => void;
  onShare: (id: string, url?: string) => void;
  onRefresh: () => void;
}

export default function LeadNews({ newsList, onLike, onShare, onRefresh }: LeadNewsProps) {
  // Find the primary lead investigative report about Mahbub Depot
  const leadArticle = newsList.find(item => item.id === 'lead-investigation-mahbub-depot') || 
                      newsList.find(item => item.title.includes('মাহবুবুর রহমান') || item.title.includes('গোদনাইল ডিপো')) || 
                      newsList[0];

  const secondaryArticles = newsList
    .filter(item => item.id !== leadArticle?.id)
    .slice(0, 3);

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
        onRefresh();
      }
    } catch (err) {
      console.error("Error adding comment in LeadNews:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Helper to format markdown tables or headers inside body text
  const renderFormattedBody = (text: string) => {
    // If text contains markdown table lines, split and format cleanly
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    const flushTable = (keyIndex: number) => {
      if (tableRows.length > 0) {
        const headers = tableRows[0];
        const dataRows = tableRows.slice(1);
        elements.push(
          <div key={`table-${keyIndex}`} className="my-4 overflow-x-auto border border-slate-300 shadow-sm bg-white">
            <div className="bg-slate-900 text-white px-3 py-2 text-xs font-black uppercase flex items-center justify-between">
              <span>অর্জিত দৃশ্যমান সম্পদের সরেজমিন তালিকা (খতিয়ান ও মাঠপর্যায়ের রেকর্ড)</span>
              <span className="text-[10px] text-red-400 font-mono">৮টি প্রধান সম্পদ</span>
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-black text-[11px]">
                  {headers.map((h, hi) => (
                    <th key={hi} className="p-2.5 border-r border-slate-200 last:border-r-0">{h.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dataRows.map((row, ri) => (
                  <tr key={ri} className="hover:bg-slate-50 transition-colors">
                    {row.map((cell, ci) => (
                      <td key={ci} className={`p-2.5 border-r border-slate-200 last:border-r-0 ${ci === 3 ? 'font-black text-red-700' : ''}`}>
                        {cell.trim()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        // Table line
        if (trimmed.includes('---')) {
          // Separator line, ignore
          return;
        }
        inTable = true;
        const cols = trimmed.slice(1, -1).split('|');
        tableRows.push(cols);
      } else {
        if (inTable) {
          flushTable(index);
        }

        if (trimmed.startsWith('১.') || trimmed.startsWith('২.') || trimmed.startsWith('৩.') || 
            trimmed.startsWith('৪.') || trimmed.startsWith('৫.') || trimmed.startsWith('৬.') || 
            trimmed.startsWith('৭.') || trimmed.startsWith('৮.')) {
          elements.push(
            <h3 key={`h-${index}`} className="text-sm md:text-base font-black text-slate-950 font-serif border-l-4 border-red-600 pl-2.5 mt-4 mb-2 bg-slate-50 py-1">
              {trimmed}
            </h3>
          );
        } else if (trimmed.startsWith('•') || trimmed.startsWith('*')) {
          elements.push(
            <p key={`bullet-${index}`} className="text-slate-800 pl-4 py-0.5 relative flex items-start gap-1.5 leading-relaxed">
              <span className="text-red-600 font-bold shrink-0 mt-0.5">▪</span>
              <span>{trimmed.replace(/^[•*]\s*/, '')}</span>
            </p>
          );
        } else if (trimmed.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="text-slate-800 leading-relaxed text-justify mb-2">
              {trimmed}
            </p>
          );
        }
      }
    });

    if (inTable) {
      flushTable(lines.length);
    }

    return elements;
  };

  return (
    <div className="space-y-4" id="lead-news-container">
      {/* Grid containing primary investigative lead and sidebar details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Area: Main Featured Story (8 columns) */}
        <article className="lg:col-span-8 bg-white border border-slate-200 p-4 md:p-6 shadow-sm flex flex-col justify-between" id="primary-investigative-lead">
          <div>
            {/* Top Label Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3 text-[10.5px]">
              <span className="flex items-center gap-1 bg-red-600 text-white font-black px-2 py-0.5 tracking-wide uppercase">
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                প্রধান অনুসন্ধানী প্রতিবেদন
              </span>
              <span className="text-slate-400 font-bold">•</span>
              <span className="text-slate-600 font-bold">{leadArticle.date}</span>
              <span className="text-slate-400 font-bold">•</span>
              <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 border border-slate-300">
                বিশেষ তদন্ত সেল | Vulture Eyes
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-950 font-serif leading-tight hover:text-red-700 transition-colors tracking-tight mb-3">
              {leadArticle.title}
            </h1>

            {/* Excerpt - Lead Highlight Callout */}
            <div className="text-[13px] text-slate-900 font-semibold bg-red-50/70 border-l-4 border-red-600 p-3.5 my-3 leading-relaxed text-justify shadow-xs">
              {leadArticle.excerpt}
            </div>

            {/* EVIDENCE DOSSIER EMBED - Directly placed inside the Lead Story */}
            <EvidenceDossier />

            {/* Main Body Content with structured sections and asset table */}
            <div className="text-slate-800 text-[12.5px] md:text-[13px] leading-relaxed text-justify space-y-2 font-sans mt-4">
              {renderFormattedBody(leadArticle.body)}
            </div>

            {/* Bold Quote Callout Block */}
            {leadArticle.quote && (
              <div className="bg-slate-900 text-white border-l-4 border-red-600 p-4 my-4 relative italic text-xs md:text-[13px] leading-relaxed text-justify font-serif shadow-md">
                <Quote className="w-6 h-6 text-red-500/30 absolute -top-2 -left-1" />
                <p className="font-semibold text-slate-100">"{leadArticle.quote}"</p>
                <span className="block text-right text-[10.5px] text-red-400 font-mono font-bold mt-2">
                  — অনুসন্ধানী মতামত, Vulture Eyes
                </span>
              </div>
            )}
            
            {/* Editorial Sign-off */}
            <div className="border-t border-slate-200 mt-6 pt-3 flex flex-wrap justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">
                প্রতিবেদনটি সংকলন ও যাচাই করেছে: <strong className="text-slate-950">{leadArticle.author}</strong>
              </span>
              <span className="bg-emerald-50 text-emerald-800 font-bold border border-emerald-300 px-2.5 py-0.5 text-[10.5px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> আইনি ও নথিপত্র যাচাই সম্পন্ন
              </span>
            </div>
          </div>

          {/* Post Interaction (Like, Share, Comment indicators) */}
          <div className="mt-5 border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-150">
              <button
                onClick={() => onLike(leadArticle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300 text-xs font-bold text-slate-800"
              >
                <ThumbsUp className="w-4 h-4 text-slate-700" />
                সহমত ({leadArticle.likes})
              </button>
              
              <button
                onClick={() => onShare(leadArticle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300 text-xs font-bold text-slate-800"
              >
                <Share2 className="w-4 h-4 text-slate-700" />
                শেয়ার ({leadArticle.shares})
              </button>

              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-300 text-xs font-bold text-slate-800"
              >
                <MessageSquare className="w-4 h-4 text-slate-700" />
                মতামত ({leadArticle.comments?.length || 0})
              </button>
            </div>

            {/* Comment Drawer */}
            {showComments && (
              <div className="mt-4 bg-slate-50 border border-slate-200 p-4 space-y-4">
                <h4 className="text-xs font-black text-slate-950 uppercase tracking-wide border-b border-slate-200 pb-2">
                  পাঠক ও নাগরিক প্রতিক্রিয়া কলাম:
                </h4>

                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {leadArticle.comments?.map((comment) => (
                    <div key={comment.id} className="bg-white p-3 border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-950">{comment.author}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{comment.date}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-justify">{comment.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCommentSubmit} className="space-y-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    placeholder="আপনার নাম বা পরিচয়..."
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                    required
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="আপনার বস্তুনিষ্ঠ প্রতিক্রিয়া লিখুন..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-white border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                      required
                    />
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs px-4 py-1.5 transition-colors cursor-pointer shrink-0 flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {submittingComment ? 'পাঠানো হচ্ছে...' : 'পাঠান'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </article>

        {/* Right Sidebar: Quick Investigative Highlights & Syndicate Dossiers */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Top Dossier Summary Card */}
          <div className="bg-slate-950 text-white p-4 border border-slate-900">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
              <span className="w-2.5 h-2.5 bg-red-600"></span>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                তদন্ত ডকেট: গোদনাইল ডিপো কেলেঙ্কারি
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-900 p-2.5 border-l-2 border-red-500">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">অভিযুক্ত কর্মকর্তা</span>
                <p className="font-extrabold text-slate-100 mt-0.5">মো: মাহবুবুর রহমান (ডিএস মাহবুব)</p>
                <p className="text-[10.5px] text-slate-400">সহকারী মহাব্যবস্থাপক (এজিএম) ও ডিপো ইনচার্জ</p>
              </div>

              <div className="bg-slate-900 p-2.5 border-l-2 border-amber-500">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">অভিযোগের সারসংক্ষেপ</span>
                <p className="text-[11px] text-slate-200 mt-0.5 leading-relaxed">
                  লাইটার জাহাজে ভাসমান তেলের মজুদ, অনুমোদনহীন পাম্পে পাচার এবং নিচু স্তরের কর্মচারীদের বলির পাঁঠা বানানো।
                </p>
              </div>

              <div className="bg-slate-900 p-2.5 border-l-2 border-emerald-500">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">দৃশ্যমান সম্পদের পরিমাণ</span>
                <p className="font-extrabold text-emerald-400 mt-0.5">শতকোটি টাকার স্থাবর সাম্রাজ্য</p>
                <p className="text-[10.5px] text-slate-400">হাবিবা টাওয়ার, সাদিয়া গার্ডেন, টুম্পা টাওয়ার, জমি ও দোকান</p>
              </div>
            </div>
          </div>

          {/* Secondary Featured Reports */}
          <div className="bg-white border border-slate-200 p-4">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
              <span>অন্যান্য বিশেষ অনুসন্ধানী প্রতিবেদন</span>
              <span className="text-[10px] text-red-600 font-mono font-bold">তদন্ত সেল</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {secondaryArticles.map((article, idx) => (
                <div key={article.id} className="py-2.5 first:pt-0 last:pb-0">
                  <span className="text-[9.5px] font-bold text-red-600 font-mono">
                    অনুসন্ধান #{idx + 1} • {article.date}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 hover:text-red-700 transition-colors cursor-pointer leading-snug mt-0.5 font-serif">
                    {article.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Whistleblower / Investigation Tip Hotline Box */}
          <div className="bg-red-700 text-white p-4 border border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-5 h-5 text-white" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                গোপন তথ্য ও প্রমাণ জমা দিন
              </h4>
            </div>
            <p className="text-[11px] text-red-100 leading-relaxed text-justify mb-3">
              দুর্নীতি, রাষ্ট্রীয় সম্পদ আত্মসাৎ বা ক্ষমতার অপব্যবহারের গোপন অডিও, ভিডিও বা নথি থাকলে নির্ভয়ে 'Vulture Eyes'-এর স্পেশাল ক্রাইম ডেস্কে তথ্য পাঠান। তথ্যদাতার পরিচয় কঠোরভাবে সুরক্ষিত থাকবে।
            </p>
            <div className="bg-red-900/80 p-2 text-center text-xs font-mono font-black border border-red-500/40">
              হটলাইন ইমেইল: desk@vultureeyes.com
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
