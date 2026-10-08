import { db } from "./index.ts";
import { news } from "./schema.ts";
import { eq, desc } from "drizzle-orm";
import { LEAD_INVESTIGATIVE_ARTICLE } from "../data/leadInvestigativeArticle.ts";

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
  likes: number;
  shares: number;
  comments: NewsComment[];
  isAIExpanded?: boolean;
  quote?: string;
}

// In-memory news store for zero-downtime fallback (e.g. Vercel serverless / cold starts / offline DB)
const inMemoryNewsStore: NewsItem[] = [
  LEAD_INVESTIGATIVE_ARTICLE,
  {
    id: "news-mymensingh-cyber-syndicate",
    title: "ময়মনসিংহে আনন্দমোহন কলেজের শিক্ষার্থীদের টার্গেট করে গড়ে ওঠা ভয়ঙ্কর ব্ল্যাকমেইল ও সেক্স সিন্ডিকেটের রহস্য উন্মোচন",
    excerpt: "আনন্দমোহন কলেজের মেধাবী শিক্ষার্থীদের ফাঁদে ফেলে ব্ল্যাকমেইল, ছবি বিকৃতি, স্বপ্না সরকার, মেহেদী ও ইকবালের নেতৃত্বে গড়ে ওঠা ভয়ঙ্কর জঘন্য সেক্স ও মাদক সিন্ডিকেটের নীল নকশা ফাঁস।",
    body: `ময়মনসিংহের ঐতিহ্যবাহী শিক্ষাপ্রতিষ্ঠানগুলোর সরল ও মেধাবী শিক্ষার্থীদের টার্গেট করে গড়ে ওঠা এক ভয়ঙ্কর সাইবার, মাদক ও সেক্স সিন্ডিকেটের অন্ধকার অধ্যায় একের পর এক উন্মোচিত হচ্ছে। 'দি ইনভেস্টিগেশন'-এ ইতিপূর্বে প্রকাশিত ধারাবাহিক অনুসন্ধানের ধারাবাহিকতায় এবার এই চক্রের সবচেয়ে জঘন্যতম নীল নকশা সামনে এসেছে। অনুসন্ধানে স্পষ্ট যে, এই সিন্ডিকেটের মূল উদ্দেশ্য কেবল অনলাইনে ট্রোলিং বা মানহানি নয়, এর পেছনে রয়েছে এক সুগভীর সামাজিক অপরাধের জাল—যেখানে আনন্দমোহন কলেজসহ আশেপাশের বিভিন্ন কলেজের ছাত্র-ছাত্রীদের নৈতিকভাবে ধ্বংস করে নিজেদের অবৈধ স্বার্থ হাসিল করা হচ্ছে।

নেপথ্যের মূল গডমাদার স্বপ্না সরকার এবং মেহেদী-ইকবাল অক্ষ:
অনুসন্ধানের এই পর্যায়ে এসে সিন্ডিকেটের আসল 'কিংপিন' বা মূল পরিচালকদের পরিচয় পুরোপুরি উন্মোচিত হয়েছে। এই পুরো পৈশাচিক সাম্রাজ্যের নেপথ্যে গডমাদার হিসেবে কলকাঠি নাড়ছেন বিগত ফ্যাসিস্ট সরকারের প্রভাবশালী ও বিতর্কিত আওয়ামী লীগ নেত্রী স্বপ্না সরকার। স্থানীয় মাদক সাম্রাজ্য নিয়ন্ত্রণ এবং ধর্ষণের একাধিক ঘটনার নেপথ্য নেত্রী হিসেবে পরিচিত এই স্বপ্না সরকারের সরাসরি ইশারায় এবং রাজনৈতিক আশ্রয়ে এই চক্রটি পরিচালিত হচ্ছে। আর মাঠ পর্যায়ে এই সিন্ডিকেটের পুরো ক্রাইম অপারেশন ও কর্মী বাহিনীকে সমন্বয় করছে অপরাধ জগতের দুই কুখ্যাত স্তম্ভ মেহেদী এবং ইকবাল।

প্রশাসনের প্রতি জোরালো দাবি:
অবিলম্বে মাদক ও ধর্ষণের নেত্রী স্বপ্না সরকার, মূল পরিচালক মেহেদী ও ইকবালসহ এই জঘন্য সেক্স ও ব্ল্যাকমেইল সিন্ডিকেটের প্রত্যেকটি মাঠ পর্যায়ের কর্মীকে দ্রুত গ্রেফতার করে দৃষ্টান্তমূলক কঠোর শাস্তির আওতায় আনা হোক।`,
    date: "০৭ অক্টোবর, ২০২৬",
    author: "বিশেষ অনুসন্ধানী সেল | দি ইনভেস্টিগেশন",
    category: "deprived",
    categoryLabel: "বিশেষ অনুসন্ধান",
    likes: 540,
    shares: 231,
    quote: "একটি সভ্য সমাজে শিক্ষাব্যবস্থা ও তরুণ সমাজকে ধ্বংস করার এমন জঘন্য সিন্ডিকেট কোনোভাবেই মেনে নেওয়া যায় না।",
    comments: [
      { id: "c-cs-1", author: "ফারুক আহমেদ (অভিভাবক)", text: "আনন্দমোহন কলেজের প্রতিটি শিক্ষার্থীর নিরাপত্তা নিশ্চিত হোক। এই চক্রকে দৃষ্টান্তমূলক শাস্তি দেওয়া হোক।", date: "০৭ অক্টোবর" }
    ]
  }
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
    likes: row.likes,
    shares: row.shares,
    comments: commentsList,
    quote: row.quote || undefined,
  };
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
        return dbItems;
      }
    }
  } catch (error) {
    console.warn("Database query skipped or failed, falling back to memory store:", error);
  }
  return [...inMemoryNewsStore];
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
