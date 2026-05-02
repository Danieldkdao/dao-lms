import { integer, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../helpers";
import { ChapterTable } from "./chapter";
import { relations } from "drizzle-orm";

export const LessonTable = pgTable("lessons", {
  id,
  name: varchar("name").notNull(),
  description: text("description"),
  position: integer("position").notNull(),
  thumbnailKey: varchar("thumbnail_key"),
  videoKey: varchar("video_key"),
  chapterId: uuid("chapter_id")
    .references(() => ChapterTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt,
  updatedAt,
});

export const lessonRelations = relations(LessonTable, ({ one }) => ({
  chapter: one(ChapterTable, {
    fields: [LessonTable.chapterId],
    references: [ChapterTable.id],
  }),
}));
