import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { user } from "./user";
import { CourseTable } from "./course";
import { relations } from "drizzle-orm";

export const EnrollmentTable = pgTable(
  "enrollments",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: text("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    courseId: uuid("course_id")
      .references(() => CourseTable.id, { onDelete: "cascade" })
      .notNull(),
    stripeSessionId: text("stripe_session_id").notNull().unique(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
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
