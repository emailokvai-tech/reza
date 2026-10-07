import { db } from "./index.ts";
import { news } from "./schema.ts";
import { eq, desc } from "drizzle-orm";

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

// Fetch all news
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    const rows = await db.select().from(news).orderBy(desc(news.createdAt));
    return rows.map(mapToNewsItem);
  } catch (error) {
    console.error("Failed to fetch news from database:", error);
    throw new Error("Failed to load news articles.", { cause: error });
  }
}

// Add a news article
export async function insertNews(item: NewsItem): Promise<NewsItem> {
  try {
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
      .returning();
    return mapToNewsItem(row);
  } catch (error) {
    console.error("Failed to insert news article:", error);
    throw new Error("Failed to save news article.", { cause: error });
  }
}

// Like an article
export async function likeNewsArticle(id: string): Promise<NewsItem> {
  try {
    const [existing] = await db.select().from(news).where(eq(news.id, id));
    if (!existing) {
      throw new Error(`Article with id ${id} not found`);
    }

    const [row] = await db
      .update(news)
      .set({ likes: existing.likes + 1 })
      .where(eq(news.id, id))
      .returning();

    return mapToNewsItem(row);
  } catch (error) {
    console.error("Failed to like news article:", error);
    throw new Error("Failed to like the article.", { cause: error });
  }
}

// Share an article
export async function shareNewsArticle(id: string): Promise<NewsItem> {
  try {
    const [existing] = await db.select().from(news).where(eq(news.id, id));
    if (!existing) {
      throw new Error(`Article with id ${id} not found`);
    }

    const [row] = await db
      .update(news)
      .set({ shares: existing.shares + 1 })
      .where(eq(news.id, id))
      .returning();

    return mapToNewsItem(row);
  } catch (error) {
    console.error("Failed to share news article:", error);
    throw new Error("Failed to share the article.", { cause: error });
  }
}

// Comment on an article
export async function addCommentToArticle(id: string, author: string, text: string): Promise<NewsItem> {
  try {
    const [existing] = await db.select().from(news).where(eq(news.id, id));
    if (!existing) {
      throw new Error(`Article with id ${id} not found`);
    }

    let commentsList: NewsComment[] = [];
    try {
      commentsList = JSON.parse(existing.comments);
    } catch (e) {
      commentsList = [];
    }

    const newComment: NewsComment = {
      id: `c-${Date.now()}`,
      author,
      text,
      date: "এইমাত্র",
    };

    commentsList.push(newComment);

    const [row] = await db
      .update(news)
      .set({ comments: JSON.stringify(commentsList) })
      .where(eq(news.id, id))
      .returning();

    return mapToNewsItem(row);
  } catch (error) {
    console.error("Failed to add comment to news article:", error);
    throw new Error("Failed to add comment.", { cause: error });
  }
}

// Seed helper
export async function seedNewsDatabase(initialNews: NewsItem[]) {
  try {
    const existing = await db.select({ id: news.id }).from(news).limit(1);
    if (existing.length === 0) {
      console.log("Database news table is empty. Seeding initial news data...");
      for (const item of initialNews) {
        await insertNews(item);
      }
      console.log("Database seeding completed successfully.");
    }
  } catch (error) {
    console.error("Error seeding news database:", error);
  }
}
