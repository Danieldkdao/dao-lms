import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { user } from "./user";
import { LessonTable } from "./lesson";
import { relations } from "drizzle-orm";

export const LessonProgressTable = pgTable("lesson_progress", {
  id,
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  lessonId: uuid("lesson_id")
    .references(() => LessonTable.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt,
  updatedAt,
});

export const lessonProgressRelations = relations(
  LessonProgressTable,
  ({ one }) => ({
    user: one(user, {
      fields: [LessonProgressTable.userId],
      references: [user.id],
    }),
    lesson: one(LessonTable, {
      fields: [LessonProgressTable.lessonId],
      references: [LessonTable.id],
    }),
  }),
);
