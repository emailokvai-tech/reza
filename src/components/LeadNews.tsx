import React from 'react';
import { Calendar, User, BookOpen, ChevronRight, ThumbsUp, Share2, MessageSquare, Volume2 } from 'lucide-react';
import { NewsItem } from '../types.ts';
import NewsImage from './NewsImage.tsx';

interface LeadNewsProps {
  newsList: NewsItem[];
  onLike: (id: string) => void;
  onShare: (id: string) => void;
  onSelectArticle: (article: NewsItem) => void;
  onListenArticle?: (article: NewsItem) => void;
}

export default function LeadNews({ newsList, onLike, onShare, onSelectArticle, onListenArticle }: LeadNewsProps) {
  const leadArticle = newsList[0];
  const secondaryArticles = newsList
    .filter(item => item.id !== leadArticle?.id)
    .slice(0, 4);

  if (!leadArticle) {
    return null;
  }

  return (
    <section className="bg-white border border-slate-200 p-4 sm:p-6 mb-6 shadow-xs font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Lead Story (Left & Center Columns) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Shoulder / Kicker & Dateline */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-red-600 text-white font-black px-2.5 py-0.5 uppercase tracking-wide text-[10.5px] rounded-xs">
              {leadArticle.categoryLabel || 'প্রধান সংবাদ'}
            </span>
            <span className="text-slate-300 font-bold">•</span>
            <span className="text-slate-600 font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {leadArticle.date}
            </span>
            <span className="text-slate-300 font-bold">•</span>
            <span className="text-[#0f3d2e] font-bold flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              {leadArticle.author || 'নিজস্ব প্রতিবেদক'}
            </span>
          </div>

          {/* Authentic Lead Photo or Dual-Photo Page Makeup */}
          {leadArticle.gallery && leadArticle.gallery.length > 1 ? (
            <div className="space-y-2 my-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {leadArticle.gallery.map((gItem, gIdx) => (
                  <div 
                    key={gIdx} 
                    className="overflow-hidden border border-slate-300 bg-slate-50 p-2 rounded-xs cursor-pointer space-y-1.5 shadow-2xs"
                    onClick={() => onSelectArticle(leadArticle)}
                  >
                    <div className="overflow-hidden bg-slate-900/5 flex items-center justify-center border border-slate-200">
                      <NewsImage 
                        src={gItem.url} 
                        alt={gItem.caption || leadArticle.title} 
                        aspectRatio="auto"
                        objectFit="contain"
                        maxHeight="max-h-[280px]"
                        className="w-full hover:scale-101 transition-transform duration-300"
                      />
                    </div>
                    {gItem.caption && (
                      <p className="text-[11px] text-slate-700 font-medium leading-snug line-clamp-2">
                        <span className="font-bold text-[#0f3d2e] mr-1">ছবি {gIdx + 1}:</span>
                        {gItem.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : leadArticle.image && leadArticle.image.trim() !== '' ? (
            <div className="space-y-1.5 my-2">
              <div 
                className="overflow-hidden border border-slate-300 bg-slate-900/5 rounded-xs flex items-center justify-center cursor-pointer p-1"
                onClick={() => onSelectArticle(leadArticle)}
              >
                <NewsImage 
                  src={leadArticle.image} 
                  alt={leadArticle.title} 
                  aspectRatio="auto"
                  objectFit="contain"
                  maxHeight="max-h-[520px]"
                  className="w-auto max-w-full hover:scale-101 transition-transform duration-300"
                />
              </div>
              <p className="text-[11.5px] text-slate-600 font-medium italic text-center">
                {leadArticle.id === 'joybarta-lead-7-november-1975'
                  ? 'ঐতিহাসিক আলোকচিত্র: সাবেক রাষ্ট্রপতি শহীদ জিয়াউর রহমান (বীর উত্তম)'
                  : leadArticle.id === 'joybarta-sherpur-police-officers-mess-2026'
                  ? 'ছবি: শেরপুরে প্রস্তাবিত অফিসার্স মেসের স্থান পরিদর্শনে ময়মনসিংহ রেঞ্জ ডিআইজি ও পুলিশ কর্মকর্তাবৃন্দ।'
                  : leadArticle.id === 'joybarta-mymensingh-elbert-chowdhury-fraud-2026'
                  ? 'ছবি: ময়মনসিংহে গ্রাহকদের ৪ কোটি টাকা আত্মসাতের অভিযোগে আটক এলবার্ট চৌধুরী।'
                  : 'ছবি: জয়বার্তা'}
              </p>
            </div>
          ) : null}

          {/* Lead Headline */}
          <h1 
            onClick={() => onSelectArticle(leadArticle)}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-serif leading-tight hover:text-[#0f3d2e] transition-colors cursor-pointer"
          >
            {leadArticle.title}
          </h1>

          {/* Lead Paragraph Summary */}
          <p className="text-sm sm:text-base text-slate-800 leading-relaxed text-justify bg-slate-50 border-l-4 border-[#0f3d2e] p-4 font-medium">
            {leadArticle.excerpt}
          </p>

          {/* Body snippet */}
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed text-justify line-clamp-3">
            {leadArticle.body}
          </p>

          {/* Read Full Article Button & Action Tools */}
          <div className="border-t border-slate-200 pt-3 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectArticle(leadArticle)}
                className="bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold text-xs px-4 py-2 rounded-xs inline-flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>পূর্ণাঙ্গ সংবাদ পড়ুন</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onListenArticle ? onListenArticle(leadArticle) : onSelectArticle(leadArticle)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                title="সংবাদটি শুনুন (প্রমিত বাংলা পুরুষ কণ্ঠ — জয়বার্তা বাচনিক পাঠ)"
              >
                <Volume2 className="w-4 h-4" />
                <span>সংবাদ শুনুন</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <button
                onClick={() => onLike(leadArticle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xs transition-colors cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#0f3d2e]" />
                <span>সহমত ({leadArticle.likes})</span>
              </button>
              <button
                onClick={() => onShare(leadArticle.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>শেয়ার ({leadArticle.shares})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Column: Top Stories / শীর্ষ ও সমসাময়িক সংবাদ */}
        <aside className="space-y-4 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-6">
          <div className="border-b-2 border-[#0f3d2e] pb-1.5 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase text-[#0f3d2e] tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-600 inline-block"></span>
              <span>শীর্ষ ও সমসাময়িক সংবাদ</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-400">জয়বার্তা ডেস্ক</span>
          </div>

          <div className="space-y-4">
            {secondaryArticles.map((article, idx) => (
              <article 
                key={article.id} 
                onClick={() => onSelectArticle(article)}
                className="group border-b border-slate-100 pb-3.5 space-y-1.5 last:border-b-0 cursor-pointer"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-bold text-[#0f3d2e]">{article.categoryLabel || 'সংবাদ'}</span>
                  <span>{article.date}</span>
                </div>

                {/* Show authentic image if available */}
                {article.image && article.image.trim() !== '' && (
                  <div className="overflow-hidden border border-slate-200 mb-1">
                    <NewsImage 
                      src={article.image} 
                      alt={article.title} 
                      aspectRatio="video" 
                      className="w-full group-hover:scale-102 transition-transform duration-200"
                    />
                  </div>
                )}

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0f3d2e] transition-colors leading-snug font-serif">
                  {article.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {article.author || 'প্রতিবেদক'}
                  </span>
                  <span className="text-[11px] font-bold text-[#0f3d2e] group-hover:underline inline-flex items-center">
                    পড়ুন <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Joybarta Editorial Creed Box */}
          <div className="bg-[#0f3d2e] text-white p-4 rounded-xs space-y-2 border-l-4 border-red-600 shadow-xs">
            <h4 className="text-xs font-black tracking-wide text-white">
              জয়বার্তা সম্পাদকীয় অঙ্গীকার
            </h4>
            <p className="text-[11px] text-emerald-100 leading-relaxed text-justify">
              "সত্যের সন্ধানে প্রতিদিন" — নির্মোহ, নির্ভীক ও দায়িত্বশীল সাংবাদিকতায় জয়বার্তা সবসময় সাধারণ নাগরিকের পাশে।
            </p>
            <div className="pt-1 text-[10px] text-emerald-300 font-mono font-bold flex justify-between items-center">
              <span>জাতীয় দৈনিক সংস্করণ</span>
              <span>ঢাকা, বাংলাদেশ</span>
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}
