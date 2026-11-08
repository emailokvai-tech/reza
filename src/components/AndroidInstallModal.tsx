import React from 'react';
import { Smartphone, Download, CheckCircle, X, ExternalLink, ShieldCheck, Zap, Globe } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AndroidInstallModal({ isOpen, onClose }: AndroidInstallModalProps) {
  const { isInstallable, isInstalled, install, isIOS, isAndroid } = usePWAInstall();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white text-slate-900 w-full max-w-lg rounded-sm shadow-2xl border-2 border-[#0f3d2e] overflow-hidden animate-fadeIn font-sans my-6">
        
        {/* Header */}
        <div className="bg-[#0f3d2e] text-white p-4 flex justify-between items-center border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white rounded-xs p-1 flex items-center justify-center shrink-0">
              <img src="/joybarta-logo.jpg" alt="জয়বার্তা" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-serif font-black text-sm sm:text-base leading-tight">
                জয়বার্তা স্ট্যান্ডঅ্যালন অ্যান্ড্রয়েড অ্যাপ
              </h3>
              <p className="text-[11px] text-emerald-200">
                সাংবাদিক জয়নাল ভাইয়ের মোবাইল পাবলিশিং অ্যাপ
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-emerald-200 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          
          {isInstalled ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xs text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-black text-sm text-emerald-950 font-serif">
                অ্যাপটি ইতোমধ্যে আপনার ডিভাইসে ইনস্টল করা আছে!
              </h4>
              <p className="text-emerald-800 text-xs">
                আপনি সরাসরি আপনার অ্যান্ড্রয়েড হোমস্ক্রিনের জয়বার্তা আইকন থেকে ফুল-স্ক্রিন মোডে ব্যবহার করছেন।
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Feature Highlights for Journalist Joynal Bhai */}
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xs space-y-2">
                <h4 className="font-black text-slate-950 uppercase text-[11px] tracking-wide flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#0f3d2e]" />
                  <span>স্ট্যান্ডঅ্যালন অ্যাপের সুবিধাসমূহ:</span>
                </h4>
                <ul className="space-y-1.5 text-slate-700 text-xs">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>ফুল-স্ক্রিন অ্যাপ মোড:</strong> কোনো ব্রাউজার ইউআরএল বার থাকবে না, হুবহু নেটিভ অ্যান্ড্রয়েড অ্যাপের মতো চলবে।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>১-ক্লিকে সংবাদ প্রকাশ:</strong> জয়নাল ভাই সরাসরি মোবাইল থেকে যে কোনো সময় ছবিসহ বা ছবিবিহীন সংবাদ লাইভ করতে পারবেন।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>হোম স্ক্রিন আইকন:</strong> মোবাইলের অ্যাপ ড্রয়ার ও হোম স্ক্রিনে জয়বার্তার আসল লোগো যুক্ত হবে।</span>
                  </li>
                </ul>
              </div>

              {/* Install Action Button (Chromium / Android WebAPK) */}
              {isInstallable && (
                <button
                  onClick={async () => {
                    const success = await install();
                    if (success) onClose();
                  }}
                  className="w-full bg-[#0f3d2e] hover:bg-[#16503c] text-white font-bold py-3 px-4 rounded-xs text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4 text-emerald-300" />
                  <span>এখনই ইনস্টল করুন (Install Standalone App)</span>
                </button>
              )}

              {/* Step-by-Step Android Manual Installation Guide */}
              <div className="border border-slate-200 p-3.5 rounded-xs bg-emerald-50/50 space-y-2">
                <h5 className="font-bold text-[#0f3d2e] flex items-center gap-1 text-xs">
                  <Zap className="w-3.5 h-3.5 text-red-600" />
                  <span>মোবাইল ব্রাউজার (Chrome) থেকে ইনস্টল করার নিয়ম:</span>
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 text-[11.5px] leading-relaxed">
                  <li>আপনার অ্যান্ড্রয়েড ফোনের Chrome ব্রাউজারে ডানদিকের উপরের <strong>তিনটি ডট (⋮)</strong> মেনুতে ট্যাপ করুন।</li>
                  <li>মেনু থেকে <strong>"Add to Home screen"</strong> অথবা <strong>"Install app"</strong> অপশনে চাপ দিন।</li>
                  <li><strong>"Install"</strong> বাটনে ক্লিক করলেই স্বয়ংক্রিয়ভাবে একটি স্ট্যান্ডঅ্যালন অ্যাপ তৈরি হয়ে মোবাইলের হোম স্ক্রিনে বসে যাবে।</li>
                </ol>
              </div>

              {/* Direct Live URL for Joynal Bhai */}
              <div className="pt-2 border-t border-slate-200 flex flex-wrap justify-between items-center text-[11px] text-slate-500 gap-2">
                <span className="font-mono text-[#0f3d2e] font-bold">
                  URL: {window.location.origin}
                </span>
                <span className="text-slate-400">
                  Android Standalone WebAPK Compliant
                </span>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-1.5 rounded-xs text-xs cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}
