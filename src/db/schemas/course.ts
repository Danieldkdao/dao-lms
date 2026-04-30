import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const courseCategories = [
  "development",
  "business",
  "it-software",
  "office-productivity",
  "personal-development",
  "design",
  "marketing",
  "health-fitness",
  "music",
  "teaching-academics",
] as const;
export type CourseCategoryType = (typeof courseCategories)[number];
export const courseCategoryEnum = pgEnum("course_categories", courseCategories);

export const courseLevels = ["beginner", "intermediate", "advanced"] as const;
export type CourseLevelType = (typeof courseLevels)[number];
export const courseLevelEnum = pgEnum("course_levels", courseLevels);

export const courseStatuses = ["draft", "published", "archived"] as const;
export type CourseStatusType = (typeof courseStatuses)[number];
export const courseStatusEnum = pgEnum("course_statuses", courseStatuses);

export const CourseTable = pgTable("courses", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  smallDescription: text("small_description").notNull(),
  description: text("description").notNull(),
  category: courseCategoryEnum("category").notNull(),
  level: courseLevelEnum("level").notNull(),
  duration: integer("duration").notNull(),
  price: integer("price").notNull(),
  status: courseStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
