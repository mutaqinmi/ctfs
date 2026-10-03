CREATE TABLE "challenge_solves" (
	"challenge_solve_id" serial PRIMARY KEY NOT NULL,
	"challenge_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"solved_at" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "points" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "challenge_solves" ADD CONSTRAINT "challenge_solves_challenge_id_challenges_challenge_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("challenge_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "challenge_solves" ADD CONSTRAINT "challenge_solves_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "challenge_media" DROP COLUMN "media_type";--> statement-breakpoint
DROP TYPE "public"."media_type";