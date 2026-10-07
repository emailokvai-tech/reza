import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Scale, Shield, Landmark, MessageSquare, AlertCircle, HelpCircle, CheckCircle, Sparkles } from 'lucide-react';
import { LegalMessage } from '../types';

export default function LegalConsultant() {
  const [messages, setMessages] = useState<LegalMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'আসসালামু আলাইকুম। আমি প্রথমা আলোর স্বয়ংক্রিয় এআই আইনি পরামর্শক। বাংলাদেশের পারিবারিক আইন, যৌতুক নিরোধ, পারিবারিক সহিংসতা প্রতিরোধ ও প্রতিকার এবং দেনমোহর সংক্রান্ত যেকোনো আইনগত সহায়তার জন্য নিচে প্রশ্ন করতে পারেন। আমরা সবসময় আপনার পাশে আছি।',
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scrolling to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: LegalMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setChatError(null);

    try {
      // Build full conversation history for backend
      const history = [...messages, userMessage].map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/legal-chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: history })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'আইনি তথ্য সার্ভার থেকে লোড করা সম্ভব হয়নি।');
      }

      const botMessage: LegalMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: 'assistant',
        text: data.text || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।',
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || 'নেটওয়ার্ক সংযোগ ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const suggestionPrompts = [
    "যৌতুক নিরোধ আইন ২০১৮ অনুযায়ী যৌতুক দাবি করলে সাজা কী?",
    "স্বামী দেনমোহর দিতে অস্বীকার করলে স্ত্রী হিসেবে আইনি পদক্ষেপ কী?",
    "পারিবারিক সহিংসতার শিকার হলে তাৎক্ষণিক সুরক্ষার আইন কী?",
    "বিবাহ বিচ্ছেদের পর সন্তানের অভিভাবকত্ব ও ভরণপোষণ কার কাছে থাকে?"
  ];

  const lawsData = [
    {
      title: "যৌতুক নিরোধ আইন, ২০১৮",
      desc: "যৌতুক দাবি করলে ৫ বছর পর্যন্ত কারাদণ্ড এবং ৫০,০০০ টাকা পর্যন্ত অর্থদণ্ডের বিধান রয়েছে। যৌতুক দেওয়া ও নেওয়া উভয়ই দণ্ডনীয় অপরাধ।",
      icon: Scale
    },
    {
      title: "পারিবারিক সহিংসতা প্রতিরোধ আইন, ২০১০",
      desc: "শারীরিক, মানসিক, যৌন বা অর্থনৈতিক নির্যাতনের বিরুদ্ধে আদালত থেকে জরুরি সুরক্ষা আদেশ, বাসস্থান সুবিধা ও ক্ষতিপূরণ আদায়ের আইনি অধিকার।" ,
      icon: Shield
    },
    {
      title: "দেনমোহর ও খোরপোষ অধিকার",
      desc: " দেনমোহর স্ত্রীর সম্পূর্ণ নিজস্ব অধিকার যা স্বামী পরিশোধ করতে বাধ্য। স্বামী তালাক দিলে বা না দিলেও স্ত্রী খোরপোষ বা ভরণপোষণ পাওয়ার যোগ্য।" ,
      icon: Landmark
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white border border-slate-200 rounded-none p-4 shadow-none">
      
      {/* Left Column: National Directories & Laws Overview */}
      <div className="lg:col-span-5 flex flex-col justify-between gap-4 border-b lg:border-b-0 lg:border-r border-slate-200 pb-4 lg:pb-0 lg:pr-4">
        <div>
          {/* Section Header */}
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-red-50 text-red-600 p-1.5 rounded-none border border-red-200">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                ফ্রি আইনি সহায়তা ডেস্ক <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
              </h3>
              <p className="text-[10px] text-slate-500">
                পারিবারিক সুরক্ষা আইন ও আইনি জরুরি হটলাইন
              </p>
            </div>
          </div>

          {/* Laws Directory Cards */}
          <div className="space-y-2">
            {lawsData.map((law, idx) => {
              const Icon = law.icon;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-none p-2.5 transition-all shadow-none">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded-none bg-white border border-slate-200 text-slate-800">
                      <Icon className="w-3 h-3" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{law.title}</h4>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-relaxed pl-1 text-justify">
                    {law.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Helpline cards */}
        <div className="bg-slate-900 text-white p-3.5 rounded-none border border-slate-950 shadow-none mt-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-1.5 mb-2">
            <Phone className="w-3 h-3" /> জরুরি সাহায্য হেল্পলাইন ডেস্ক
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-center">
            <a href="tel:109" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-1.5 rounded-none transition-all">
              <p className="text-[9px] text-slate-300">নারী নির্যাতন</p>
              <p className="text-sm font-black text-white mt-0.5">১০৯</p>
            </a>
            <a href="tel:16430" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-1.5 rounded-none transition-all">
              <p className="text-[9px] text-slate-300">সরকারি লিগ্যাল এইড</p>
              <p className="text-sm font-black text-white mt-0.5">১৬৪৩০</p>
            </a>
            <a href="tel:999" className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-1.5 rounded-none transition-all">
              <p className="text-[9px] text-slate-300">জরুরি সেবা</p>
              <p className="text-sm font-black text-white mt-0.5">৯৯৯</p>
            </a>
          </div>
          <p className="text-[9px] text-slate-400 text-center mt-2 leading-relaxed">
            যেকোনো নির্যাতনে বা বাল্যবিবাহ প্রতিরোধে উপরোক্ত সরকারি নম্বরগুলোতে সম্পূর্ণ ফ্রিতে ২৪ ঘণ্টা কল করতে পারবেন।
          </p>
        </div>
      </div>

      {/* Right Column: Interactive Chat Bot Console */}
      <div className="lg:col-span-7 flex flex-col h-[480px] bg-white border border-slate-200 rounded-none overflow-hidden shadow-none">
        
        {/* Chat Console Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse"></div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                আইনি এআই পরামর্শক <span className="bg-slate-900 text-white text-[8px] px-1 py-0.5 rounded-none font-bold tracking-wider uppercase font-sans">জেমিনি এআই</span>
              </h4>
              <p className="text-[9px] text-slate-500">অনলাইনে আইনি পরামর্শ ও তাৎক্ষণিক সমাধান ডেস্ক</p>
            </div>
          </div>
          <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
        </div>

        {/* Messages list container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div
                className={`p-2.5 rounded-none text-xs leading-relaxed shadow-none border ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 border-slate-950 text-white'
                    : 'bg-white border-slate-200 text-slate-800 text-justify'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5 px-0.5 font-mono">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {/* Gemini AI Typing Loader */}
          {isLoading && (
            <div className="flex flex-col mr-auto max-w-[85%] items-start animate-pulse">
              <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-none text-xs text-slate-700 flex items-center gap-2 font-semibold">
                <span className="flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-none animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-none animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-none animate-bounce [animation-delay:0.4s]"></span>
                </span>
                আইনি তথ্য অনুসন্ধান করা হচ্ছে...
              </div>
            </div>
          )}

          {/* Conversation Error alert */}
          {chatError && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-none p-2.5 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-950">ত্রুটি ঘটেছে</p>
                <p className="text-red-700 mt-0.5">{chatError}</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Prompts Bar */}
        <div className="p-1.5 border-t border-slate-200 bg-white overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1">
          {suggestionPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="inline-block bg-slate-50 hover:bg-slate-100 text-slate-800 text-[9px] font-bold px-2 py-1 rounded-none border border-slate-200 cursor-pointer transition-all shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Panel */}
        <form onSubmit={handleFormSubmit} className="p-2 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="আপনার আইনি প্রশ্নটি বাংলায় এখানে লিখুন..."
            className="flex-1 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-none px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`px-3 py-2 rounded-none flex items-center justify-center transition-all ${
              isLoading || !inputText.trim()
                ? 'bg-slate-100 border border-slate-200 text-slate-300 cursor-not-allowed'
                : 'bg-slate-900 border border-slate-950 text-white hover:bg-slate-850 cursor-pointer'
            }`}
            title="পাঠান"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
