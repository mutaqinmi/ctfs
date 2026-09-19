CREATE TYPE "public"."media_type" AS ENUM('image', 'source', 'docker');--> statement-breakpoint
CREATE TABLE "challenge_hints" (
	"challenge_hint_id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"hint" text NOT NULL,
	"hint_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenge_media" (
	"challenge_media_id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"media_type" "media_type" NOT NULL,
	"file_name" varchar NOT NULL,
	"object_key" text NOT NULL,
	"mime_type" varchar,
	"file_size" integer,
	CONSTRAINT "challenge_media_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "challenge_slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "challenge_hints" ADD CONSTRAINT "challenge_hints_challenge_id_challenges_challenge_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("challenge_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "challenge_media" ADD CONSTRAINT "challenge_media_challenge_id_challenges_challenge_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("challenge_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_challenge_slug_unique" UNIQUE("challenge_slug");