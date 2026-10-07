import React, { useState } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Eye, FileText, Newspaper, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';

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
      
      // Auto close success notification
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 2500);
  };

  // Broad Sheet Articles based on Page number
  const getPageContent = (page: number) => {
    switch (page) {
      case 1:
        return {
          title: "প্রথমা আলো - ১ম পাতা (প্রধান প্রচ্ছদ)",
          date: "রবিবার, ২৮ জুন, ২০২৬",
          leadHeader: "ময়মনসিংহের স্বপ্না সরকার: নারীর অধিকারের মুখোশে ধ্বংসের খেলায় মেতেছেন তিনি",
          leadBody: "ময়মনসিংহের অপরাধ জগতের সম্রাট স্বপ্না সরকার ও মাদক কারবারি মেহেদীর সিন্ডিকেট আইন-শৃঙ্খলা বাহিনীকে মোটা অংকের মাসোহারা দিয়ে এবং বিগত সরকারের আমলের অসাধু পুলিশ কর্মকর্তাদের সাথে টাকার বিনিময়ে ‘আত্মীয়তার জাল’ তৈরি করে অবাধে অপরাধ কার্যক্রম চালিয়ে যাচ্ছে। চিহ্নিত এই অপরাধীরা হাতে-নাতে ধরা পড়ার পরেও পুলিশের কাছে ‘পবিত্র’ ও ধরাছোঁয়ার বাইরে থাকছে, এমনকি মাদক কারবারিরা মামলা থেকে কৌশলে মুক্তি পাচ্ছে...",
          column1Title: "আইনি লড়াইয়ের প্রস্তুতি",
          column1Text: "আইনি অধিকার ও সুরক্ষা সম্পর্কে সচেতনতা বৃদ্ধির লক্ষ্যে ময়মনসিংহের ভালুকায় প্রথমা আলোর উদ্যোগে দিনব্যাপী লিগ্যাল এইড ক্লিনিক অনুষ্ঠিত হয়েছে।" ,
          column2Title: "জনগণের ঐক্যবদ্ধ প্রতিরোধ",
          column2Text: "অপরাধী চক্রের ব্ল্যাকমেইল ও হয়রানির বিরুদ্ধে আরামবাগের সর্বস্তরের মানুষ ঐক্যবদ্ধ অবস্থান নিয়েছেন।"
        };
      case 2:
        return {
          title: "প্রথমা আলো - ২য় পাতা (সম্পাদকীয় ও উপ-সম্পাদকীয়)",
          date: "রবিবার, ২৮ জুন, ২০২৬",
          leadHeader: "বিবেক বিক্রি ও অসাধু কর্মকর্তাদের প্রশাসনিক নিষ্ক্রিয়তা",
          leadBody: "সচেতন সমাজ মনে করে, বিগত সরকারের আমলে অর্থের বিনিময়ে চাকরিতে ঢোকা এই দুর্নীতিগ্রস্ত ও অসাধু কর্মকর্তাদের প্রশাসন থেকে সমূলে বিদায় না করলে দেশের আইন-শৃঙ্খলা পরিস্থিতির কখনোই উন্নতি হবে না। ময়মনসিংহের সচেতন যুবসমাজ আজ ধিক্কার জানাচ্ছে সেই সব কর্মকর্তাদের, যারা সামান্য কিছু উচ্ছিষ্ট টাকার বিনিময়ে নিজেদের বিবেক ও দেশের সেবা করার পবিত্র শপথ বিক্রি করে দিয়েছে...",
          column1Title: "আইনি সংস্কারের জোরালো ডাক",
          column1Text: "পারিবারিক সহিংসতা প্রতিরোধ আইন ২০১০ কে আরও কঠোর করা সময়ের দাবি। প্রত্যন্ত গ্রামাঞ্চলে নারীরা অভিযোগ নিয়ে থানায় গেলেও দীর্ঘ হয়রানির শিকার হতে হয়। এর দ্রুত অবসান জরুরি।" ,
          column2Title: "নারী কণ্ঠস্বরের সাহসী উত্থান",
          column2Text: "প্রথমা আলো পত্রিকা শুধু অপরাধ প্রকাশে সীমাবদ্ধ নয়, এটি একটি আন্দোলনের নাম। এই আন্দোলন ছড়িয়ে যাক সর্বত্র।"
        };
      case 3:
        return {
          title: "প্রথমা আলো - ৩য় পাতা (আরামবাগ ও মহানগর বার্তা)",
          date: "রবিবার, ২৮ জুন, ২০২৬",
          leadHeader: "আরামবাগে ফ্রী আইনি সহায়তা ক্যাম্পেইন সফল",
          leadBody: "প্রথমা আলো পত্রিকার বিশেষ উদ্যোগে এবং আরামবাগের তরুণ যুব সমাজের সহযোগিতায় আরামবাগ ও মতিঝিল এলাকার নির্যাতিত নারীদের জন্য ১ দিনের বিশেষ আইনি পরামর্শ ও সমাধান ক্যাম্প সফলভাবে সম্পন্ন হয়েছে। ৫০ জনেরও বেশি ভুক্তভোগী নারী এই ক্যাম্পে এসে স্বনামধন্য আইনজীবীদের থেকে সরাসরি আইনি দিকনির্দেশনা ও মামলা লড়ার প্রতিশ্রুতি লাভ করেছেন...",
          column1Title: "যৌতুক প্রতিরোধ কমিটি গঠন",
          column1Text: "যৌতুক নিরোধ আইন ২০১৮ প্রয়োগে জোর দিতে ইউনিয়ন পর্যায়ে তরুণ সমাজ একত্রিত হয়ে ১০ সদস্যের ‘যৌতুক ও নারী নির্যাতন বিরোধী বিশেষ নাগরিক কমিটি’ গঠন করেছে।" ,
          column2Title: "বাল্যবিবাহ রোধে লাল কার্ড",
          column2Text: "গত সপ্তাহে আরামবাগ এলাকায় দুটি বাল্যবিবাহ ভেঙে দিতে সক্ষম হয়েছে স্থানীয় প্রশাসন ও আমাদের অনুসন্ধানী সাংবাদিক দল। বাল্যবিবাহ ও যেকোনো নারী নির্যাতনের বিরুদ্ধে ১০৯ নম্বরে কল করুন।"
        };
      case 4:
      default:
        return {
          title: "প্রথমা আলো - ৪র্থ পাতা (সফলতা ও অনুপ্রেরণা)",
          date: "রবিবার, ২৮ জুন, ২০২৬",
          leadHeader: "বঞ্চনা পেরিয়ে আরামবাগের তাসলিমার রূপকথা",
          leadBody: "একসময় শ্বশুরবাড়ির যৌতুকের অমানবিক নির্যাতনে সর্বস্ব হারিয়ে পথে বসা তাসলিমা এখন আরামবাগ এলাকার একজন সেরা নারী কৃষি উদ্যোক্তা। ১০ টি হাঁস ও মুরগি নিয়ে শুরু করা তার ছোট খামার আজ ১ কোটিরও বেশি সম্পদের সফল ডেইরি ফার্মে রূপ নিয়েছে। তাসলিমা প্রমাণ করেছেন, সঠিক ইচ্ছাক্ষমতা থাকলে নির্যাতনকে জয় করে সমাজে সসম্মানে মাথা উঁচু করে দাঁড়ানো যায়...",
          column1Title: "ফ্রি সেলাই প্রশিক্ষণ ক্যাম্প",
          column1Text: "দরিদ্র ও নিপীড়িত নারীদের আত্মনির্ভরশীল করতে প্রথমা আলোর তহবিলের আওতায় আগামী মাস থেকে আরামবাগে ফ্রি সেলাই ও হস্তশিল্প প্রশিক্ষণ কেন্দ্রের নতুন ব্যাচ শুরু হচ্ছে।" ,
          column2Title: "অনলাইন উদ্যোগের নবদিগন্ত",
          column2Text: "আরামবাগের শতাধিক তরুণী বর্তমানে ঘরে বসেই ফ্রিল্যান্সিং ও নকশীকাঁথা অনলাইনের মাধ্যমে বিক্রি করে প্রতি মাসে ২০ থেকে ৫০ হাজার টাকা আয় করছেন, যা প্রশংসার দাবিদার।"
        };
    }
  };

  const content = getPageContent(currentPage);

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-none p-4 shadow-none">
      
      {/* Upper Control Bar */}
      <div className="bg-white border border-slate-200 rounded-none p-2.5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-none">
        <div className="flex items-center gap-2">
          <div className="bg-red-50 text-red-600 p-1.5 rounded-none border border-red-200">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1">
              ই-পেপার রিডার (E-Paper) <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            </h3>
            <p className="text-[10px] text-slate-500">
              মুদ্রিত সংবাদপত্রের হুবহু ডিজিটাল কপি ও পাতা
            </p>
          </div>
        </div>

        {/* EPaper Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          
          {/* Zoom controls */}
          <div className="flex items-center border border-slate-200 rounded-none overflow-hidden bg-slate-50">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              title="জুম আউট"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2.5 text-[10px] font-mono font-bold text-slate-700 select-none">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              title="জুম ইন"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-slate-200 text-slate-600 border-l border-slate-200 transition-all text-[10px] font-bold cursor-pointer"
              title="রিসেট জুম"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page controls */}
          <div className="flex items-center border border-slate-200 rounded-none bg-slate-50 overflow-hidden">
            <button
              onClick={handlePrevPage}
              className="p-1.5 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              title="আগের পাতা"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-800">
              পাতা {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className="p-1.5 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
              title="পরের পাতা"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Download button */}
          <button
            onClick={triggerDownload}
            disabled={isDownloading}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-none border transition-all cursor-pointer ${
              isDownloading
                ? 'bg-amber-100 border-amber-200 text-amber-700 animate-pulse'
                : 'bg-slate-900 border-slate-950 text-white hover:bg-slate-850'
            }`}
          >
            {isDownloading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> পিডিএফ তৈরি হচ্ছে...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" /> পিডিএফ ডাউনলোড
              </>
            )}
          </button>
        </div>
      </div>

      {/* Broad Sheet Paper Container */}
      <div className="overflow-auto bg-slate-200 border border-slate-300 rounded-none max-h-[550px] p-4 flex justify-center shadow-inner">
        
        {/* Newspaper Mock Sheet */}
        <div
          className="bg-[#fdfcf7] border border-[#d2cbbe] p-5 text-slate-900 font-serif shadow-none transition-all duration-300 relative select-none w-full max-w-3xl"
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            margin: '0 auto',
            minWidth: '600px'
          }}
        >
          {/* Header watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-center">
            <h1 className="text-6xl font-bold font-sans rotate-12 select-none text-red-950">প্রথমা আলো</h1>
          </div>

          {/* Newspaper Masthead inside broadsheet */}
          <div className="border-b-4 border-slate-900 pb-2 mb-3">
            <div className="flex justify-between items-end border-b border-slate-400 pb-1 mb-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              <span>রেজিস্টার্ড নং: ডিএইচ-১০৯</span>
              <span>বর্ষ ১ | সংখ্যা ৪</span>
              <span>মতিঝিল, আরামবাগ, মতিঝিল, ঢাকা</span>
            </div>
            
            <div className="text-center my-1.5">
              <h1 className="text-4xl font-extrabold font-sans text-slate-950 tracking-tight">প্রথমা আলো</h1>
              <p className="text-[10px] font-sans text-slate-500 mt-0.5">
                সারাদেশের সর্বশেষ খবরের নির্ভীক ও বস্তুনিষ্ঠ অনলাইন নিউজ পোর্টাল
              </p>
            </div>

            <div className="flex justify-between items-center border-t-2 border-slate-900 pt-1.5 text-[11px] font-bold text-slate-800">
              <span>{content.date}</span>
              <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-none uppercase font-sans">ই-পেপার এডিশন</span>
              <span>মূল্য: সৌজন্য কপি</span>
            </div>
          </div>

          {/* Main Headline of Broad Sheet */}
          <div className="border-b border-slate-300 pb-3 mb-2.5">
            <h2 className="text-xl md:text-2xl font-black text-slate-950 leading-tight mb-2 font-sans tracking-tight hover:text-purple-900 transition-colors">
              {content.leadHeader}
            </h2>
            
            {/* Broad Sheet Two Column Split */}
            <div className="grid grid-cols-12 gap-3 mt-2.5">
              <div className="col-span-8 text-[11px] leading-relaxed text-slate-800 pr-2 border-r border-slate-300 text-justify">
                <span className="font-extrabold text-2xl float-left mr-1.5 mt-0.5 text-slate-950 line-height-none">
                  {content.leadBody.charAt(0)}
                </span>
                {content.leadBody.substring(1)}
              </div>
              
              {/* Caricature/Photo mock in print paper */}
              <div className="col-span-4 bg-slate-100 border border-slate-200 p-2 text-center self-start rounded-none">
                <div className="w-full h-20 bg-slate-300 rounded-none flex items-center justify-center text-slate-500 flex-col mb-1">
                  <FileText className="w-5 h-5 mb-0.5 text-slate-400" />
                  <span className="text-[8px] font-bold uppercase tracking-wider">তদন্ত প্রতিবেদন চিত্র</span>
                </div>
                <p className="text-[9px] text-slate-600 leading-snug text-center">
                  মতিঝিলের আরামবাগ এলাকা থেকে সংগৃহীত অনুসন্ধানী অপরাধ চক্রের বিশেষ নথিচিত্র।
                </p>
              </div>
            </div>
          </div>

          {/* Sub Columns Block */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="text-justify border-r border-slate-300 pr-2">
              <h3 className="font-sans font-black text-xs text-slate-900 mb-0.5">
                ■ {content.column1Title}
              </h3>
              <p className="text-[10px] text-slate-700 leading-relaxed">
                {content.column1Text}
              </p>
            </div>
            <div className="text-justify pl-1">
              <h3 className="font-sans font-black text-xs text-slate-900 mb-0.5">
                ■ {content.column2Title}
              </h3>
              <p className="text-[10px] text-slate-700 leading-relaxed">
                {content.column2Text}
              </p>
            </div>
          </div>

          {/* EPaper Footer credits */}
          <div className="border-t-2 border-slate-900 mt-4 pt-1.5 flex justify-between items-center text-[9px] text-slate-500 font-sans font-semibold">
            <span>সম্পাদক: রেজাউল করিম | প্রকাশক: শহিদুল ইসলাম উৎপল</span>
            <span>পাতা নং: {currentPage} / {totalPages}</span>
          </div>

        </div>
      </div>

      {/* PDF Download success notification modal */}
      {downloadSuccess && (
        <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-none p-2.5 flex items-center gap-2 animate-fade-in shadow-none">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <div className="text-[11px]">
            <p className="font-bold text-emerald-950">পিডিএফ ডাউনলোড সফল হয়েছে!</p>
            <p className="text-emerald-700 mt-0.5">প্রথমা আলোর {content.title} আপনার লোকাল স্টোরেজে সংরক্ষণ করা হয়েছে।</p>
          </div>
        </div>
      )}

      {/* Helpful Hint */}
      <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-none p-2 flex items-start gap-1.5">
        <Eye className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-700 leading-relaxed">
          <strong>নির্দেশনা:</strong> বড় স্ক্রিনে স্পষ্টভাবে সংবাদপত্রের সূক্ষ্ম লেখাগুলো পড়ার জন্য জুম টুলবার ব্যবহার করুন। এছাড়া পাতা পরিবর্তনের মাধ্যমে সম্পাদকীয় কলাম ও সফলতার অনন্য প্রতিবেদনগুলো পড়া যাবে।
        </p>
      </div>

    </div>
  );
}
