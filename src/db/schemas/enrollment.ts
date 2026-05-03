import { relations } from "drizzle-orm";
import { pgTable, text, unique, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../helpers";
import { CourseTable } from "./course";
import { user } from "./user";

export const EnrollmentTable = pgTable(
  "enrollments",
  {
    id,
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    courseId: uuid("course_id")
      .references(() => CourseTable.id, { onDelete: "cascade" })
      .notNull(),
    stripeSessionId: text("stripe_session_id").notNull().unique(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt,
  },
  (table) => [unique("user_enrollment").on(table.courseId, table.userId)],
);

export const enrollmentRelations = relations(EnrollmentTable, ({ one }) => ({
  user: one(user, {
    fields: [EnrollmentTable.userId],
    references: [user.id],
  }),
  course: one(CourseTable, {
    fields: [EnrollmentTable.courseId],
    references: [CourseTable.id],
  }),
}));
