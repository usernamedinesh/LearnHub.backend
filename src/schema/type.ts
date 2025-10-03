import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { InferModel } from 'drizzle-orm';
import { users } from "./users";

export enum userRole {
    User = "user",
    Instructor = "instructor",
    Student = "student",
}

export type User = InferModel<typeof users>;           // For SELECT (reading from DB)
export type NewUser = InferModel<typeof users, 'insert'>;  // For INSERT (creating new user)
export type SafeUser = Omit<User, 'password'>;
