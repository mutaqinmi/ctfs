import { pgTable, serial, integer, text, pgEnum, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
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

export const categories = pgTable("categories", {
	category_id: serial("category_id").primaryKey(),
	category_name: varchar("category_name").notNull(),
})

export * from './auth.schema';
