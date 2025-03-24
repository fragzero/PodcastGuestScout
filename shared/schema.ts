import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define the platform types
export const platformEnum = [
  "tiktok",
  "instagram",
  "youtube",
  "podcast",
  "other",
] as const;

// Define the region types
export const regionEnum = [
  "us",
  "ca",
  "uk",
  "au",
  "other",
] as const;

// Define the topic types
export const topicEnum = [
  "personal-development",
  "relationships",
  "dating",
  "wellness",
  "self-worth",
  "confidence",
  "mindfulness",
  "emotional-intelligence",
  "life-coaching",
  "podcasting",
  "personal-growth",
  "other",
] as const;

// Base user schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Schema for podcast guest candidates
export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  socialHandle: text("social_handle").notNull(),
  platform: text("platform").notNull(),
  additionalPlatforms: text("additional_platforms").array(),
  followerCount: integer("follower_count").notNull(),
  region: text("region").notNull(),
  topics: text("topics").array(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  isRecommended: boolean("is_recommended").default(false),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: text("created_at").notNull(),
});

// Base user schema for insertion
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Schema for inserting podcast guest candidates
export const insertCandidateSchema = createInsertSchema(candidates)
  .omit({ id: true, createdAt: true })
  .extend({
    name: z.string().min(1, "Name is required"),
    socialHandle: z.string().min(1, "Social handle is required"),
    platform: z.enum(platformEnum, {
      errorMap: () => ({ message: "Please select a platform" }),
    }),
    additionalPlatforms: z.array(z.enum(platformEnum)).optional().default([]),
    followerCount: z.coerce
      .number()
      .min(0, "Follower count must be a positive number"),
    region: z.enum(regionEnum, {
      errorMap: () => ({ message: "Please select a region" }),
    }),
    topics: z.array(z.enum(topicEnum))
      .min(1, "At least one topic is required")
      .max(3, "Maximum of 3 topics allowed"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    imageUrl: z.string().optional(),
    isRecommended: z.boolean().optional().default(false),
    isFavorite: z.boolean().optional().default(false),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

// Form schema for filtering candidates
export const filterCandidateSchema = z.object({
  platform: z.enum(["", ...platformEnum]).optional(),
  followerRange: z.enum(["", "0-5k", "5k-10k", "10k-50k", "50k-100k", "100k+"]).optional(),
  region: z.enum(["", ...regionEnum]).optional(),
  topic: z.enum(["", ...topicEnum]).optional(),
  search: z.string().optional(),
  sort: z.enum([
    "followers-desc", 
    "followers-asc", 
    "name-asc", 
    "name-desc", 
    "date-added"
  ]).optional().default("followers-desc"),
});

export type FilterCandidate = z.infer<typeof filterCandidateSchema>;
