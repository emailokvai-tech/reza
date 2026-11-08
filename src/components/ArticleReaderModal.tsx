import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Share2, 
  ThumbsUp, 
  Printer, 
  Copy, 
  Play,
  Pause,
  RotateCcw,
  Volume2, 
  VolumeX, 
  Check, 
  MessageSquare, 
  Send,
  Quote,
  Radio,
  Sparkles,
  Loader2
} from 'lucide-react';
import { NewsItem } from '../types.ts';
import NewsImage from './NewsImage.tsx';

interface ArticleReaderModalProps {
  article: NewsItem | null;
  onClose: () => void;
  onLike: (id: string) => void;
  onShare: (id: string) => void;
  onArticleSelect?: (article: NewsItem) => void;
  relatedArticles?: NewsItem[];
  autoPlayAudio?: boolean;
}

export default function ArticleReaderModal({
  article,
  onClose,
  onLike,
  onShare,
  onArticleSelect,
  relatedArticles = [],
  autoPlayAudio = false
}: ArticleReaderModalProps) {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isCopied, setIsCopied] = useState(false);

  // Studio News Audio Player States (Authentic Bengali Female Voice)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Comments state
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<any[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Convert English number to Bengali digits
  const toBengaliNumber = (num: number | string): string => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(char => {
      const idx = parseInt(char);
      return !isNaN(idx) ? banglaDigits[idx] : char;
    }).join("");
  };

  // Format seconds to mm:ss in Bengali digits
  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return '০:০০';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const mStr = toBengaliNumber(m);
    const sStr = toBengaliNumber(s.toString().padStart(2, '0'));
    return `${mStr}:${sStr}`;
  };

  useEffect(() => {
    if (article) {
      setLocalComments(article.comments || []);
      // Reset audio when opening a new article
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setIsPlaying(false);
      setIsLoadingAudio(false);
      setAudioError(null);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [article]);

  // Clean up audio on unmount or modal close
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!article) return null;

  // Text size classes
  const bodyTextClass = 
    fontSize === 'xlarge' ? 'text-lg md:text-xl leading-relaxed' :
    fontSize === 'large' ? 'text-base md:text-lg leading-relaxed' :
    'text-sm md:text-base leading-relaxed';

  // Toggle authentic Bengali female newsreader audio
  const togglePlayAudio = async () => {
    setAudioError(null);

    // If audio already exists
    if (audioRef.current && audioRef.current.src) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          audioRef.current.playbackRate = playbackSpeed;
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (e: any) {
          setAudioError('অডিও প্লে করতে সমস্যা হয়েছে।');
          setIsPlaying(false);
        }
      }
      return;
    }

    // Initialize new audio stream from /api/tts
    setIsLoadingAudio(true);
    try {
      const audioUrl = article.id 
        ? `/api/tts?id=${encodeURIComponent(article.id)}`
        : `/api/tts?text=${encodeURIComponent(`${article.title}। ${article.excerpt || ''}`)}`;

      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackSpeed;

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration || 0);
        setIsLoadingAudio(false);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        setIsLoadingAudio(false);
        setIsPlaying(false);
        setAudioError('সংবাদ পাঠের অডিও লোড হতে পারেনি। অনুগ্রহ করে আবার চেষ্টা করুন।');
      });

      audioRef.current = audio;
      await audio.play();
      setIsPlaying(true);
    } catch (err: any) {
      console.error('TTS request error:', err);
      setIsLoadingAudio(false);
      setIsPlaying(false);
      setAudioError('অডিও পাঠিকা সংযোগে ত্রুটি দেখা দিয়েছে।');
    }
  };

  // Auto-play audio if triggered by "সংবাদ শুনুন"
  useEffect(() => {
    if (article && autoPlayAudio) {
      const timer = setTimeout(() => {
        togglePlayAudio();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [article?.id, autoPlayAudio]);

  // Change playback speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Replay from beginning
  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Seek audio
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Copy link
  const handleCopyLink = () => {
    const url = window.location.origin + `?article=${article.id}`;
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Print article
  const handlePrint = () => {
    window.print();
  };

  // Comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const author = commentName.trim() || 'সম্মানিত পাঠক';
    setSubmittingComment(true);

    try {
      const res = await fetch(`/api/news/${article.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, text: commentText.trim() })
      });

      if (res.ok) {
        const updated = await res.json();
        setLocalComments(updated.comments || []);
        setCommentText('');
        setCommentName('');
      } else {
        const newC = {
          id: `c-${Date.now()}`,
          author,
          text: commentText.trim(),
          date: 'এইমাত্র'
        };
        setLocalComments(prev => [...prev, newC]);
        setCommentText('');
      }
    } catch (err) {
      const newC = {
        id: `c-${Date.now()}`,
        author,
        text: commentText.trim(),
        date: 'এইমাত্র'
      };
      setLocalComments(prev => [...prev, newC]);
      setCommentText('');
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex justify-center items-start p-2 sm:p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          if (audioRef.current) audioRef.current.pause();
          onClose();
        }
      }}
    >
      <div className="bg-white text-slate-900 w-full max-w-4xl my-4 rounded-sm shadow-2xl border border-slate-300 overflow-hidden animate-fadeIn font-sans">
        
        {/* Top Control Bar */}
        <div className="bg-[#0f3d2e] text-white px-4 py-2.5 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-red-600 inline-block"></span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
              {article.categoryLabel || 'সংবাদ'}
            </span>
            <span className="text-emerald-500 font-bold">•</span>
            <span className="text-xs font-bold text-slate-200">
              জয়বার্তা ডিজিটাল সংস্করণ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="সংবাদটি প্রিন্ট করুন"
              className="text-emerald-200 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (audioRef.current) audioRef.current.pause();
                onClose();
              }}
              title="বন্ধ করুন (Esc)"
              className="text-emerald-200 hover:text-white hover:bg-emerald-900 p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Article Content Area */}
        <div className="p-5 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Header Metadata Block */}
          <div className="border-b border-slate-200 pb-4 space-y-3">
            {/* Category Shoulder / Kicker */}
            <div className="text-xs font-bold text-red-700 uppercase tracking-wide">
              {article.categoryLabel || 'বিশেষ সংবাদ'}
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 font-serif leading-tight">
              {article.title}
            </h1>

            {/* Reporter Byline & Dateline */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-2 gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-[#0f3d2e] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  {article.author || 'জয়নাল আবেদীন'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1.5 font-medium text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {article.date}
                </span>
              </div>

              {/* Reader font size tools */}
              <div className="flex items-center border border-slate-200 rounded text-xs bg-slate-50 font-mono">
                <button 
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 font-bold cursor-pointer ${fontSize === 'normal' ? 'bg-[#0f3d2e] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                  title="স্বাভাবিক ফন্ট"
                >
                  A
                </button>
                <button 
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-0.5 font-bold cursor-pointer ${fontSize === 'large' ? 'bg-[#0f3d2e] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                  title="বড় ফন্ট"
                >
                  A+
                </button>
                <button 
                  onClick={() => setFontSize('xlarge')}
                  className={`px-2 py-0.5 font-bold cursor-pointer ${fontSize === 'xlarge' ? 'bg-[#0f3d2e] text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                  title="আরও বড় ফন্ট"
                >
                  A++
                </button>
              </div>
            </div>
          </div>

          {/* Dedicated Studio Newsreader Audio Player Bar (মার্জিত প্রমিত বাংলা নারী কণ্ঠ) */}
          <div className="bg-gradient-to-r from-[#0b291e] to-[#0f3d2e] text-white p-3.5 sm:p-4 rounded-xs border-l-4 border-red-600 shadow-sm space-y-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                </span>
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>জয়বার্তা সংবাদ বুলেটিন</span>
                    <span className="text-[10px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded-xs font-sans font-medium">
                      প্রমিত বাংলা নারী কণ্ঠ
                    </span>
                  </h4>
                  <p className="text-[10.5px] text-emerald-200">
                    মার্জিত ও স্পষ্ট সংবাদ বাচনিক পাঠ শুনুন
                  </p>
                </div>
              </div>

              {/* Speed Controller */}
              <div className="flex items-center gap-1 text-[10px] font-mono bg-black/25 px-2 py-1 rounded border border-emerald-800/60">
                <span className="text-emerald-300 font-bold mr-1">গতি:</span>
                {[0.85, 1.0, 1.15].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                      playbackSpeed === speed 
                        ? 'bg-red-600 text-white font-bold' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {speed === 0.85 ? 'ধীরে' : speed === 1.0 ? 'স্বাভাবিক' : 'দ্রুত'}
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Controls Bar */}
            <div className="flex items-center gap-3 pt-1">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayAudio}
                disabled={isLoadingAudio}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-transform active:scale-95 disabled:opacity-50"
                title={isPlaying ? 'সংবাদ পাঠ থামান' : 'সংবাদ পাঠ শুরু করুন'}
              >
                {isLoadingAudio ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Replay Button */}
              <button
                onClick={handleReplay}
                className="text-emerald-300 hover:text-white p-1 rounded transition-colors cursor-pointer"
                title="শুরু থেকে আবার শুনুন"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Progress Slider */}
              <div className="flex-1 space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between items-center text-[10px] text-emerald-200 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  {/* Voice waveform equalizer effect when playing */}
                  {isPlaying && (
                    <div className="flex items-center gap-0.5 h-2.5">
                      <span className="w-0.5 bg-red-400 h-2 animate-bounce"></span>
                      <span className="w-0.5 bg-emerald-400 h-3 animate-pulse"></span>
                      <span className="w-0.5 bg-red-400 h-1.5 animate-bounce delay-75"></span>
                      <span className="w-0.5 bg-emerald-400 h-2.5 animate-pulse delay-100"></span>
                    </div>
                  )}
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {audioError && (
              <p className="text-[11px] text-amber-300 bg-black/30 p-1.5 rounded text-center">
                {audioError}
              </p>
            )}
          </div>

          {/* Authentic Photograph (Only if image is present and not empty) */}
          {article.image && article.image.trim() !== '' && (
            <div className="space-y-1.5 my-3">
              <div className="overflow-hidden border border-slate-300 bg-slate-900/5 rounded-xs flex items-center justify-center p-1.5">
                <NewsImage 
                  src={article.image} 
                  alt={article.title} 
                  aspectRatio="auto"
                  objectFit="contain"
                  maxHeight="max-h-[580px]"
                  className="w-auto max-w-full"
                />
              </div>
              <p className="text-xs text-slate-600 font-medium italic text-center">
                {article.id === 'joybarta-lead-7-november-1975'
                  ? 'ঐতিহাসিক আলোকচিত্র: সাবেক রাষ্ট্রপতি শহীদ জিয়াউর রহমান (বীর উত্তম)'
                  : 'ছবি: জয়বার্তা'}
              </p>
            </div>
          )}

          {/* Video Player (if videoUrl is present) */}
          {article.videoUrl && article.videoUrl.trim() !== '' && (
            <div className="space-y-1.5 my-3">
              <div className="aspect-video w-full overflow-hidden rounded-xs border border-slate-300 bg-black">
                {article.videoUrl.includes('facebook.com') ? (
                  <iframe
                    src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(article.videoUrl)}&show_text=false&t=0`}
                    className="w-full h-full border-0"
                    scrolling="no"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    title="ভিডিও প্রতিবেদন"
                  />
                ) : article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={article.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="ভিডিও প্রতিবেদন"
                  />
                ) : (
                  <video controls className="w-full h-full">
                    <source src={article.videoUrl} />
                    আপনার ব্রাউজার ভিডিওটি সমর্থন করে না।
                  </video>
                )}
              </div>
              <p className="text-[11px] text-slate-500 italic text-right">ভিডিও প্রতিবেদন</p>
            </div>
          )}

          {/* Lead Paragraph / Summary Callout */}
          {article.excerpt && (
            <div className="bg-slate-50 border-l-4 border-[#0f3d2e] p-4 text-slate-800 font-medium text-sm md:text-base leading-relaxed text-justify">
              {article.excerpt}
            </div>
          )}

          {/* Full Article Body */}
          <div className={`text-slate-900 space-y-4 text-justify ${bodyTextClass}`}>
            {article.body.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Editorial Quote Box (if present) */}
          {article.quote && (
            <div className="my-6 bg-[#0f3d2e] text-white p-5 border-l-4 border-red-600 rounded-xs shadow-xs relative italic font-serif">
              <Quote className="w-6 h-6 text-emerald-300/40 absolute -top-2 -left-1" />
              <p className="text-sm md:text-base font-semibold leading-relaxed">
                "{article.quote}"
              </p>
              <span className="block text-right text-xs text-emerald-300 mt-2 font-sans font-bold">
                — {article.author || 'জয়নাল আবেদীন'}
              </span>
            </div>
          )}

          {/* Reader Engagement Toolbar */}
          <div className="border-t border-b border-slate-200 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onLike(article.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xs transition-colors cursor-pointer border border-slate-300"
              >
                <ThumbsUp className="w-4 h-4 text-[#0f3d2e]" />
                <span>সহমত ({article.likes})</span>
              </button>

              <button
                onClick={() => onShare(article.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xs transition-colors cursor-pointer border border-slate-300"
              >
                <Share2 className="w-4 h-4 text-slate-600" />
                <span>শেয়ার ({article.shares})</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xs transition-colors cursor-pointer border border-slate-300"
                title="সংবাদের লিংক কপি করুন"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                <span>{isCopied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
              </button>
            </div>

            <div className="text-slate-500 font-medium text-[11px]">
              জয়বার্তা • সত্যের সন্ধানে প্রতিদিন
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-black text-[#0f3d2e] uppercase flex items-center gap-2 border-b border-slate-200 pb-2">
              <MessageSquare className="w-4 h-4 text-red-600" />
              পাঠকের মতামত ({localComments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xs space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="আপনার নাম (ঐচ্ছিক)"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="bg-white text-slate-800 text-xs px-3 py-1.5 border border-slate-300 rounded-xs focus:outline-none focus:border-[#0f3d2e]"
                />
              </div>
              <textarea
                rows={2}
                placeholder="এই সংবাদের বিষয়ে আপনার গঠনমূলক মতামত লিখুন..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-white text-slate-800 text-xs p-2.5 border border-slate-300 rounded-xs focus:outline-none focus:border-[#0f3d2e] resize-none"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="bg-[#0f3d2e] hover:bg-[#16503c] disabled:opacity-50 text-white font-bold text-xs px-4 py-1.5 rounded-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submittingComment ? 'পাঠানো হচ্ছে...' : 'মতামত প্রকাশ করুন'}</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {localComments.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি আপনি করুন।
                </p>
              ) : (
                localComments.map((c, i) => (
                  <div key={c.id || i} className="bg-white border border-slate-200 p-3 rounded-xs text-xs space-y-1">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="font-bold text-[#0f3d2e]">{c.author}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{c.date}</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related News from Joybarta */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-slate-200 pt-5 space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase">
                জয়বার্তা: আরও সংবাদ পড়ুন
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedArticles.slice(0, 3).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => {
                      if (onArticleSelect) {
                        onArticleSelect(rel);
                      }
                    }}
                    className="p-3 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-[#0f3d2e] rounded-xs cursor-pointer transition-all space-y-1"
                  >
                    <span className="text-[10px] text-red-600 font-bold uppercase block">
                      {rel.categoryLabel}
                    </span>
                    <h5 className="text-xs font-bold text-slate-950 font-serif line-clamp-2 hover:text-[#0f3d2e]">
                      {rel.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      {rel.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
