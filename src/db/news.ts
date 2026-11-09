import { db } from "./index.ts";
import { news } from "./schema.ts";
import { eq, desc } from "drizzle-orm";
import { LEAD_INVESTIGATIVE_ARTICLE } from "../data/leadInvestigativeArticle.ts";
import { JOYBARTA_SEED_POSTS } from "../data/joybartaFacebookPosts.ts";

export interface NewsComment {
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
  category: string;
  categoryLabel: string;
  image?: string;
  gallery?: { url: string; caption?: string }[];
  likes: number;
  shares: number;
  comments?: NewsComment[];
  isAIExpanded?: boolean;
  quote?: string;
  fbPostUrl?: string;
  fbPostId?: string;
  isFbPost?: boolean;
  fbReactions?: { like: number; love: number; wow: number; share: number };
}

// In-memory news store for zero-downtime fallback (e.g. Vercel serverless / cold starts / offline DB)
const inMemoryNewsStore: NewsItem[] = [
  ...JOYBARTA_SEED_POSTS
];

// Map database news row to frontend NewsItem
function mapToNewsItem(row: typeof news.$inferSelect): NewsItem {
  let commentsList: NewsComment[] = [];
  try {
    commentsList = JSON.parse(row.comments) as NewsComment[];
  } catch (err) {
    console.error(`Error parsing comments for article ${row.id}:`, err);
  }

  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    date: row.date,
    author: row.author,
    category: row.category,
    categoryLabel: row.categoryLabel,
    image: row.image || undefined,
    gallery: inMemoryNewsStore.find(i => i.id === row.id)?.gallery || undefined,
    likes: row.likes,
    shares: row.shares,
    comments: commentsList,
    quote: row.quote || undefined,
    fbPostUrl: "https://www.facebook.com/share/1ahsbSRRMy/?mibextid=wwXIfr",
    isFbPost: true,
  };
}

// Helper to parse Bengali date string to timestamp for strict reverse-chronological ordering
export function parseBengaliDateToTime(dateStr: string): number {
  if (!dateStr) return 0;
  const bnToEnMap: { [k: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const normalized = dateStr.replace(/[০-৯]/g, d => bnToEnMap[d] || d);
  const months: { [k: string]: number } = {
    'জানুয়ারি': 0, 'জানুয়ারি': 0,
    'ফেব্রুয়ারি': 1, 'ফেব্রুয়ারি': 1,
    'মার্চ': 2,
    'এপ্রিল': 3,
    'মে': 4,
    'জুন': 5,
    'জুলাই': 6,
    'আগস্ট': 7,
    'সেপ্টেম্বর': 8,
    'অক্টোবর': 9,
    'নভেম্বর': 10,
    'ডিসেম্বর': 11
  };
  const match = normalized.match(/(\d+)\s+([^\s,]+)[,\s]+(\d+)/);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthName = match[2].trim();
    const year = parseInt(match[3], 10);
    const month = months[monthName] ?? 10;
    return new Date(year, month, day).getTime();
  }
  return 0;
}

export function sortNewsReverseChronological(items: NewsItem[]): NewsItem[] {
  return [...items].sort((a, b) => {
    const timeA = parseBengaliDateToTime(a.date);
    const timeB = parseBengaliDateToTime(b.date);
    
    // Strict date comparison: newer date (e.g. 8 Nov) comes BEFORE older date (7 Nov)
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    
    // Priority on 9 Nov:
    // 1st: Mymensingh Police Rank Badge news
    if (a.id === 'joybarta-mymo-police-rank-badge-2026') return -1;
    if (b.id === 'joybarta-mymo-police-rank-badge-2026') return 1;

    // 2nd: Albert Chowdhury fraud & embezzlement news (directly below police news)
    if (a.id === 'joybarta-mymensingh-elbert-chowdhury-fraud-2026') return -1;
    if (b.id === 'joybarta-mymensingh-elbert-chowdhury-fraud-2026') return 1;

    // Priority on 8 Nov for Sherpur news
    if (a.id === 'joybarta-sherpur-police-officers-mess-2026') return -1;
    if (b.id === 'joybarta-sherpur-police-officers-mess-2026') return 1;

    // Priority on 7 Nov for Lead historical article
    if (a.id === 'joybarta-lead-7-november-1975') return -1;
    if (b.id === 'joybarta-lead-7-november-1975') return 1;

    return 0;
  });
}

// Fetch all news (with resilient in-memory fallback for Vercel and serverless)
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    if (process.env.SQL_HOST) {
      const rows = await db.select().from(news).orderBy(desc(news.createdAt));
      if (rows && rows.length > 0) {
        const dbItems = rows.map(mapToNewsItem);
        // Sync to memory store
        for (const item of dbItems) {
          const idx = inMemoryNewsStore.findIndex(i => i.id === item.id);
          if (idx >= 0) inMemoryNewsStore[idx] = item;
          else inMemoryNewsStore.push(item);
        }
        return sortNewsReverseChronological(dbItems);
      }
    }
  } catch (error) {
    console.warn("Database query skipped or failed, falling back to memory store:", error);
  }
  return sortNewsReverseChronological(inMemoryNewsStore);
}

// Add a news article
export async function insertNews(item: NewsItem): Promise<NewsItem> {
  const existingIdx = inMemoryNewsStore.findIndex(i => i.id === item.id);
  if (existingIdx >= 0) {
    inMemoryNewsStore[existingIdx] = item;
  } else {
    inMemoryNewsStore.unshift(item);
  }

  try {
    if (process.env.SQL_HOST) {
      const commentsStr = JSON.stringify(item.comments || []);
      const [row] = await db
        .insert(news)
        .values({
          id: item.id,
          title: item.title,
          excerpt: item.excerpt,
          body: item.body,
          date: item.date,
          author: item.author,
          category: item.category,
          categoryLabel: item.categoryLabel,
          image: item.image || null,
          likes: item.likes || 0,
          shares: item.shares || 0,
          quote: item.quote || null,
          comments: commentsStr,
        })
        .onConflictDoUpdate({
          target: news.id,
          set: {
            title: item.title,
            excerpt: item.excerpt,
            body: item.body,
            quote: item.quote || null,
          }
        })
        .returning();
      return mapToNewsItem(row);
    }
  } catch (error) {
    console.warn("Database insert skipped or failed, saved to memory store:", error);
  }
  return item;
}

// Like an article
export async function likeNewsArticle(id: string): Promise<NewsItem> {
  const item = inMemoryNewsStore.find(i => i.id === id);
  if (item) {
    item.likes += 1;
  }

  try {
    if (process.env.SQL_HOST) {
      const [existing] = await db.select().from(news).where(eq(news.id, id));
      if (existing) {
        const [row] = await db
          .update(news)
          .set({ likes: existing.likes + 1 })
          .where(eq(news.id, id))
          .returning();
        return mapToNewsItem(row);
      }
    }
  } catch (error) {
    console.warn("Database like update failed, used in-memory result:", error);
  }

  if (item) return item;
  throw new Error(`Article with id ${id} not found`);
}

// Share an article
export async function shareNewsArticle(id: string): Promise<NewsItem> {
  const item = inMemoryNewsStore.find(i => i.id === id);
  if (item) {
    item.shares += 1;
  }

  try {
    if (process.env.SQL_HOST) {
      const [existing] = await db.select().from(news).where(eq(news.id, id));
      if (existing) {
        const [row] = await db
          .update(news)
          .set({ shares: existing.shares + 1 })
          .where(eq(news.id, id))
          .returning();
        return mapToNewsItem(row);
      }
    }
  } catch (error) {
    console.warn("Database share update failed, used in-memory result:", error);
  }

  if (item) return item;
  throw new Error(`Article with id ${id} not found`);
}

// Comment on an article
export async function addCommentToArticle(id: string, author: string, text: string): Promise<NewsItem> {
  const newComment: NewsComment = {
    id: `c-${Date.now()}`,
    author,
    text,
    date: "এইমাত্র",
  };

  const item = inMemoryNewsStore.find(i => i.id === id);
  if (item) {
    item.comments = [...(item.comments || []), newComment];
  }

  try {
    if (process.env.SQL_HOST) {
      const [existing] = await db.select().from(news).where(eq(news.id, id));
      if (existing) {
        let commentsList: NewsComment[] = [];
        try {
          commentsList = JSON.parse(existing.comments);
        } catch (e) {
          commentsList = [];
        }
        commentsList.push(newComment);

        const [row] = await db
          .update(news)
          .set({ comments: JSON.stringify(commentsList) })
          .where(eq(news.id, id))
          .returning();

        return mapToNewsItem(row);
      }
    }
  } catch (error) {
    console.warn("Database comment update failed, used in-memory result:", error);
  }

  if (item) return item;
  throw new Error(`Article with id ${id} not found`);
}

// Seed helper
export async function seedNewsDatabase(initialNews: NewsItem[]) {
  for (const item of initialNews) {
    if (!inMemoryNewsStore.some(i => i.id === item.id)) {
      inMemoryNewsStore.push(item);
    }
  }
  try {
    if (process.env.SQL_HOST) {
      const existing = await db.select({ id: news.id }).from(news).limit(1);
      if (existing.length === 0) {
        console.log("Database news table is empty. Seeding initial news data...");
        for (const item of initialNews) {
          await insertNews(item);
        }
        console.log("Database seeding completed successfully.");
      }
    }
  } catch (error) {
    console.warn("Error seeding news database, using memory store:", error);
  }
}

// Update existing news article
export async function updateNews(id: string, updates: Partial<NewsItem>): Promise<NewsItem> {
  const existingIndex = inMemoryNewsStore.findIndex(i => i.id === id);
  if (existingIndex >= 0) {
    inMemoryNewsStore[existingIndex] = {
      ...inMemoryNewsStore[existingIndex],
      ...updates
    };
  }

  try {
    if (process.env.SQL_HOST) {
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.excerpt !== undefined) updateData.excerpt = updates.excerpt;
      if (updates.body !== undefined) updateData.body = updates.body;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.categoryLabel !== undefined) updateData.categoryLabel = updates.categoryLabel;
      if (updates.image !== undefined) updateData.image = updates.image || null;
      if (updates.quote !== undefined) updateData.quote = updates.quote || null;
      if (updates.author !== undefined) updateData.author = updates.author;
      if (updates.date !== undefined) updateData.date = updates.date;

      const [row] = await db
        .update(news)
        .set(updateData)
        .where(eq(news.id, id))
        .returning();

      if (row) {
        return mapToNewsItem(row);
      }
    }
  } catch (error) {
    console.warn("Database update error, using updated memory store:", error);
  }

  if (existingIndex >= 0) {
    return inMemoryNewsStore[existingIndex];
  }
  throw new Error(`Article with id ${id} not found`);
}

// Delete a news article
export async function deleteNews(id: string): Promise<boolean> {
  const existingIndex = inMemoryNewsStore.findIndex(i => i.id === id);
  if (existingIndex >= 0) {
    inMemoryNewsStore.splice(existingIndex, 1);
  }

  try {
    if (process.env.SQL_HOST) {
      await db.delete(news).where(eq(news.id, id));
    }
  } catch (error) {
    console.warn("Database delete error, removed from memory store:", error);
  }

  return true;
}

