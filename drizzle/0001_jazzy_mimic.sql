CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"challenge_id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text NOT NULL,
	"category_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"difficulty" "difficulty" DEFAULT 'easy' NOT NULL,
	"solved" integer,
	"challenge_slug" varchar
);
--> statement-breakpoint
DROP TABLE "task" CASCADE;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;