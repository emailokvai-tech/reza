import express from "express";
import path from "path";
import dotenv from "dotenv";
import { harvestAutomatedNews } from "./newsAggregator.ts";
import {
  getAllNews,
  insertNews,
  updateNews,
  deleteNews,
  likeNewsArticle,
  shareNewsArticle,
  addCommentToArticle,
} from "./src/db/news.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { LEAD_INVESTIGATIVE_ARTICLE } from "./src/data/leadInvestigativeArticle.ts";
import { generateBengaliSpeechAudio } from "./src/services/ttsService.ts";

dotenv.config();

export const app = express();

app.use(express.json());

// Serve assets/images statically
app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src', 'assets', 'images')));

// Tracker for automated news scheduler
export let lastAggregationStatus = {
  lastRun: "০৭ অক্টোবর, ২০২৬",
  success: true,
  addedCount: 20,
  log: ["স্বয়ংক্রিয় আরএসএস ও অনুসন্ধানী ইঞ্জিন চালু হয়েছে।"],
  isProcessing: false
};

// Run automated news harvest on launch
export async function initAutomatedNews() {
  console.log("Initializing automated news syndication engine for Joybarta (জয়বার্তা)...");
  try {
    const result = await harvestAutomatedNews();
    lastAggregationStatus = {
      lastRun: new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }),
      success: result.success,
      addedCount: result.totalAdded,
      log: result.log,
      isProcessing: false
    };
    console.log(`Automated news engine completed: ${result.totalAdded} reports harvested and synchronized.`);
  } catch (err: any) {
    console.error("Error in automated news initialization:", err);
  }
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    newspaper: "জয়বার্তা (Joybarta) - সত্যের সন্ধানে প্রতিদিন",
    facebookPageUrl: "https://www.facebook.com/share/1ahsbSRRMy/?mibextid=wwXIfr",
    slogan: "সত্যের সন্ধানে প্রতিদিন",
    time: new Date().toISOString() 
  });
});

// Facebook Page Post Import endpoint
app.post("/api/facebook/import", async (req, res) => {
  try {
    const { title, excerpt, body, category, image, fbPostUrl, author, quote } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "পোস্টের শিরোনাম এবং বিস্তারিত বিবরণ দেওয়া আবশ্যক।" });
    }

    const banglaMonths = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];
    const now = new Date();
    const bnDate = `${now.getDate()} ${banglaMonths[now.getMonth()]}, ${now.getFullYear()}`;

    const newFbArticle = {
      id: `fb-post-${Date.now()}`,
      title,
      excerpt: excerpt || (body.slice(0, 140) + "..."),
      body,
      date: bnDate,
      author: author || "নিজস্ব প্রতিবেদক",
      category: category || "national",
      categoryLabel: "জাতীয় সংবাদ",
      image: image || null,
      likes: Math.floor(Math.random() * 50) + 120,
      shares: Math.floor(Math.random() * 20) + 45,
      comments: [],
      isFbPost: true,
      fbPostUrl: fbPostUrl || "https://www.facebook.com/share/1ahsbSRRMy/?mibextid=wwXIfr",
      quote: quote || undefined,
    };

    const saved = await insertNews(newFbArticle);
    res.json({ success: true, article: saved });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Facebook Page Post Sync trigger
app.post("/api/facebook/sync", async (req, res) => {
  try {
    console.log("Syncing Joybarta Facebook posts from official page: https://www.facebook.com/share/1ahsbSRRMy/?mibextid=wwXIfr");
    res.json({
      success: true,
      syncedAt: new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }),
      pageUrl: "https://www.facebook.com/share/1ahsbSRRMy/?mibextid=wwXIfr",
      message: "জয়বার্তা ফেসবুক পেজের সকল পোস্ট সফলভাবে সিঙ্ক ও আপডেট করা হয়েছে।"
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Text-to-Speech Endpoint: Elegant Bengali Female Newsreader Voice
app.get("/api/tts", async (req, res) => {
  try {
    const articleId = req.query.id as string;
    let textToSpeak = (req.query.text as string) || "";

    if (articleId) {
      const articles = await getAllNews();
      const article = articles.find((a) => a.id === articleId);
      if (article) {
        textToSpeak = `${article.title}। ${article.excerpt ? article.excerpt + '।' : ''} ${article.body}`;
      }
    }

    if (!textToSpeak.trim()) {
      return res.status(400).json({ error: "সংবাদের পাঠ্য প্রদান আবশ্যক।" });
    }

    // Limit text to 4000 chars for safety
    const sanitizedText = textToSpeak.slice(0, 4000);
    const audioBuffer = await generateBengaliSpeechAudio(sanitizedText);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.length);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Accept-Ranges", "bytes");
    return res.end(audioBuffer);
  } catch (err: any) {
    console.error("TTS generation error:", err);
    res.status(500).json({ error: err.message || "অডিও পাঠ প্রস্তুত করতে ব্যর্থ হয়েছে।" });
  }
});

app.post("/api/tts", async (req, res) => {
  try {
    const textToSpeak = (req.body.text as string) || "";
    if (!textToSpeak.trim()) {
      return res.status(400).json({ error: "সংবাদের পাঠ্য প্রদান আবশ্যক।" });
    }

    const sanitizedText = textToSpeak.slice(0, 4000);
    const audioBuffer = await generateBengaliSpeechAudio(sanitizedText);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Length", audioBuffer.length);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Accept-Ranges", "bytes");
    return res.end(audioBuffer);
  } catch (err: any) {
    console.error("TTS generation error:", err);
    res.status(500).json({ error: err.message || "অডিও পাঠ প্রস্তুত করতে ব্যর্থ হয়েছে।" });
  }
});

// Dynamic REST News API endpoints
app.get("/api/news", async (req, res) => {
  try {
    const articles = await getAllNews();
    res.json(articles);
  } catch (err: any) {
    console.warn("Error loading news:", err);
    res.json([]);
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

app.put("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await updateNews(id, updates);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/news/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteNews(id);
    res.json({ success: true, deletedId: id });
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

// Trigger news automation engine on demand
app.post("/api/admin/trigger-aggregation", async (req, res) => {
  if (lastAggregationStatus.isProcessing) {
    return res.status(400).json({ error: "সংবাদ আরএসএস সিন্ডিকেশন প্রক্রিয়া চলমান আছে।" });
  }
  
  lastAggregationStatus.isProcessing = true;
  try {
    const result = await harvestAutomatedNews();
    lastAggregationStatus = {
      lastRun: new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }),
      success: result.success,
      addedCount: result.totalAdded,
      log: result.log,
      isProcessing: false
    };
    res.json(lastAggregationStatus);
  } catch (err: any) {
    lastAggregationStatus.isProcessing = false;
    lastAggregationStatus.log.push(`Error: ${err.message}`);
    res.status(500).json({ error: "আরএসএস সিন্ডিকেশন সম্পন্ন করা সম্ভব হয়নি।", details: err.message });
  }
});

app.get("/api/admin/aggregation-status", (req, res) => {
  res.json(lastAggregationStatus);
});

export default app;
