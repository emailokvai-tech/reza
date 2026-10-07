import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { aggregateNews, NewsItem } from "./newsAggregator.ts";
import {
  getAllNews,
  insertNews,
  likeNewsArticle,
  shareNewsArticle,
  addCommentToArticle,
  seedNewsDatabase
} from "./src/db/news.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { generateSocialMediaNews, SocialMediaPost } from "./src/data/socialMediaNews.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve assets/images statically so they are available in both development and production
app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src', 'assets', 'images')));

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not defined in Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Local dynamic database paths (for initial seed/migration)
const NEWS_JSON_PATH = path.join(process.cwd(), "data", "news.json");

// Tracker for automated news scheduler
let lastAggregationStatus = {
  lastRun: "কখনো নয়",
  success: false,
  addedCount: 0,
  log: ["সিস্টেম এখনো প্রথম অ্যাগ্রিগেশন সম্পন্ন করেনি।"],
  isProcessing: false
};

// Helper to read local database (used for seeding)
function readLocalNews(): NewsItem[] {
  try {
    if (fs.existsSync(NEWS_JSON_PATH)) {
      return JSON.parse(fs.readFileSync(NEWS_JSON_PATH, "utf8"));
    }
  } catch (err) {
    console.error("Error reading local news database for seeding:", err);
  }
  return [];
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Dynamic REST News API endpoints
app.get("/api/news", async (req, res) => {
  try {
    const articles = await getAllNews();
    res.json(articles);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/news", async (req, res) => {
  try {
    const article = req.body;
    if (!article.title || !article.body) {
      return res.status(400).json({ error: "সংবাদের শিরোনাম ও বিষয়বস্তু প্রদান আবশ্যক।" });
    }
    const saved = await insertNews(article);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/news/:id/like", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await likeNewsArticle(id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/news/:id/share", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await shareNewsArticle(id);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/news/:id/comment", async (req, res) => {
  try {
    const { id } = req.params;
    const { author, text } = req.body;
    if (!author || !text) {
      return res.status(400).json({ error: "মন্তব্যকারীর নাম ও মন্তব্য দেওয়া আবশ্যক।" });
    }
    const updated = await addCommentToArticle(id, author, text);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Sync signed-in user profile to PostgreSQL on login
app.post("/api/users/sync", async (req, res) => {
  try {
    const { uid, email } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ error: "Missing uid or email" });
    }
    const user = await getOrCreateUser(uid, email);
    res.json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/admin/trigger-aggregation", async (req, res) => {
  if (lastAggregationStatus.isProcessing) {
    return res.status(400).json({ error: "অ্যাগ্রিগেশন প্রক্রিয়া চলমান আছে।" });
  }
  
  lastAggregationStatus.isProcessing = true;
  try {
    const ai = getAI();
    const result = await aggregateNews(ai);
    lastAggregationStatus = {
      lastRun: new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }),
      success: result.success,
      addedCount: result.addedCount,
      log: result.log,
      isProcessing: false
    };
    res.json(lastAggregationStatus);
  } catch (err: any) {
    lastAggregationStatus.isProcessing = false;
    lastAggregationStatus.log.push(`Error: ${err.message}`);
    res.status(500).json({ error: "অটো-অ্যাগ্রিগেশন ব্যর্থ হয়েছে।", details: err.message });
  }
});

app.get("/api/admin/aggregation-status", (req, res) => {
  res.json(lastAggregationStatus);
});

// Social Media News Storage & Endpoints
let socialMediaPosts: SocialMediaPost[] = [];

function getSocialMediaPostsList(): SocialMediaPost[] {
  if (socialMediaPosts.length === 0) {
    console.log("Seeding server memory with programmatic social media news items...");
    socialMediaPosts = generateSocialMediaNews();
    console.log(`Successfully loaded ${socialMediaPosts.length} social media news posts.`);
  }
  return socialMediaPosts;
}

app.get("/api/social-media", (req, res) => {
  try {
    const list = getSocialMediaPostsList();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/social-media/create", (req, res) => {
  try {
    const { portalName, content, hashtags } = req.body;
    if (!portalName || !content) {
      return res.status(400).json({ error: "পোস্টের পোর্টাল নাম ও বিষয়বস্তু প্রদান করা আবশ্যক।" });
    }
    const list = getSocialMediaPostsList();
    const newPost: SocialMediaPost = {
      id: `sm-user-${Date.now()}`,
      portalName,
      portalUsername: `@${portalName.replace(/\s+/g, '')}`,
      portalLogo: portalName[0] || "U",
      isVerified: true,
      timeAgo: "এইমাত্র",
      content,
      hashtags: hashtags || [],
      likes: 0,
      commentsCount: 0,
      shares: 0,
      comments: [],
      sourceUrl: "https://www.facebook.com"
    };
    list.unshift(newPost);
    res.json(newPost);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/social-media/:id/like", (req, res) => {
  try {
    const { id } = req.params;
    const list = getSocialMediaPostsList();
    const post = list.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ error: "পোস্টটি পাওয়া যায়নি।" });
    }
    post.likes += 1;
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/social-media/:id/share", (req, res) => {
  try {
    const { id } = req.params;
    const list = getSocialMediaPostsList();
    const post = list.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ error: "পোস্টটি পাওয়া যায়নি।" });
    }
    post.shares += 1;
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/social-media/:id/comment", (req, res) => {
  try {
    const { id } = req.params;
    const { author, text } = req.body;
    if (!author || !text) {
      return res.status(400).json({ error: "মন্তব্যকারীর নাম ও মন্তব্য দেওয়া আবশ্যক।" });
    }
    const list = getSocialMediaPostsList();
    const post = list.find(p => p.id === id);
    if (!post) {
      return res.status(404).json({ error: "পোস্টটি পাওয়া যায়নি।" });
    }
    const newComment = {
      id: `sm-c-${Date.now()}`,
      author,
      text,
      date: "এইমাত্র"
    };
    post.comments.push(newComment);
    post.commentsCount = post.comments.length;
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/social-media/:id", (req, res) => {
  try {
    const { id } = req.params;
    const list = getSocialMediaPostsList();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "পোস্টটি পাওয়া যায়নি।" });
    }
    const [deleted] = list.splice(index, 1);
    res.json({ success: true, deletedId: id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// AI News Rewrite Endpoint
app.post("/api/rewrite-news", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== "string" || rawText.trim() === "") {
      return res.status(400).json({ error: "সংবাদের মূল খসড়া বা টেক্সট প্রদান করা আবশ্যক।" });
    }

    const ai = getAI();
    const systemInstruction = `You are a passionate, courageous, and impact-driven Editor-in-Chief and advocacy journalist for 'নারী অধিকার কণ্ঠ' (Voice of Women's Rights), a leading investigative news portal in Bangladesh. The newspaper is officially based in Motijheel, Arambagh, Dhaka ("মতিঝিল, আরামবাগ, মতিঝিল, ঢাকা").

Your task is to take raw draft news or raw bullet points about injustices, rights violations, or struggles of women and children, and rewrite it in Bengali.
Apply a highly passionate, emotional, aggressive, and investigative tone that advocates powerfully for women's rights, child safety, and social justice.
Expose corruption, administrative negligence, and hypocrisy of perpetrators with a bold, authoritative voice.

CRITICAL RULES FOR NEWS WRITING:
1. NEVER include the newspaper's publication/office address ("মতিঝিল, আরামবাগ, মতিঝিল, ঢাকা", "বাগানবাড়ি, ময়মনসিংহ", etc.) or any editor/publishing credits or location stamps inside the news title, news excerpt, or news body text. 
2. The news body and text must focus strictly on the incident, the event location (where the actual crime or success occurred, e.g., Rajshahi, Chittagong, etc.), and the people involved. It is an absolute journalistic error to print the newspaper's publication address inside the news story itself.
3. Provide the output as JSON matching the requested schema. Ensure the titles, summaries, quotes, and bodies are fully detailed, deeply investigative, and written in highly articulate, impactful Bengali.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `অনুগ্রহ করে নিচের খসড়া সংবাদটি নারী অধিকার কণ্ঠের উপযোগী করে আবেগদীপ্ত, সাহসী এবং অনুসন্ধানী ভাষায় নতুন করে লিখুন:\n\n${rawText}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A powerful, aggressive, and eye-catching journalistic headline in Bengali."
            },
            excerpt: {
              type: Type.STRING,
              description: "A short, emotional, and dramatic summary/excerpt in Bengali (2-3 sentences)."
            },
            body: {
              type: Type.STRING,
              description: "The complete, detailed, deeply investigative, and articulate report in Bengali with paragraphs."
            },
            quote: {
              type: Type.STRING,
              description: "A bold, emotionally striking quote expressing the struggle, courage, or cry for justice."
            }
          },
          required: ["title", "excerpt", "body", "quote"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini API.");
    }

    const parsedData = JSON.parse(text.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/rewrite-news:", error);
    res.status(500).json({
      error: "এআই নিউজ রিরাইট সম্পন্ন করা সম্ভব হয়নি।",
      details: error.message || error
    });
  }
});

// AI Legal Assistant Chatbot Endpoint
app.post("/api/legal-chatbot", async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user'|'model', text: string }
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "বার্তা তালিকা প্রদান করা আবশ্যক।" });
    }

    const ai = getAI();
    const systemInstruction = `You are a compassionate, highly knowledgeable, and friendly Legal Advisor for 'নারী অধিকার কণ্ঠ' (Voice of Women's Rights) Free Legal Aid desk.
Your goal is to provide accurate, helpful, and easily understandable legal advice in Bengali to women in Bangladesh regarding family laws, women's rights, and child safety.
Focus on topics such as:
1. Dowry Prohibition Act 2018 (যৌতুক নিরোধ আইন ২০১৮)
2. Domestic Violence Prevention and Protection Act 2010 (পারিবারিক সহিংসতা প্রতিরোধ ও সুরক্ষা আইন ২০১০)
3. Child Marriage Restraint Act (বাল্যবিবাহ নিরোধ আইন)
4. Laws concerning marriage, divorce (তালাক), and Dower/Denmohor (দেনমোহর ও খোরপোষ)
5. Legal rights of children and maternal custody (সন্তানের অভিভাবকত্ব ও হেফাজত)

Instructions:
- Speak in a highly compassionate, polite, supportive, and professional tone.
- Give concrete, actionable legal steps in plain Bengali.
- Highlight the national helpline numbers for quick assistance: 109 (জাতীয় নারী ও শিশু নির্যাতন প্রতিরোধ সেল), 16430 (সরকারি আইনি সেবা সেল), and 999 (জাতীয় জরুরি সেবা).
- Encourage the user to stay strong and remind them that they are not alone. Keep responses concise yet informative (under 250 words).`;

    // Map conversation messages to Gemini chat structure
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/legal-chatbot:", error);
    res.status(500).json({
      error: "আইনি চ্যাটবট রেসপন্স তৈরি করতে ব্যর্থ হয়েছে।",
      details: error.message || error
    });
  }
});

// Automated daily scheduler execution
async function runAutoAggregation() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.log("GEMINI_API_KEY is not defined. Automatic daily news aggregator scheduler is waiting for key configuration...");
    return;
  }
  
  console.log("Triggering automatic daily news aggregator run...");
  lastAggregationStatus.isProcessing = true;
  try {
    const ai = getAI();
    const result = await aggregateNews(ai);
    lastAggregationStatus = {
      lastRun: new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }),
      success: result.success,
      addedCount: result.addedCount,
      log: result.log,
      isProcessing: false
    };
    console.log(`Auto-aggregation finished. Success: ${result.success}. Added ${result.addedCount} news.`);
  } catch (err: any) {
    lastAggregationStatus.isProcessing = false;
    console.error("Auto-aggregation scheduler run failed:", err);
  }
}

// Vite middleware integration or production static files serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Seed news table on boot if it is empty
  try {
    const localNews = readLocalNews();
    if (localNews && localNews.length > 0) {
      console.log(`Checking and seeding news database with ${localNews.length} articles...`);
      await seedNewsDatabase(localNews);
    }
  } catch (err) {
    console.error("Failed to seed news database on boot:", err);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`নারী অধিকার কণ্ঠ Server is running on http://0.0.0.0:${PORT}`);
    
    // Lazy-trigger news aggregation 5 seconds after boot
    setTimeout(runAutoAggregation, 5000);
    
    // Set daily schedule interval (24 hours)
    setInterval(runAutoAggregation, 24 * 60 * 60 * 1000);
  });
}

setupServer();
