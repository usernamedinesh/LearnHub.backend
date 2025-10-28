CREATE TYPE "public"."approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "wishlist" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"course_id" integer NOT NULL,
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "course_reviews" DROP CONSTRAINT "course_reviews_user_id_course_id_unique";--> statement-breakpoint
ALTER TABLE "course_reviews" DROP CONSTRAINT "course_reviews_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "course_reviews" ADD COLUMN "student_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "instructor_profiles" ADD COLUMN "approval_status" "approval_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "instructor_profiles" ADD COLUMN "approved_by" integer;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_student_id_student_profile_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_student_id_student_profile_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_student_id_student_profile_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "instructor_profiles" ADD CONSTRAINT "instructor_profiles_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_reviews" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "instructor_profiles" DROP COLUMN "approved";--> statement-breakpoint
ALTER TABLE "course_reviews" ADD CONSTRAINT "course_reviews_student_id_course_id_unique" UNIQUE("student_id","course_id");--> statement-breakpoint
ALTER TABLE "instructor_profiles" ADD CONSTRAINT "instructor_profiles_channel_name_unique" UNIQUE("channel_name");