import React, { useState } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Eye, FileText, Newspaper, RefreshCw, CheckCircle } from 'lucide-react';
import InvestigationLogo from './InvestigationLogo.tsx';

export default function EPaperSection() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalPages = 4;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 180));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoomLevel(100);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const triggerDownload = () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 2000);
  };

  // Broad Sheet Articles based on Page number
  const getPageContent = (page: number) => {
    switch (page) {
      case 1:
        return {
          title: "দি ইনভেস্টিগেশন - ১ম পাতা (প্রধান প্রচ্ছদ)",
          date: "বুধবার, ৭ অক্টোবর, ২০২৬",
          leadHeader: "মেঘনা পেট্রোলিয়ামের গোদনাইল ডিপো ইনচার্জ মো: মাহবুবুর রহমানের বিরুদ্ধে সমন্বিত অনুসন্ধানী প্রতিবেদন",
          leadBody: "সিদ্ধিরগঞ্জের জাতীয় জ্বালানি ডিপোতে তেল পাচার সিন্ডিকেট, কৃত্রিম সংকট তৈরি ও নিচু স্তরের কর্মচারীদের বলির পাঁঠা বানিয়ে পার পাওয়ার অভিযোগ; বিপরীতে বগুড়া ও ঢাকায় হাবিবা টাওয়ার, সাদিয়া গার্ডেনসহ অর্জিত শতকোটি টাকার দৃশ্যমান সাম্রাজ্য। নিরপেক্ষ তদন্ত ও ফরেনসিক ভূমি অডিটের জোরালো দাবি উঠেছে...",
          column1Title: "তেল চুরির সুনির্দিষ্ট ঘটনা",
          column1Text: "বাদশা টেক্সটাইলের চালানে অতিরিক্ত ২,২৫০ লিটার লোড ও মেসার্স রাব্বি ট্রেডার্সের নামে চালনা ছাড়া ৩,০০০ লিটার ডিজেল প্রধান ফটক দিয়ে পাচারের ঘটনায় ক্ষুব্ধ শ্রমিক ইউনিয়ন।",
          column2Title: "বগুড়ায় সম্পদের সাম্রাজ্য",
          column2Text: "উপ-শহরে ৮ তলা হাবিবা টাওয়ার, জলেশ্বরীতলায় সাদিয়া গার্ডেনের ২টি ফ্ল্যাট ও বাইপাসে ২০ বিঘা জমি অর্জনের খতিয়ান রেকর্ড যাচাই করেছে দি ইনভেস্টিগেশন।"
        };
      case 2:
        return {
          title: "দি ইনভেস্টিগেশন - ২য় পাতা (সম্পাদকীয় ও উপ-সম্পাদকীয়)",
          date: "বুধবার, ৭ অক্টোবর, ২০২৬",
          leadHeader: "রাষ্ট্রীয় জ্বালানি নিরাপত্তা ও প্রাতিষ্ঠানিক দায়মুক্তির অবসান",
          leadBody: "জাতীয় জ্বালানি নিরাপত্তার মূল চালিকাশক্তি গোদনাইল ডিপোর তেলের চোরাচালান কোনোভাবেই দায়মুক্তি পেতে পারে না। নিচু স্তরের মিটারম্যানদের বদলি বা বরখাস্ত করে মূল সুবিধাভোগী ইনচার্জকে ছাড় দেওয়ার প্রাতিষ্ঠানিক সংস্কৃতি দেশের জ্বালানি অর্থনীতিকে পঙ্গু করে দিচ্ছে। দুদক ও এনবিআরের যৌথ ফরেনসিক তদন্ত এখন সময়ের দাবি...",
          column1Title: "আইনি সংস্কার ও দুদক আইন",
          column1Text: "দুদক আইন ২০০৪-এর ২৬(২) ও ২৭(১) ধারা অনুযায়ী জ্ঞাত আয়ের উৎসের সাথে অসঙ্গতিপূর্ণ সম্পদ অর্জনের বিরুদ্ধে দ্রুত সম্পদ বিবরণী নোটিশ জারি করা জরুরি।",
          column2Title: "মুক্ত সাংবাদিকতার অঙ্গীকার",
          column2Text: "দি ইনভেস্টিগেশন কোনো রাজনৈতিক বা প্রাতিষ্ঠানিক চাপের কাছে নতি স্বীকার করবে না। সত্যের সন্ধানে নির্ভীক অনুসন্ধান অব্যাহত থাকবে।"
        };
      case 3:
        return {
          title: "দি ইনভেস্টিগেশন - ৩য় পাতা (জাতীয় ও মহানগর বার্তা)",
          date: "বুধবার, ৭ অক্টোবর, ২০২৬",
          leadHeader: "নদী দখল ও নৌ-পথে চোরাই তেলের লাইটার জাহাজ চক্রের সন্ধান",
          leadBody: "শীতলক্ষ্যা ও বুড়িগঙ্গায় রাতে ভাসমান মজুদ রেখে অনুমোদনহীন পাম্পে তেল পাচারের তথ্য পেয়েছে আইনশৃঙ্খলা বাহিনী। একই সাথে রাজধানী ঢাকার কাজীপাড়া ও শেওড়াপাড়ায় একাধিক আধুনিক ফ্ল্যাটের মালিকানা খতিয়ে দেখছে সংশ্লিষ্ট তদন্ত সংস্থা...",
          column1Title: "১৫টি ব্রেকিং নিউজ আপডেট",
          column1Text: "দেশব্যাপী নিত্যপণ্যের সিন্ডিকেট ভাঙতে ভোক্তা অধিকারের অভিযান ও ব্যাংকিং খাতের ঋণখেলাপিদের তালিকা চূড়ান্ত করছে কেন্দ্রীয় ব্যাংক।",
          column2Title: "নাগরিক হেল্পলাইন ডেস্ক",
          column2Text: "দুর্নীতি ও আর্থিক অনিয়মের বিরুদ্ধে দুদক হটলাইন ১০৬ এবং লিগ্যাল এইড নম্বর ১৬৪৩০-এ সরাসরি অভিযোগ জানানোর আহ্বান।"
        };
      case 4:
      default:
        return {
          title: "দি ইনভেস্টিগেশন - ৪র্থ পাতা (বিশেষ অনুসন্ধান ও সমাপনী)",
          date: "বুধবার, ৭ অক্টোবর, ২০২৬",
          leadHeader: "ই-খতিয়ান ও ভূমি রেকর্ডের মাধ্যমে অবৈধ সম্পত্তির অকাট্য প্রমাণ",
          leadBody: "ভূমি মন্ত্রণালয়ের ডিজিটাল পোর্টাল (eporcha.gov.bd) ও বগুড়া সদর সাব-রেজিস্ট্রি অফিসের বালাম বই থেকে প্রাপ্ত রেকর্ডে দেখা গেছে মো: মাহবুবুর রহমান, তাঁর স্ত্রী ও তিন কন্যার নামে অর্জিত কোটি কোটি টাকার সম্পত্তি। সরকারি বেতন কাঠামোর সাথে এই বিপুল সম্পদের কোনো বৈধ সামঞ্জস্য নেই...",
          column1Title: "তদন্ত কমিটির সুপারিশ",
          column1Text: "ডিপো প্রধানদের নির্দিষ্ট সময় পরপর বাধ্যতামূলক বদলি নীতি এবং মেজারিং মিটারে রিয়েল-টাইম অটোমেটেড সার্ভার ট্র্যাকিং চালুর জোর তাগিদ।",
          column2Title: "প্রকাশক ও সম্পাদনা তথ্য",
          column2Text: "প্রকাশক: মেহেদী হাসান। প্রধান কার্যালয়: ঢাকা, বাংলাদেশ। সত্যের সন্ধানে সার্বক্ষণিক অনুসন্ধানী টিম।"
        };
    }
  };

  const content = getPageContent(currentPage);

  return (
    <div className="bg-white border border-slate-200 p-4 shadow-sm" id="epaper-section">
      {/* Header of E-Paper tool */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-950 text-white">
            <Newspaper className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black text-slate-950 uppercase tracking-wide flex items-center gap-2">
              দৈনিক ই-পেপার সংস্করণ <span className="bg-red-600 text-white text-[9.5px] px-1.5 py-0.5 font-mono font-bold">DIGITAL PRINT</span>
            </h3>
            <p className="text-[11px] text-slate-500">প্রিন্ট সংস্করণের হুবহু ডিজিটাল কপি ও পাতাভিত্তিক ব্রাউজার</p>
          </div>
        </div>

        {/* Reader controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center border border-slate-300 bg-slate-50">
            <button 
              onClick={handleZoomOut} 
              className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
              title="জুম আউট"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-slate-800">{zoomLevel}%</span>
            <button 
              onClick={handleZoomIn} 
              className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
              title="জুম ইন"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={handleResetZoom} 
              className="px-2 py-1 border-l border-slate-300 text-[10px] font-bold text-slate-600 hover:text-slate-900"
            >
              রিসেট
            </button>
          </div>

          <div className="flex items-center border border-slate-300 bg-slate-50">
            <button 
              onClick={handlePrevPage} 
              className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
              title="পূর্ববর্তী পাতা"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-[11px] font-bold text-slate-800 font-mono">
              পাতা {currentPage} / {totalPages}
            </span>
            <button 
              onClick={handleNextPage} 
              className="p-1.5 hover:bg-slate-200 text-slate-700 transition-colors"
              title="পরবর্তী পাতা"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={triggerDownload} 
            disabled={isDownloading}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-white px-3 py-1.5 font-bold transition-all cursor-pointer border border-slate-900"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" />
                <span>প্রস্তুত হচ্ছে...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-red-400" />
                <span>পিডিএফ ডাউনলোড</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main E-Paper Display Canvas */}
      <div className="overflow-x-auto bg-stone-200 p-4 border border-slate-300 flex justify-center">
        <div 
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          className="bg-white border-2 border-stone-400 shadow-xl max-w-4xl w-full p-6 md:p-8 transition-transform duration-150 font-serif text-slate-950"
        >
          {/* Top Broad Sheet Masthead */}
          <div className="border-b-4 border-slate-950 pb-3 mb-3 text-center">
            <div className="flex justify-between items-center text-[10px] md:text-xs text-slate-600 font-sans border-b border-slate-300 pb-1 mb-2 font-bold">
              <span>রেজিস্ট্রেশন নং: ডিআই-২০২৬/০৭</span>
              <span className="text-red-700 font-extrabold uppercase">জাতীয় নির্ভীক অনুসন্ধানী দৈনিক</span>
              <span>মূল্য: ৮.০০ টাকা</span>
            </div>

            {/* Newspaper Logo Title */}
            <InvestigationLogo variant="epaper" className="my-2" />

            <div className="flex justify-between items-center text-[10.5px] md:text-xs text-slate-700 font-sans border-t-2 border-slate-950 pt-1 mt-2">
              <span className="font-bold">{content.date}</span>
              <span className="font-bold">প্রকাশক: <strong className="text-slate-950">মেহেদী হাসান</strong></span>
              <span className="font-bold font-mono">সংস্করণ: ০১ • খণ্ড: ০১</span>
            </div>
          </div>

          {/* E-Paper Content Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-4">
            {/* Main Lead Story */}
            <div className="md:col-span-8 border-b md:border-b-0 md:border-r border-slate-300 pr-0 md:pr-4">
              <span className="bg-red-600 text-white font-mono text-[9px] font-black px-1.5 py-0.5 uppercase tracking-wider font-sans">
                বিশেষ অনুসন্ধানী রিপোর্ট
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-950 leading-tight mt-1 mb-2">
                {content.leadHeader}
              </h2>
              <p className="text-xs md:text-[12.5px] text-slate-800 leading-relaxed text-justify first-letter:text-3xl first-letter:font-black first-letter:float-left first-letter:mr-2">
                {content.leadBody}
              </p>
            </div>

            {/* Sidebar Column Stories */}
            <div className="md:col-span-4 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <h4 className="text-xs font-black text-slate-950 uppercase border-l-2 border-red-600 pl-1.5 mb-1">
                  {content.column1Title}
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                  {content.column1Text}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-950 uppercase border-l-2 border-slate-950 pl-1.5 mb-1">
                  {content.column2Title}
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                  {content.column2Text}
                </p>
              </div>
            </div>
          </div>

          {/* Broad Sheet Footer Bar */}
          <div className="border-t-2 border-slate-950 mt-6 pt-2 flex justify-between items-center text-[10px] text-slate-500 font-sans font-bold">
            <span>দি ইনভেস্টিগেশন প্রেস থেকে মুদ্রিত ও প্রকাশিত</span>
            <span>পৃষ্ঠা নং: {currentPage}</span>
          </div>
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccess && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>দি ইনভেস্টিগেশন ই-পেপার ({content.title}) সফলভাবে ডাউনলোড হয়েছে।</span>
        </div>
      )}
    </div>
  );
}
