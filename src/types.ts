export type Category = 'national' | 'investigation' | 'rights' | 'politics' | 'fb_exclusive' | 'success' | 'legal' | string;

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  author: string;
  category: Category;
  categoryLabel: string;
  image?: string;
  gallery?: { url: string; caption?: string }[];
  videoUrl?: string;
  likes: number;
  shares: number;
  comments?: Comment[];
  isBreaking?: boolean;
  isAIExpanded?: boolean;
  quote?: string;
  fbPostUrl?: string;
  fbPostId?: string;
  isFbPost?: boolean;
  fbReactions?: { like: number; love: number; wow: number; share: number };
}

export interface LegalMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
