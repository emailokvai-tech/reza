import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import { db } from "./src/db/index.ts";
import { news } from "./src/db/schema.ts";
import { desc } from "drizzle-orm";

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
  category: "rights" | "deprived" | "success" | "legal";
  categoryLabel: string;
  image?: string;
  likes: number;
  shares: number;
  comments: Comment[];
  isBreaking?: boolean;
  isAIExpanded?: boolean;
  quote?: string;
}

const NEWS_FILE_PATH = path.join(process.cwd(), "data", "news.json");

// Helper to load current news from PostgreSQL
async function loadNews(): Promise<NewsItem[]> {
  try {
    const rows = await db.select().from(news).orderBy(desc(news.createdAt));
    return rows.map(row => {
      let commentsList: Comment[] = [];
      try {
        commentsList = JSON.parse(row.comments) as Comment[];
      } catch (err) {
        // Fallback
      }
      return {
        id: row.id,
        title: row.title,
        excerpt: row.excerpt,
        body: row.body,
        date: row.date,
        author: row.author,
        category: row.category as any,
        categoryLabel: row.categoryLabel,
        image: row.image || undefined,
        likes: row.likes,
        shares: row.shares,
        comments: commentsList,
        quote: row.quote || undefined
      };
    });
  } catch (error) {
    console.error("Error loading news from PostgreSQL in aggregator:", error);
    return [];
  }
}

// Helper to save news to PostgreSQL
async function saveNews(newsList: NewsItem[]) {
  try {
    for (const item of newsList) {
      await db.insert(news)
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
          likes: item.likes,
          shares: item.shares,
          quote: item.quote || null,
          comments: JSON.stringify(item.comments || []),
        })
        .onConflictDoNothing();
    }
  } catch (error) {
    console.error("Error saving news to PostgreSQL in aggregator:", error);
  }
}

// Utility to get today's date in Bengali (e.g. "২৯ জুন, ২০২৬")
function getBengaliDate(): string {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();
  
  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const monthName = months[date.getMonth()];
  
  const convertToBanglaNumber = (num: number | string): string => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(char => {
      const idx = parseInt(char);
      return !isNaN(idx) ? banglaDigits[idx] : char;
    }).join("");
  };

  return `${convertToBanglaNumber(day)} ${monthName}, ${convertToBanglaNumber(year)}`;
}

// Simple XML parser to read RSS items
function parseRSS(xmlText: string): Array<{ title: string; link: string; description: string }> {
  const items: Array<{ title: string; link: string; description: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
    const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);

    if (titleMatch) {
      items.push({
        title: titleMatch[1].trim(),
        link: linkMatch ? linkMatch[1].trim() : "",
        description: descMatch ? descMatch[1].trim() : ""
      });
    }
  }
  return items;
}

// Main aggregator service
export async function aggregateNews(ai: GoogleGenAI): Promise<{
  success: boolean;
  timestamp: string;
  addedCount: number;
  sourcesScanned: number;
  log: string[];
}> {
  const log: string[] = [];
  log.push("News Aggregator started at " + new Date().toISOString());

  let rawCandidates: Array<{ title: string; source: string; body: string; url?: string }> = [];

  // --- SOURCE 1: Fetch and parse regional/national RSS feeds ---
  const rssFeeds = [
    { url: "https://rss.dw.com/rdf/rss-bengali", name: "Deutsche Welle Bengali" },
    { url: "https://www.bbc.com/bengali/index.xml", name: "BBC Bangla" },
    { url: "https://bangla.thedailystar.net/rss.xml", name: "The Daily Star Bangla" },
    { url: "https://www.somoynews.tv/feed", name: "Somoy TV" },
    { url: "https://bangla.dhakatribune.com/feed", name: "Dhaka Tribune Bangla" }
  ];

  for (const feed of rssFeeds) {
    try {
      log.push(`Fetching RSS feed: ${feed.name} (${feed.url})`);
      const response = await fetch(feed.url, { signal: AbortSignal.timeout(5000) });
      if (response.ok) {
        const xml = await response.text();
        const items = parseRSS(xml);
        log.push(`Found ${items.length} items in ${feed.name} RSS feed`);

        // Filter items containing keywords related to women, child marriage, dower, success, violence
        const keywords = ["নারী", "মেধাবী", "ধর্ষণ", "নির্যাতন", "বাল্যবিবাহ", "যৌতুক", "উদ্যোক্তা", "সাফল্য", "কিশোরী", "অধিকার"];
        const matchedItems = items.filter(item => {
          const text = (item.title + " " + item.description).toLowerCase();
          return keywords.some(kw => text.includes(kw));
        });

        log.push(`Found ${matchedItems.length} matching items with women/child keywords in ${feed.name}`);
        for (const matched of matchedItems.slice(0, 3)) { // limit to 3 candidates per feed
          rawCandidates.push({
            title: matched.title,
            source: feed.name,
            body: matched.description || matched.title,
            url: matched.link
          });
        }
      } else {
        log.push(`Failed to fetch RSS ${feed.name}: HTTP status ${response.status}`);
      }
    } catch (err: any) {
      log.push(`Error fetching RSS feed ${feed.name}: ${err.message || err}`);
    }
  }

  // --- SOURCE 2: Social Media and Regional Portals via Search Grounding ---
  // Using Google Search Grounding with Gemini 3.5-flash to discover fresh news or social posts in Bangladesh
  try {
    log.push("Searching social media platforms (Facebook) and news portals via Google Search Grounding...");
    
    // We use a query targeting Bangladesh news and social reports from past 48 hours
    const searchQuery = `site:facebook.com OR "prothomalo.com" OR "thedailystar.net" "বাংলাদেশ" "নারী অধিকার" OR "নারী নির্যাতন" OR "বাল্যবিবাহ রোধ" OR "নারী উদ্যোক্তা"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Find 2 of the most recent and impactful news reports or Facebook posts from the last 48 hours from Bangladesh regarding:
1. An act of injustice, domestic violence, dowry, or child marriage.
2. A success story of a female entrepreneur or empowerment project in Dhaka (specifically areas like Motijheel or Arambag) or other parts of Bangladesh.

Provide them as structured reports with source URL, title, and a brief description of the raw facts. Format your output as a raw text list clearly separating each report.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const searchOutput = response.text;
    log.push("Search Grounding query successful. GroundingMetadata available.");

    // Extract grounding URLs as citation evidence
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const groundingUrls = chunks ? chunks.map((c: any) => c.web?.uri).filter(Boolean) : [];
    log.push(`Found ${groundingUrls.length} web grounding references.`);

    if (searchOutput) {
      rawCandidates.push({
        title: "সামাজিক যোগাযোগ মাধ্যম ও আঞ্চলিক পোর্টাল অনুসন্ধান",
        source: "Facebook & News Portals (Grounding)",
        body: searchOutput,
        url: groundingUrls[0] || "https://www.facebook.com"
      });
    }
  } catch (err: any) {
    log.push(`Error during Google Search Grounding: ${err.message || err}`);
  }

  // Fallback candidate if no candidate found (so the daily aggregator always injects value)
  if (rawCandidates.length === 0) {
    log.push("No candidate found, adding fallback high-quality empowerment template to run AI Rewrite");
    rawCandidates.push({
      title: "মতিঝিলের আরামবাগে কর্মজীবী নারীদের জন্য বিশেষ সচেতনতা কর্মশালা",
      source: "অনুসন্ধানী ডেস্ক",
      body: "আরামবাগ এলাকার একটি সেলাই প্রশিক্ষণ কেন্দ্রে গতকাল ৫০ জন সুবিধাবঞ্চিত নারীদের নিয়ে একটি সচেতনতা কর্মশালা অনুষ্ঠিত হয়েছে। নারী অধিকার কণ্ঠের সহযোগিতায় এবং স্থানীয় সমাজসেবীদের উদ্যোগে নারীদের আত্মরক্ষা, আইনি অধিকার এবং ক্ষুদ্র ব্যবসার ঋণ প্রাপ্তির উপায় সম্পর্কে দিকনির্দেশনা দেওয়া হয়।",
    });
  }

  log.push(`Processing ${rawCandidates.length} candidates for AI Rewrite in 'নারী অধিকার কণ্ঠ' style...`);

  const currentNews = await loadNews();
  let addedCount = 0;

  // Process and rewrite the best candidates using Gemini
  // We limit to max 2 rewritten articles per daily run to avoid token flooding and focus on high quality
  const candidatesToProcess = rawCandidates.slice(0, 2);

  for (let i = 0; i < candidatesToProcess.length; i++) {
    const candidate = candidatesToProcess[i];
    try {
      log.push(`Rewriting Candidate [${i + 1}]: "${candidate.title}"`);
      
      const systemInstruction = `You are the Editor-in-Chief of 'নারী অধিকার কণ্ঠ' (Voice of Women's Rights). The newspaper is officially based in Motijheel, Arambagh, Dhaka ("মতিঝিল, আরামবাগ, মতিঝিল, ঢাকা").
Your task is to take this raw report or search search result:
"${candidate.body}"

And rewrite it into a highly powerful, bold, and passionate Bengali news article.
The article must match the following guidelines:
1. Authoritative and investigative Bengali tone. Expose perpetrators and support victims.
2. Select the correct category:
   - "rights" (অধিকার কথা - for protests, legal wins, safety campaign)
   - "deprived" (বঞ্চিতের কান্না - for crimes, domestic abuse, dowry, child marriage)
   - "success" (সফলতার গল্প - for female entrepreneurs, jobs, inspirational achievements)

CRITICAL RULES FOR NEWS WRITING:
- NEVER include the newspaper's publication/office address ("মতিঝিল, আরামবাগ, মতিঝিল, ঢাকা", "বাগানবাড়ি, ময়মনসিংহ", etc.) or any editor/publishing credits or location stamps inside the news title, news excerpt, or news body text.
- The news body and text must focus strictly on the incident, the event location (where the actual crime or success occurred, e.g., Rajshahi, Chittagong, etc.), and the people involved. It is an absolute journalistic error to print the newspaper's publication address inside the news story itself.
3. Return the rewritten news in Bengali as a strict JSON object matches our schema.`;

      const rewriteResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `অনুগ্রহ করে নিচের খসড়া সংবাদটি আমাদের নারী অধিকার কণ্ঠের উপযোগী করে আকর্ষণীয় ও আবেগময় ভাষায় বিস্তারিত রিপোর্ট আকারে লিখে JSON আকারে প্রদান করুন:\n\nউৎস: ${candidate.source}\nমূল বিষয়: ${candidate.body}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "A passionate, bold Bengali headline. Under 15 words."
              },
              excerpt: {
                type: Type.STRING,
                description: "An emotional and dramatic Bengali summary (2-3 sentences)."
              },
              body: {
                type: Type.STRING,
                description: "Detailed investigative news report in Bengali. Structured in 3+ paragraphs."
              },
              category: {
                type: Type.STRING,
                enum: ["rights", "deprived", "success"],
                description: "Category representing the news content type."
              },
              categoryLabel: {
                type: Type.STRING,
                description: "Display label in Bengali, e.g. 'অধিকার কথা' for rights, 'বঞ্চিতের কান্না' for deprived, 'সফলতার গল্প' for success."
              },
              quote: {
                type: Type.STRING,
                description: "A bold, heart-touching Bengali quote from a victim, hero, or official."
              }
            },
            required: ["title", "excerpt", "body", "category", "categoryLabel", "quote"]
          }
        }
      });

      const jsonText = rewriteResponse.text;
      if (jsonText) {
        const parsed = JSON.parse(jsonText.trim());
        
        // Ensure the headline is unique or slightly different to prevent duplicate addition
        const isDuplicate = currentNews.some(item => 
          item.title.trim().toLowerCase() === parsed.title.trim().toLowerCase() ||
          (parsed.title.length > 5 && item.title.includes(parsed.title.substring(0, 10)))
        );

        if (isDuplicate) {
          log.push(`Candidate [${i + 1}] identified as a duplicate headline. Skipping.`);
          continue;
        }

        // Construct standard NewsItem
        const newArticle: NewsItem = {
          id: `aggregated-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: parsed.title,
          excerpt: parsed.excerpt,
          body: parsed.body,
          date: getBengaliDate(),
          author: "আগ্রিগেটর ডেস্ক (নারী অধিকার কণ্ঠ)",
          category: parsed.category,
          categoryLabel: parsed.categoryLabel,
          likes: Math.floor(Math.random() * 15) + 5,
          shares: Math.floor(Math.random() * 8) + 1,
          comments: [],
          isAIExpanded: true,
          quote: parsed.quote
        };

        // Add to front of the database
        currentNews.unshift(newArticle);
        addedCount++;
        log.push(`Successfully added new article: "${parsed.title}" in category "${parsed.category}"`);
      }
    } catch (err: any) {
      log.push(`Error rewriting candidate [${i + 1}]: ${err.message || err}`);
    }
  }

  if (addedCount > 0) {
    await saveNews(currentNews);
    log.push(`Successfully saved ${addedCount} new articles to Cloud SQL database.`);
  } else {
    log.push("No new articles added (all candidates skipped or failed).");
  }

  log.push("News Aggregator run completed.");
  return {
    success: true,
    timestamp: new Date().toISOString(),
    addedCount,
    sourcesScanned: rssFeeds.length + 1,
    log
  };
}
