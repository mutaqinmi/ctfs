import { pgTable, serial, integer, text, pgEnum, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"]);
export const challenges = pgTable("challenges", {
	challenge_id: serial("challenge_id").primaryKey(),
	chalenge_title: varchar("title").notNull(),
	challenge_description: text("description").notNull(),
	category_id: integer("category_id").notNull().references(() => categories.category_id, { onDelete: "cascade", onUpdate: "cascade" }),
	author_id: integer("author_id").notNull().references(() => user.id, { onDelete: "cascade", onUpdate: "cascade" }),
	challenge_difficulty: difficultyEnum("difficulty").default("easy").notNull(),
	challenge_solved: integer("solved"),
	challenge_slug: varchar("challenge_slug")
})

export const categories = pgTable("categories", {
	category_id: serial("category_id").primaryKey(),
	category_name: varchar("category_name").notNull(),
})

export * from './auth.schema';
