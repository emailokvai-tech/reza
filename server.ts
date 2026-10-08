import express from "express";
import path from "path";
import dotenv from "dotenv";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { harvestAutomatedNews, NewsItem } from "./newsAggregator.ts";
import {
  getAllNews,
  insertNews,
  likeNewsArticle,
  shareNewsArticle,
  addCommentToArticle,
} from "./src/db/news.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { generateSocialMediaNews, SocialMediaPost } from "./src/data/socialMediaNews.ts";
import { LEAD_INVESTIGATIVE_ARTICLE } from "./src/data/leadInvestigativeArticle.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve assets/images statically
app.use('/src/assets/images', express.static(path.join(process.cwd(), 'src', 'assets', 'images')));

// Tracker for automated news scheduler
let lastAggregationStatus = {
  lastRun: "০৭ অক্টোবর, ২০২৬",
  success: true,
  addedCount: 20,
  log: ["স্বয়ংক্রিয় আরএসএস ও অনুসন্ধানী ইঞ্জিন চালু হয়েছে।"],
  isProcessing: false
};

// Run automated news harvest on launch and setup 24-hour interval
async function initAutomatedNews() {
  console.log("Initializing automated news syndication engine for দি ইনভেস্টিগেশন...");
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

// Daily automatic scheduled run (every 24 hours)
setInterval(async () => {
  console.log("Running scheduled daily RSS harvest & investigative news sync...");
  try {
    await harvestAutomatedNews();
  } catch (err) {
    console.error("Scheduled harvest error:", err);
  }
}, 24 * 60 * 60 * 1000);

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    newspaper: "দি ইনভেস্টিগেশন",
    publisher: "মেহেদী হাসান",
    time: new Date().toISOString() 
  });
});

// Dynamic REST News API endpoints
app.get("/api/news", async (req, res) => {
  try {
    const articles = await getAllNews();
    // Ensure the primary lead investigative article is always at the top
    const leadIndex = articles.findIndex(a => a.id === LEAD_INVESTIGATIVE_ARTICLE.id || a.title.includes("মাহবুবুর রহমান"));
    if (leadIndex > 0) {
      const [lead] = articles.splice(leadIndex, 1);
      articles.unshift(lead);
    } else if (leadIndex === -1) {
      articles.unshift(LEAD_INVESTIGATIVE_ARTICLE);
    }
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

// Social Media News Storage & Endpoints
let socialMediaPosts: SocialMediaPost[] = [];

function getSocialMediaPostsList(): SocialMediaPost[] {
  if (socialMediaPosts.length === 0) {
    socialMediaPosts = generateSocialMediaNews();
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
      portalLogo: portalName[0] || "ই",
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

// Start Express and Vite server
async function startServer() {
  // Mount Vite middleware in development
  const isProduction = process.env.NODE_ENV === "production";
  
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`দি ইনভেস্টিগেশন সার্ভার পোর্ট ${PORT}-এ সফলভাবে চালু হয়েছে।`);
    // Run automated news harvest right after start
    initAutomatedNews();
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
