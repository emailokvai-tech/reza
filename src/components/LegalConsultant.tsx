import React, { useState } from 'react';
import { Scale, Phone, Shield, FileCheck, CheckCircle2, AlertTriangle, Send, BookOpen, UserCheck, HelpCircle } from 'lucide-react';

interface LegalRequest {
  id: string;
  name: string;
  phone: string;
  district: string;
  category: string;
  details: string;
  date: string;
}

export default function LegalConsultant() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: 'ঢাকা',
    category: 'পারিবারিক ও যৌতুক বিরোধ',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        district: 'ঢাকা',
        category: 'পারিবারিক ও যৌতুক বিরোধ',
        details: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1000);
  };

  const PANEL_LAWYERS = [
    {
      name: "অ্যাডভোকেট নাসরিন জাহান",
      designation: "সিনিয়র প্যানেল আইনজীবী ও মানবাধিকার কর্মী",
      court: "বাংলাদেশ সুপ্রিম কোর্ট",
      specialty: "পারিবারিক আইন, দেনমোহর ও যৌতুক নিরোধ",
      phone: "+৮৮০১৭১XXXXXX"
    },
    {
      name: "ব্যারিস্টার এম এ হাসান",
      designation: "লিগ্যাল এইড বিশেষজ্ঞ",
      court: "ঢাকা জজ কোর্ট",
      specialty: "জমিজমা বিরোধ, জালিয়াতি ও প্রতারণা দমন",
      phone: "+৮৮০১৮১XXXXXX"
    },
    {
      name: "অ্যাডভোকেট মো: রফিকুল ইসলাম",
      designation: "ক্রিমিনাল লিগ্যাল ডিফেন্স স্পেশালিস্ট",
      court: "ময়মনসিংহ জজ কোর্ট",
      specialty: "সাইবার ব্ল্যাকমেইল, নারী নির্যাতন দমন আইন",
      phone: "+৮৮০১৯১XXXXXX"
    }
  ];

  return (
    <div className="space-y-6" id="legal-aid-section">
      {/* Top Banner */}
      <div className="bg-slate-950 text-white p-6 border-b-4 border-red-600 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-red-600 text-white">
              <Scale className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
              LEGAL AID CELL • THE INVESTIGATION
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black font-serif text-white">
            আইনি সহায়তা ও লিগ্যাল এইড ডেস্ক
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            সুবিধাবঞ্চিত, নির্যাতিত নাগরিক ও ভুক্তভোগীদের জন্য অভিজ্ঞ প্যানেল আইনজীবী সমন্বিত বিনামূল্যে আইনি পরামর্শ ও দিকনির্দেশনা সেল।
          </p>
        </div>

        <div className="flex flex-col gap-1.5 bg-slate-900 border border-slate-800 p-3 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">জরুরি হটলাইন নম্বর:</span>
          <div className="flex items-center gap-3 font-mono font-black text-amber-300">
            <span>দুদক: ১০৬</span>
            <span>|</span>
            <span>লিগ্যাল এইড: ১৬৪৩০</span>
            <span>|</span>
            <span>পুলিশ: ৯৯৯</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Citizen Legal Request Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-red-600" /> আইনি পরামর্শ বা অভিযোগের আবেদন পত্র
            </h3>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-bold">
              সম্পূর্ণ গোপনীয়
            </span>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-300 p-6 text-center space-y-2 animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-black text-emerald-950">আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে!</h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                'দি ইনভেস্টিগেশন'-এর লিগ্যাল এইড প্যানেল আইনজীবী আপনার অভিযোগটি পর্যালোচনা করে দ্রুততম সময়ে উল্লেখিত মোবাইল নম্বরে যোগাযোগ করবেন।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">আপনার পূর্ণ নাম:</label>
                  <input
                    type="text"
                    placeholder="নাম লিখুন..."
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">যোগাযোগের মোবাইল নম্বর:</label>
                  <input
                    type="tel"
                    placeholder="০১XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">জেলা / এলাকা:</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">সমস্যার বিষয় / ক্যাটাগরি:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-600"
                  >
                    <option value="পারিবারিক ও যৌতুক বিরোধ">পারিবারিক ও যৌতুক বিরোধ</option>
                    <option value="সাইবার অপরাধ ও ব্ল্যাকমেইল">সাইবার অপরাধ ও ব্ল্যাকমেইল</option>
                    <option value="জমিজমা দখল ও জালিয়াতি">জমিজমা দখল ও জালিয়াতি</option>
                    <option value="কর্মস্থলে হয়রানি ও বৈষম্য">কর্মস্থলে হয়রানি ও বৈষম্য</option>
                    <option value="দুর্নীতি ও অর্থ আত্মসাৎ সংক্রান্ত">দুর্নীতি ও অর্থ আত্মসাৎ সংক্রান্ত</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">ঘটনার বিস্তারিত বিবরণ:</label>
                <textarea
                  rows={4}
                  placeholder="আপনার সমস্যা, আইনি অভিযোগ বা ঘটনা বিস্তারিতভাবে বর্ণনা করুন..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-none focus:border-red-600 focus:bg-white"
                  required
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-500 italic">
                  * তথ্যদাতার পরিচয় ও নথি সাংবাদিকতার সুরক্ষার নীতি অনুযায়ী শতভাগ গোপন রাখা হবে।
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2 px-5 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-red-400" />
                  {isSubmitting ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Panel Lawyers & Legal Know-How */}
        <div className="lg:col-span-5 space-y-4">
          {/* Panel Lawyers Directory */}
          <div className="bg-white border border-slate-200 p-4">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-red-600" /> প্যানেল আইনজীবী ও লিগ্যাল অ্যাডভাইজার
            </h3>
            <div className="space-y-3">
              {PANEL_LAWYERS.map((lawyer, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 p-3 space-y-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-black text-slate-950 font-serif">{lawyer.name}</h4>
                    <span className="text-[9.5px] bg-slate-200 text-slate-700 px-1.5 py-0.5 font-bold font-mono">
                      {lawyer.court}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{lawyer.designation}</p>
                  <p className="text-[10.5px] text-red-700 font-semibold">{lawyer.specialty}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Legal Rights Guidelines */}
          <div className="bg-slate-900 text-white p-4 border border-slate-800 space-y-2">
            <h4 className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> আইনি অধিকার জানা আপনার সুরক্ষার প্রথম ধাপ
            </h4>
            <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
              <li>যৌতুক দাবি করা বা প্রদান করা উভয়ই আইন অনুযায়ী জামিন-অযোগ্য অপরাধ।</li>
              <li>পারিবারিক সহিংসতা প্রতিরোধ আইনে নারী ও সন্তানের নিরাপত্তা এবং বাড়ি থেকে উচ্ছেদ না করার আদালতের অন্তর্বর্তীকালীন আদেশ পাওয়া যায়।</li>
              <li>অনলাইনে ছবি বা ভিডিও ছড়িয়ে দেওয়ার হুমকি দিলে ডিজিটাল নিরাপত্তা ও পর্নোগ্রাফি নিয়ন্ত্রণ আইনে তাৎক্ষণিক মামলা করা সম্ভব।</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
