"use server";

import { db } from "@/db/db";
import {
  ChapterTable,
  CourseTable,
  EnrollmentTable,
  LessonProgressTable,
  LessonTable,
} from "@/db/schema";
import {
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import { requireAdminPermission } from "@/lib/auth/permissions";
import { createCourseProduct } from "@/services/stripe/helpers";
import { getDeletePresignedUrl } from "@/services/tigris/presigns";
import { asc, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { getCourseGlobalTag, getCourseIdTag } from "../db/cache/courses";
import {
  deleteCourse as deleteCourseDb,
  insertCourse,
  updateCourse as updateCourseDb,
} from "../db/courses";
import { courseSchema, CourseSchemaType } from "./schema";

const deleteStorageObject = async (key?: string | null) => {
  if (!key) return;
  const presignedUrl = await getDeletePresignedUrl(key);

  if (presignedUrl) {
    await fetch(presignedUrl, { method: "DELETE" });
  }
};

export const createCourse = async (unsafeData: CourseSchemaType) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = courseSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  const response = await createCourseProduct(data);
  if (!response || !response.default_price) {
    return {
      error: true,
      message: "Failed to create new course product.",
    };
  }

  await insertCourse({
    ...data,
    stripePriceId: response.default_price.toString(),
  });

  return {
    error: false,
    message: "Course created successfully!",
  };
};

export const updateCourse = async (
  courseId: string,
  unsafeData: CourseSchemaType,
) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const { data, success } = courseSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: INVALID_DATA_MESSAGE,
    };
  }

  await updateCourseDb(courseId, data);

  return {
    error: false,
    message: "Course updated successfully!",
  };
};

export const deleteCourse = async (courseId: string) => {
  if (!(await requireAdminPermission())) {
    return {
      error: true,
      message: NO_PERMISSION_MESSAGE,
    };
  }

  const [existingCourse] = await db
    .select()
    .from(CourseTable)
    .where(eq(CourseTable.id, courseId));
  if (!existingCourse) {
    return {
      error: true,
      message: "Course not found.",
    };
  }

  const chapters = await db.query.ChapterTable.findMany({
    where: eq(CourseTable.id, existingCourse.id),
    with: {
      lessons: true,
    },
  });

  const lessons = chapters
    .flatMap((chapter) => chapter.lessons)
    .flatMap((lesson) => [
      deleteStorageObject(lesson.thumbnailKey),
      deleteStorageObject(lesson.videoKey),
    ])
    .filter(Boolean);

  try {
    if (lessons.length) {
      await Promise.all(lessons);
    }
    await deleteStorageObject(existingCourse.thumbnailKey);
    await deleteCourseDb(courseId);
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Failed to delete course. Please try again.",
    };
  }

  return {
    error: false,
    message: "Course deleted successfully!",
  };
};

export const getAdminCourses = async () => {
  "use cache";
  cacheTag(getCourseGlobalTag());

  const courses = await db
    .select()
    .from(CourseTable)
    .orderBy(desc(CourseTable.updatedAt), desc(CourseTable.id));

  return courses;
};

export const getPublicCourses = async () => {
  "use cache";
  cacheTag(getCourseGlobalTag());

  const courses = await db
    .select()
    .from(CourseTable)
    .where(eq(CourseTable.status, "published"));

  return courses;
};

export const getAvailableCourses = async (userId: string) => {
  "use cache";
  cacheTag(getCourseGlobalTag());

  const courses = await db
    .select({
      ...getTableColumns(CourseTable),
    })
    .from(CourseTable).where(sql`
      ${CourseTable.status} = 'published'
      AND NOT EXISTS (
        SELECT 1
        FROM ${EnrollmentTable}
        WHERE ${EnrollmentTable.courseId} = ${CourseTable.id}
        AND ${EnrollmentTable.userId} = ${userId}
      )
    `);

  return courses;
};

export const getCourse = async (courseId: string, userId?: string) => {
  "use cache";
  cacheTag(getCourseIdTag(courseId));

  const course = await db.query.CourseTable.findFirst({
    where: eq(CourseTable.id, courseId),
    with: {
      chapters: {
        with: {
          lessons: {
            with: {
              progress: {
                where: userId
                  ? eq(LessonProgressTable.userId, userId)
                  : undefined,
                limit: 1,
              },
            },
            orderBy: [asc(LessonTable.position), asc(LessonTable.id)],
          },
        },
        orderBy: [asc(ChapterTable.position), asc(ChapterTable.id)],
      },
    },
  });

  return course ?? null;
};
