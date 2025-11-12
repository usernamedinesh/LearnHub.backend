CREATE TABLE "otp" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"otp" varchar(6) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "token_version" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_expire" timestamp;--> statement-breakpoint
ALTER TABLE "otp" ADD CONSTRAINT "otp_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "otp_idx" ON "otp" USING btree ("user_id");