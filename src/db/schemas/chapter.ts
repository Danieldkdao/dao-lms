import { relations } from "drizzle-orm";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { CourseTable } from "./course";
import { LessonTable } from "./lesson";

export const ChapterTable = pgTable("chapters", {
  id,
  name: varchar("name").notNull(),
  position: integer("position").notNull(),
  courseId: uuid("course_id")
    .references(() => CourseTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt,
  updatedAt,
});

export const chapterRelations = relations(ChapterTable, ({ one, many }) => ({
  course: one(CourseTable, {
    fields: [ChapterTable.courseId],
    references: [CourseTable.id],
  }),
  lessons: many(LessonTable),
}));
