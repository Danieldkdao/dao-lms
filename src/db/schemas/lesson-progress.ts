import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  primaryKey,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createdAt, updatedAt } from "../helpers";
import { LessonTable } from "./lesson";
import { user } from "./user";

export const LessonProgressTable = pgTable(
  "lesson_progress",
  {
    userId: varchar("user_id")
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    lessonId: uuid("lesson_id")
      .references(() => LessonTable.id, { onDelete: "cascade" })
      .notNull(),
    completed: boolean("completed").notNull().default(false),
    createdAt,
    updatedAt,
  },
  (table) => [primaryKey({ columns: [table.userId, table.lessonId] })],
);

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
