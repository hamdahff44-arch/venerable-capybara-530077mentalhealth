CREATE TABLE "submissions" (
	"id" serial PRIMARY KEY,
	"name" text,
	"participant_type" text NOT NULL,
	"category" text NOT NULL,
	"recipient" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"hearts" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "submissions_status_category_idx" ON "submissions" ("status","category");