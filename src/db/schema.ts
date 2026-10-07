import { pgTable, text, integer, timestamp, serial } from "drizzle-orm/pg-core";

// Define the 'users' table using Firebase Auth UID as identifier
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth UID
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define the 'news' table to hold newspaper articles
export const news = pgTable("news", {
  id: text("id").primaryKey(), // Using text to handle "news-1", "news-2", "ai-gen-*" etc.
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  date: text("date").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  categoryLabel: text("categoryLabel").notNull(),
  image: text("image"), // Image asset or URL associated with the article
  likes: integer("likes").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  quote: text("quote"),
  comments: text("comments").default("[]").notNull(), // Serialized JSON array of comments
  createdAt: timestamp("created_at").defaultNow(),
});
