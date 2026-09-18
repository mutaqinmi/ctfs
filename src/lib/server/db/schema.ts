import { pgTable, serial, integer, text, pgEnum, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const mediaTypeEnum = pgEnum("media_type", ["image", "source", "docker"]);
export const challenges = pgTable("challenges", {
	challenge_id: serial("challenge_id").primaryKey(),
	challenge_title: varchar("title").notNull(),
	challenge_description: text("description"),
	challenge_flag: varchar("flag").notNull(),
	challenge_points: integer("points").notNull(),
	category_id: integer("category_id").notNull().references(() => categories.category_id, { onDelete: "cascade", onUpdate: "cascade" }),
	author_id: varchar("author_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	challenge_difficulty: difficultyEnum("difficulty").default("easy").notNull(),
	challenge_slug: varchar("challenge_slug").unique().notNull(),
})

export const challengeHints = pgTable("challenge_hints", {
	challenge_hint_id: serial("challenge_hint_id").primaryKey(),
	challenge_id: integer("challenge_id").notNull().references(() => challenges.challenge_id, { onDelete: "cascade", onUpdate: "cascade" }),
	hint: text("hint").notNull(),
	hint_order: integer("hint_order").notNull(),
})

export const challengeMedia = pgTable("challenge_media", {
	challenge_media_id: serial("challenge_media_id").primaryKey(),
	challenge_id: integer("challenge_id").notNull().references(() => challenges.challenge_id, { onDelete: "cascade", onUpdate: "cascade" }),
	media_type: mediaTypeEnum("media_type").notNull(),
	file_name: varchar("file_name").notNull(),
	object_key: text("object_key").notNull().unique(),
	mime_type: varchar("mime_type"),
	file_size: integer("file_size"),
})

export const categories = pgTable("categories", {
	category_id: serial("category_id").primaryKey(),
	category_name: varchar("category_name").notNull(),
})

export * from './auth.schema';
