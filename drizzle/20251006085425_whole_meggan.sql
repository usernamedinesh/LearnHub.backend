CREATE TABLE "course_enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"student_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "instructor_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_enrollments" ADD CONSTRAINT "course_enrollments_student_id_student_profile_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_instructor_id_instructor_profiles_id_fk" FOREIGN KEY ("instructor_id") REFERENCES "public"."instructor_profiles"("id") ON DELETE no action ON UPDATE no action;