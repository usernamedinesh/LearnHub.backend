import { numeric } from 'drizzle-orm/pg-core';
import {
  pgTable,
  serial,
  real,
  varchar,
  integer,
  timestamp,
  boolean,
  text,
  unique,
} from 'drizzle-orm/pg-core';
import { instructorProfiles, studentProfile, users } from './users';

export const course = pgTable(
  'courses',
  {
    id: serial('id').primaryKey(),
    instructorId: integer('instructor_id').notNull().references(() => instructorProfiles.id),
    courseName: varchar('course_name', { length: 255 }).notNull(),
    courseTitle: varchar('course_title', { length: 255 }).notNull(),
    courseThumbnail: varchar('course_thumbnail', { length: 255 }).notNull(),
    isActive: boolean('isActive').default(true).notNull(), // [active, archive]
    tags: text("tags"),
    price: numeric('price', { precision: 10, scale: 2 }),
    discount:integer("discount"),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
);

export const courseReviews = pgTable(
  'course_reviews',
  {
    id: serial('id').primaryKey(),

    courseId: integer('course_id').notNull().references(() => course.id),
    userId: integer('user_id').notNull().references(() => users.id),

    rating: real('rating').notNull(), // optional: .notNull()
    comment: text('comment'),

     // Optional: for caching review metrics (useful for display/performance)
    averageRating: real('average_rating').default(0).notNull(),
    reviewCount: integer('review_count').default(0).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

  },
  (reviews) => ({
    userCourseUnique: unique().on(reviews.userId, reviews.courseId),
  })
);

export const courseVideos = pgTable('course_vidoes', {
    id: serial('id').primaryKey(),

    courseId: integer('course_id').notNull().references(() => course.id),
    title: varchar('title', {length: 255}).notNull(),
    description: text('description'),
    videoUrl: text('video_url').notNull(),

    duration: integer('duration'),// in second
    order: integer('order'), // position in course

    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const courseVideoResources = pgTable('course_video_resources', {
  id: serial('id').primaryKey(),

  videoId: integer('video_id').notNull().references(() => courseVideos.id),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // e.g. 'pdf', 'docx', 'zip'
  fileUrl: text('file_url').notNull(), // link to file on S3, etc.

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const courseEnrollment = pgTable('course_enrollments', {
  id: serial('id').primaryKey(),
  courseId: integer('course_id')
  .notNull()
  .references(() => course.id),
  studentId: integer('student_id').notNull().references(() => studentProfile.id)
})
