import {
  decimal,
  integer,
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  text,
  index,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number', { length: 20 }).unique(),
    password: varchar('password', { length: 255 }).notNull(), // hashed password
    role: varchar('role', { length: 50 }).default('user').notNull(), // default role is 'user'
    isActive: boolean('isActive').default(true).notNull(),
    profilePicture: varchar('profile_picture', { length: 255 }),
    isVerified: boolean('is_verified').default(false),
    emailVerified: boolean('email_verified').default(false),
    // dateOfBirth: timestamp('date_of_birth'),
    state: text('state'),
    bio: text('bio'),
    lastLogin: timestamp('last_login'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    roleIdx: index('role_idx').on(table.role),
  }),
);

//there will be two user schema more
//first one is studentProfile
// and Second one is instructorProfile
export const studentProfile = pgTable(
  'student_profile',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    learningGoals: text('learning_goals'),
    preferences: jsonb('preferences').default({}),
  },
  (table) => ({
    userIdx: unique('student_user_idx').on(table.userId),
  }),
);

// Instructor Profiles
export const instructorProfiles = pgTable(
  'instructor_profiles',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    expertise: varchar('expertise', { length: 255 }).array(),
    socialLinks: jsonb('social_links').default({}),
    averageRating: decimal('average_rating', {
      precision: 3,
      scale: 2,
    }).default('0.00'),
    totalReviews: integer('total_reviews').default(0),
    totalStudents: integer('total_students').default(0),
    paymentDetails: jsonb('payment_details'),
    totalEarned: decimal('total_earned', { precision: 10, scale: 2 }).default(
      '0.00',
    ),
    pendingBalance: decimal('pending_balance', {
      precision: 10,
      scale: 2,
    }).default('0.00'),
    approved: boolean('approved').default(false),
    approvedAt: timestamp('approved_at'),
  },
  (table) => ({
    userIdx: unique('instructor_user_idx').on(table.userId),
  }),
);
