import { pgTable, serial, integer, timestamp} from "drizzle-orm/pg-core";
import { studentProfile } from "./users";
import { course } from "./course";

//CART
export const CartItems = pgTable(
    "cart_items",{
        id: serial('id').primaryKey(),
        studentId: integer('student_id').notNull().references(() => studentProfile.id,
            {onDelete: "cascade"}),
        courseId: integer("course_id").notNull().references(()=> course.id, {
            onDelete: "cascade"
        }),
        addedAt: timestamp("added_at").defaultNow()
    }
)

//WISHLIST
export const Wishlist = pgTable(
    "wishlist",{
        id: serial('id').primaryKey(),
        studentId: integer('student_id').notNull().references(() => studentProfile.id, {
            onDelete: "cascade"
        }),
        courseId: integer("course_id").notNull().references(() => course.id, {
            onDelete: "cascade"
        }),
        addedAt: timestamp("added_at").defaultNow()
    }
)
