ALTER TABLE "courses" ADD COLUMN "is_pinned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "priority" integer DEFAULT 0;