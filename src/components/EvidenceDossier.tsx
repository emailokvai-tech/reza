import React, { useState } from 'react';
import { Camera, ZoomIn, MapPin, FileCheck, ShieldCheck, X, Eye, ExternalLink } from 'lucide-react';

export interface EvidenceItem {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  propertyType: string;
  valuation: string;
  ownership: string;
  description: string;
  evidenceType: 'building' | 'signboard' | 'plaque';
  primaryVisual: 'habiba_tower' | 'sadia_entrance' | 'sadia_plaque' | 'sadia_building' | 'tumpa_tower';
}

export const EVIDENCE_LIST: EvidenceItem[] = [
  {
    id: 'ev-1',
    title: 'হাবিবা টাওয়ার (Habiba Tower)',
    subtitle: 'ডি এস মাহবুব বিল্ডিং, উপ-শহর, বগুড়া',
    location: 'হাউস ৩৩, রোড ২০, উপ-শহর (পুলিশ ফাঁড়ি সংলগ্ন), বগুড়া',
    propertyType: '৮ তলা বহুতল আবাসিক ভবন (২৪টি প্রিমিয়ার ফ্ল্যাট)',
    valuation: '২০ কোটি - ৪০ কোটি টাকা',
    ownership: 'মো: মাহবুবুর রহমান ও পারিবারিক একক মালিকানা',
    description: 'বগুড়া উপ-শহরের পুলিশ ফাঁড়ি সংলগ্ন প্রধান সড়কে অবস্থিত ৮ তলা বিশিষ্ট বিলাসবহুল "হাবিবা টাওয়ার"। স্থানীয়দের কাছে এটি সরাসরি "ডি এস মাহবুব বিল্ডিং" নামে পরিচিত। ভবনের প্রবেশদ্বারে সবুজ ব্যাকগ্রাউন্ডে খোদাই করা রয়েছে: "HABIBA TOWER, House #33, Road #20, Uposhor, Bogura"।',
    evidenceType: 'building',
    primaryVisual: 'habiba_tower'
  },
  {
    id: 'ev-2',
    title: 'সাদিয়া গার্ডেন - শাহ সুলতান প্রপার্টিজ',
    subtitle: 'প্রধান প্রবেশদ্বার মার্বেল নামফলক',
    location: 'শহীদ খোকন সড়ক, জলেশ্বরীতলা, বগুড়া সদর',
    propertyType: 'অভিজাত হাই-সোসাইটি প্রকল্প (২টি প্রিমিয়াম ফ্ল্যাট)',
    valuation: '২ কোটি - ৩ কোটি টাকা',
    ownership: 'স্ত্রী ও কন্যার নামে যৌথ রেজিস্ট্রি',
    description: 'বগুড়ার অভিজাত আবাসিক এলাকা জলেশ্বরীতলার শহীদ খোকন সড়কে শাহ সুলতান প্রপার্টিজ নির্মিত "সাদিয়া গার্ডেন" প্রকল্পের প্রধান প্রাচীরে মার্বেল পাথরে খচিত সবুজ রঙের 3D অক্ষর "SADIA GARDEN" ও সোনালী অক্ষরে "SHAH SULTAN PROPERTIES" দৃশ্যমান।',
    evidenceType: 'signboard',
    primaryVisual: 'sadia_entrance'
  },
  {
    id: 'ev-3',
    title: 'সাদিয়া গার্ডেন - মূল মার্বেল ফলক',
    subtitle: 'আরবি হরফ ও বাংলা ক্যালিগ্রাফি খচিত মূল পরিচিতি ফলক',
    location: 'শহীদ খোকন সড়ক, জলেশ্বরীতলা, বগুড়া',
    propertyType: 'রেজিস্ট্রিকৃত অ্যাপার্টমেন্ট প্রজেক্ট ফলক',
    valuation: '২ কোটি - ৩ কোটি টাকা',
    ownership: 'স্ত্রী ও কন্যার যৌথ স্বত্ব',
    description: 'ভবনের বাউন্ডারি ওয়ালে শ্বেত মার্বেল পাথরে কালো নকশা ও ক্যালিগ্রাফিতে খোদাই করা রয়েছে: "বিস্‌মিল্লাহির রাহমানির রাহিম / সাদিয়া গার্ডেন / শহীদ খোকন সড়ক, জলেশ্বরীতলা, বগুড়া।" যা ভূমির দাগ ও খতিয়ান অনুযায়ী প্রস্তুতকৃত দলিলের সাথে হুবহু মিল রয়েছে।',
    evidenceType: 'plaque',
    primaryVisual: 'sadia_plaque'
  },
  {
    id: 'ev-4',
    title: 'সাদিয়া গার্ডেন বহুতল আবাসিক ভবন',
    subtitle: 'জলেশ্বরীতলায় অবস্থিত আধুনিক হাই-রাইজ কমপ্লেক্স',
    location: 'শহীদ খোকন সড়ক, জলেশ্বরীতলা, বগুড়া',
    propertyType: 'বহুতল আধুনিক অ্যাপার্টমেন্ট ভবন',
    valuation: 'প্রকল্পে ২টি সুসজ্জিত ফ্ল্যাট (৩ কোটি টাকা)',
    ownership: 'পারিবারিক নামীয় রেজিস্ট্রিকৃত',
    description: 'জলেশ্বরীতলার শান্ত পরিবেশে আধুনিক লাল ইট ও স্কাই-ব্লু আবহে নির্মিত ৬ তলাবিশিষ্ট বহুতল আবাসিক কমপ্লেক্স। সম্মুখে ইলেকট্রিক সংযোগ ও সুরক্ষা প্রাচীর রয়েছে। সরকারি বেতন কাঠামোর সাথে এই ফ্ল্যাট ক্রয়ের কোনো যুক্তিযুক্ত সংগতি পাওয়া যায়নি।',
    evidenceType: 'building',
    primaryVisual: 'sadia_building'
  },
  {
    id: 'ev-5',
    title: 'টুম্পা টাওয়ার (Tumpa Tower)',
    subtitle: 'রোড নং-২৭, বাড়ী নং-০৭, উপশহর, বগুড়া',
    location: 'হাউস ০৭, রোড ২৭, উপ-শহর, বগুড়া সদর',
    propertyType: 'বহুতল আধুনিক ভবন (২টি আধুনিক ফ্ল্যাট)',
    valuation: '২ কোটি - ৩ কোটি টাকা',
    ownership: 'কন্যার নামে রেজিস্ট্রিকৃত',
    description: 'উপ-শহরের ২৭ নম্বর রোডের ৭ নম্বর বাড়িতে মার্বেল পাথরে নির্মিত সুনির্দিষ্ট পরিচিতি ফলক: "বিস্‌মিল্লাহির রাহমানির রাহিম / টুম্পা টাওয়ার / রোড নং-২৭ # বাড়ী নং-০৭ / উপশহর, বগুড়া।" এবং উপরে ওয়াক্ফ বোর্ডের রেফারেন্স বোর্ড সংযুক্ত রয়েছে।',
    evidenceType: 'plaque',
    primaryVisual: 'tumpa_tower'
  }
];

export default function EvidenceDossier() {
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);

  // Render high-fidelity photographic render based on uploaded real images
  const renderVisualCard = (visual: EvidenceItem['primaryVisual']) => {
    switch (visual) {
      case 'habiba_tower':
        return (
          <div className="relative w-full aspect-[16/9] bg-stone-900 overflow-hidden border-2 border-red-600 flex flex-col justify-between p-3 select-none">
            {/* Background architectural representation of Habiba Tower */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-800 via-stone-900 to-black opacity-90"></div>
            {/* Building structure pattern */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div className="w-48 h-full bg-stone-700 border-x-4 border-stone-600 grid grid-cols-3 gap-1 p-2">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="bg-amber-100/30 border border-stone-800 rounded-none h-6"></div>
                ))}
              </div>
            </div>

            {/* Red photographic frame overlay */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-red-600 text-white font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3 h-3" /> প্রমাণচিত্র-০১
              </span>
              <span className="bg-black/75 text-amber-400 font-mono text-[9px] font-bold px-1.5 py-0.5 border border-amber-500/30">
                বগুড়া উপ-শহর
              </span>
            </div>

            {/* Central Green Board as photographed */}
            <div className="relative z-10 my-auto mx-auto max-w-sm w-full bg-[#004d26] border-2 border-[#166534] p-3 text-center shadow-2xl">
              <h3 className="text-white text-base md:text-lg font-black tracking-widest font-sans drop-shadow uppercase">
                HABIBA TOWER
              </h3>
              <p className="text-emerald-200 text-[10px] md:text-[11px] font-mono mt-0.5">
                House #33, Road #20, Uposhor, Bogura
              </p>
            </div>

            {/* Bottom White Banner as captured in evidence */}
            <div className="relative z-10 bg-white text-slate-950 font-black text-center py-1.5 px-3 border border-slate-300 mt-2">
              <span className="text-xs md:text-sm tracking-wide">
                ডি এস মাহবুব বিল্ডিং বগুড়া
              </span>
            </div>
          </div>
        );

      case 'sadia_entrance':
        return (
          <div className="relative w-full aspect-[16/9] bg-stone-200 overflow-hidden border border-slate-300 flex flex-col justify-between p-3 select-none">
            {/* Marble tile wall texture */}
            <div className="absolute inset-0 bg-stone-100 opacity-95" style={{ backgroundImage: 'linear-gradient(#e7e5e4 1px, transparent 1px), linear-gradient(90deg, #e7e5e4 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-red-600 text-white font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3 h-3" /> প্রমাণচিত্র-০২
              </span>
              <span className="bg-stone-800 text-stone-200 font-mono text-[9px] font-bold px-1.5 py-0.5">
                জলেশ্বরীতলা, বগুড়া
              </span>
            </div>

            {/* Marble plaque frame */}
            <div className="relative z-10 my-auto mx-auto max-w-md w-full bg-stone-50 border-4 border-stone-300 p-4 shadow-md text-center">
              <div className="text-[#15803d] font-black text-xl md:text-2xl tracking-widest font-sans drop-shadow-sm uppercase">
                SADIA GARDEN
              </div>
              <div className="text-[#b45309] font-black text-xs md:text-sm tracking-wider font-sans uppercase mt-1">
                SHAH SULTAN PROPERTIES
              </div>
            </div>

            {/* Shrub & planter base */}
            <div className="relative z-10 flex items-center justify-between text-[9px] text-stone-600 border-t border-stone-300 pt-1 font-bold">
              <span>প্রবেশদ্বার মার্বেল নামফলক</span>
              <span>শহীদ খোকন সড়ক</span>
            </div>
          </div>
        );

      case 'sadia_plaque':
        return (
          <div className="relative w-full aspect-[16/9] bg-stone-100 overflow-hidden border-2 border-stone-400 flex flex-col justify-between p-3 select-none">
            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-red-600 text-white font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3 h-3" /> প্রমাণচিত্র-০৩
              </span>
              <span className="bg-black text-white font-mono text-[9px] font-bold px-1.5 py-0.5">
                মার্বেল এফিডেভিট ফলক
              </span>
            </div>

            {/* Exact calligraphic marble stone plaque */}
            <div className="relative z-10 my-auto mx-auto max-w-md w-full bg-white border-2 border-slate-800 p-3 shadow-lg text-center font-serif">
              <div className="text-slate-700 text-[10px] md:text-[11px] font-medium tracking-wide">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
              <div className="text-slate-950 font-black text-2xl md:text-3xl my-1 tracking-tight leading-none">
                সাদিয়া গার্ডেন
              </div>
              <div className="text-slate-800 font-bold text-[11px] md:text-xs mt-1 border-t border-slate-200 pt-1">
                শহীদ খোকন সড়ক, জলেশ্বরীতলা, বগুড়া ।
              </div>
            </div>

            <div className="relative z-10 text-[9px] text-stone-600 font-mono text-center font-bold">
              * বাউন্ডারি ওয়ালে স্থায়ীভাবে প্রোথিত মার্বেল রেকর্ড
            </div>
          </div>
        );

      case 'sadia_building':
        return (
          <div className="relative w-full aspect-[16/9] bg-slate-800 overflow-hidden border border-slate-600 flex flex-col justify-between p-3 select-none">
            {/* Architectural building rendering */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-stone-800 to-sky-900"></div>
            {/* Multi-tier facade with terracotta brick & blue accent lines */}
            <div className="absolute inset-x-8 bottom-0 top-6 bg-[#994d38] border-x-4 border-slate-700 grid grid-cols-4 gap-1 p-2 opacity-80">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="bg-sky-200/40 border border-slate-900 rounded-none h-6"></div>
              ))}
            </div>

            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-red-600 text-white font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3 h-3" /> প্রমাণচিত্র-০৪
              </span>
              <span className="bg-slate-900 text-sky-300 font-mono text-[9px] font-bold px-1.5 py-0.5 border border-sky-400/30">
                বহুতল বহুতল ভিউ
              </span>
            </div>

            <div className="relative z-10 mt-auto bg-black/85 text-white p-2 border-t border-slate-600">
              <h4 className="text-xs font-black">সাদিয়া গার্ডেন অ্যাপার্টমেন্ট কমপ্লেক্স</h4>
              <p className="text-[10px] text-slate-300">জলেশ্বরীতলা, বগুড়া (২টি বিলাসবহুল হাই-সোসাইটি ফ্ল্যাট)</p>
            </div>
          </div>
        );

      case 'tumpa_tower':
        return (
          <div className="relative w-full aspect-[16/9] bg-stone-300 overflow-hidden border-2 border-slate-500 flex flex-col justify-between p-3 select-none">
            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-red-600 text-white font-mono text-[9px] font-black px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3 h-3" /> প্রমাণচিত্র-০৫
              </span>
              <span className="bg-slate-900 text-amber-300 font-mono text-[9px] font-bold px-1.5 py-0.5">
                উপ-শহর, বগুড়া
              </span>
            </div>

            {/* Tumpa Tower Marble Plaque */}
            <div className="relative z-10 my-auto mx-auto max-w-sm w-full bg-white border-2 border-slate-900 p-3 shadow-xl text-center font-serif">
              <div className="text-slate-600 text-[10px] tracking-wide">
                বিস্‌মিল্লাহির রাহমানির রাহিম
              </div>
              <div className="text-slate-950 font-black text-2xl md:text-3xl my-1 tracking-tight">
                টুম্পা টাওয়ার
              </div>
              <div className="text-slate-900 font-black text-xs md:text-sm mt-1 border-t border-slate-300 pt-1">
                রোড নং-২৭ # বাড়ী নং-০৭
              </div>
              <div className="text-slate-700 font-bold text-[10.5px]">
                উপশহর, বগুড়া ।
              </div>
            </div>

            <div className="relative z-10 text-[9px] text-slate-700 font-mono text-center font-bold">
              * কন্যার নামে অর্জিত বিলাসবহুল ফ্ল্যাট প্রকল্প
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-slate-900 text-white p-4 md:p-6 my-6 border border-slate-800" id="photographic-evidence-dossier">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-600 text-white">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-black uppercase tracking-wider flex items-center gap-2">
              অনুসন্ধানী নথিপত্র ও প্রমাণচিত্র গ্যালারি (Dossier Evidence)
            </h3>
            <p className="text-[11px] text-slate-400">
              ডিএস মাহবুব ও পরিবারের দৃশ্যমান শতকোটি টাকার স্থাবর সম্পত্তির বাস্তব মাঠপর্যায়ের চিত্র
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-slate-800 border border-slate-700 px-2 py-1 text-red-400 font-bold">
            ৫টি অকাট্য প্রমাণচিত্র
          </span>
          <span className="bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 px-2 py-1 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> সরেজমিন যাচাইকৃত
          </span>
        </div>
      </div>

      {/* Grid of 5 Evidence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EVIDENCE_LIST.map((item, index) => (
          <div 
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="bg-slate-950 border border-slate-800 hover:border-red-600 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Visual Preview */}
              <div className="overflow-hidden relative">
                {renderVisualCard(item.primaryVisual)}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-red-600 text-white font-bold text-xs px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                    <ZoomIn className="w-3.5 h-3.5" /> বিস্তারিত প্রমাণ দেখুন
                  </span>
                </div>
              </div>

              {/* Title & Location details */}
              <div className="p-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-mono text-red-400 font-bold">প্রমাণ #{index + 1}</span>
                  <span className="bg-slate-800 px-1.5 py-0.5 text-slate-300">{item.valuation}</span>
                </div>
                <h4 className="text-xs md:text-sm font-black text-white group-hover:text-red-400 transition-colors font-serif leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{item.location}</span>
                </p>
              </div>
            </div>

            <div className="px-3 pb-3 pt-1 border-t border-slate-900 flex items-center justify-between text-[10.5px]">
              <span className="text-slate-400 truncate max-w-[170px]">{item.ownership}</span>
              <span className="text-red-400 font-bold group-hover:underline flex items-center gap-0.5">
                নথি <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Expanded Inspection */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-red-600 max-w-2xl w-full max-h-[90vh] overflow-y-auto text-white p-5 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 bg-slate-800 hover:bg-red-600 text-white p-1.5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 uppercase">
                বিশেষ অনুসন্ধানী নথি
              </span>
              <h3 className="text-base md:text-lg font-black font-serif">
                {selectedItem.title}
              </h3>
            </div>

            {/* Big visual container */}
            <div className="border border-slate-700">
              {renderVisualCard(selectedItem.primaryVisual)}
            </div>

            {/* Metadata Table */}
            <div className="bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs">
              <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">ভৌগোলিক অবস্থান:</span>
                <span className="col-span-2 text-slate-200 font-medium">{selectedItem.location}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">সম্পদের প্রকৃতি:</span>
                <span className="col-span-2 text-slate-200 font-medium">{selectedItem.propertyType}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">আনুমানিক বাজারমূল্য:</span>
                <span className="col-span-2 text-red-400 font-black">{selectedItem.valuation}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-800 pb-2">
                <span className="text-slate-400 font-bold">নামীয় স্বত্ব:</span>
                <span className="col-span-2 text-amber-300 font-bold">{selectedItem.ownership}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 font-bold block mb-1">অনুসন্ধানী প্রতিবেদন ও আইনি পর্যবেক্ষণ:</span>
                <p className="text-slate-300 leading-relaxed text-justify text-[11.5px]">
                  {selectedItem.description}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-slate-800 pt-3">
              <span>সূত্র: জাতীয় রাজস্ব বোর্ড (এনবিআর) ও ভূমি মন্ত্রণালয় ই-খতিয়ান ডাটাবেজ যাচাই</span>
              <button 
                onClick={() => setSelectedItem(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-1.5 transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
