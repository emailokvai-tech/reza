export type Category = 'rights' | 'deprived' | 'success' | 'legal';

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
  likes: number;
  shares: number;
  comments: Comment[];
  isBreaking?: boolean;
  isAIExpanded?: boolean;
  quote?: string;
}

export interface LegalMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
