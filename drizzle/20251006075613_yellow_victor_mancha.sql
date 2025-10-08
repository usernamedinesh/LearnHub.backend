CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_name" varchar(255) NOT NULL,
	"course_title" varchar(255) NOT NULL,
	"course_thumbnail" varchar(255) NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"tags" json,
	"price" numeric(10, 2),
	"discount" integer,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"rating" real NOT NULL,
	"comment" text,
	"average_rating" real DEFAULT 0 NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_reviews_user_id_course_id_unique" UNIQUE("user_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "course_video_resources" (
	"id" serial PRIMARY KEY NOT NULL,
	"video_id" integer NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_type" varchar(50) NOT NULL,
	"file_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_vidoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"video_url" text NOT NULL,
	"duration" integer,
	"order" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_video_resources" ADD CONSTRAINT "course_video_resources_video_id_course_vidoes_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."course_vidoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_vidoes" ADD CONSTRAINT "course_vidoes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;