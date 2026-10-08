import express from "express";
import path from "path";
import http from "http";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { harvestAutomatedNews } from "./newsAggregator.ts";
import { app, initAutomatedNews } from "./serverApp.ts";

dotenv.config();

const PORT = 3000;

// Daily automatic scheduled run (every 24 hours)
setInterval(async () => {
  console.log("Running scheduled daily RSS harvest & investigative news sync...");
  try {
    await harvestAutomatedNews();
  } catch (err) {
    console.error("Scheduled harvest error:", err);
  }
}, 24 * 60 * 60 * 1000);

// Start Express and Vite server
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  const httpServer = http.createServer(app);
  
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server: httpServer,
        },
      },
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`ভালচার আইস (Vulture Eyes) সার্ভার পোর্ট ${PORT}-এ সফলভাবে চালু হয়েছে।`);
    // Run automated news harvest right after start
    initAutomatedNews();
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

export default app;
