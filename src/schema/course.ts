import {
  pgTable,
  uuid,
  numeric,
  real,
  varchar,
  integer,
  timestamp,
  boolean,
  text,
  unique,
  index
} from 'drizzle-orm/pg-core';
import { instructorProfiles, studentProfile, users } from './users';
import { relations } from 'drizzle-orm';
import { courseLevelEnum } from './enum';
import { categories } from './category';

export const course = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),

  // foregin key to the user who created/instructor the Course
  instructorId: integer('instructor_id')
    .notNull()
    .references(() => instructorProfiles.id, {onDelete: 'cascade'}),

  courseTitle: varchar('course_title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),

  courseThumbnail: varchar('course_thumbnail', { length: 255 }).notNull(),
  promoVideoUrl: varchar('promo_video_url', { length: 255 }),

  status: varchar('status', { length: 20 })
    .$type<'upcoming' | 'ongoing' | 'completed'>()
    .default('upcoming')
    .notNull(),

  isActive: boolean('is_active').default(true).notNull(),
  isNew: boolean('is_new').default(true).notNull(),//TODO: how to make it false
  isPopular: boolean('is_popular').default(false).notNull(),
  isFree: boolean('is_free').default(false),
  pinned: boolean("is_pinned").default(false),
  priority: integer("priority").default(0),

  level: courseLevelEnum('level').default('all'),
  language: varchar('language', { length: 50 }).default('Hindi'),
  duration: varchar('duration', { length: 50 }),

  tags: text('tags').array(), //TODO: updated to array
  price: numeric('price', { precision: 10, scale: 2 }).default('0.00'),
  discount: integer('discount'),

  description: text('description'),
  requirements: text('requirements'),
  whatYouWillLearn: text('what_you_will_learn'),

  publishedAt: timestamp('published_at'),
  enrollmentDeadline: timestamp('enrollment_deadline'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),

  // Foreign key to a category
  categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null', // Course stays, but category is removed
  }),
 },

// This is function where define indexes
// indexed on the category_id column

(table) => ({
    categoryIndex: index('category_idx').on(table.categoryId),
    // Index on the instructorId column
    instructorIndex: index('instructor_idx').on(table.instructorId),

    // Index on the isPublished column
    publishedIndex: index('published_idx').on(table.publishedAt),

    // Index on the level column
    levelIndex: index('level_idx').on(table.level),

 }),
);

export const courseReviews = pgTable(
  'course_reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id').notNull().references(() => course.id),
    studentId: integer('student_id').notNull().references(() => studentProfile.id),

    rating: real('rating').notNull(), // optional: .notNull()
    comment: text('comment'),

     // Optional: for caching review metrics (useful for display/performance)
    averageRating: real('average_rating').default(0).notNull(),
    reviewCount: integer('review_count').default(0).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

  },
  (reviews) => ({
    userCourseUnique: unique().on(reviews.studentId, reviews.courseId),
  })
);

export const courseVideos = pgTable('course_vidoes', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id').notNull().references(() => course.id),
    title: varchar('title', {length: 255}).notNull(),
    description: text('description'),
    videoUrl: text('video_url').notNull(),

    duration: integer('duration'),// in second
    order: integer('order'), // position in course

    createdAt: timestamp('created_at').defaultNow().notNull()
})

export const courseVideoResources = pgTable('course_video_resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  videoId: uuid('video_id').notNull().references(() => courseVideos.id),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 50 }).notNull(), // e.g. 'pdf', 'docx', 'zip'
  fileUrl: text('file_url').notNull(), // link to file on S3, etc.

  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const courseEnrollment = pgTable('course_enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id')
  .notNull()
  .references(() => course.id),
  studentId: integer('student_id').notNull().references(() => studentProfile.id)
})

//RELATION
export const courseRelations = relations(course, ({one}) => ({
    instructor: one(instructorProfiles, {
        fields: [course.instructorId],
        references: [instructorProfiles.id],
    }),
  }),
)

export const instructorProfilesRelations = relations(instructorProfiles, ({ one }) => ({
  user: one(users, {
    fields: [instructorProfiles.userId],
    references: [users.id],
  }),
}));

export const instructorRelationToCourse = relations(instructorProfiles, ({many}) => ({
    courses: many(course)
}));
