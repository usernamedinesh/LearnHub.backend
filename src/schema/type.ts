import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "./users";

export enum userRole {
    User = "user",
    Instructor = "instructor",
    Student = "student",
}
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type SafeUser = Omit<NewUser, 'password'>;
