"use server";

import { requireAdminPermission } from "@/lib/auth/permissions";
import { courseSchema, CourseSchemaType } from "./schema";
import {
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import { insertCourse, updateCourse as updateCourseDb } from "../db/courses";
import { db } from "@/db/db";
import { ChapterTable, CourseTable, LessonTable } from "@/db/schema";
import { cacheTag } from "next/cache";
import { getCourseGlobalTag, getCourseIdTag } from "../db/cache/courses";
import { asc, desc, eq } from "drizzle-orm";

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
  const { thumbnailImage, ...dataToInsert } = data;

  await insertCourse(dataToInsert);

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
  const { thumbnailImage, ...dataToUpdate } = data;

  await updateCourseDb(courseId, dataToUpdate);

  return {
    error: false,
    message: "Course updated successfully!",
  };
};

export const getCourses = async () => {
  "use cache";
  cacheTag(getCourseGlobalTag());

  const courses = await db
    .select()
    .from(CourseTable)
    .orderBy(desc(CourseTable.updatedAt), desc(CourseTable.id));

  return courses;
};

export const getCourse = async (courseId: string) => {
  "use cache";
  cacheTag(getCourseIdTag(courseId));

  const course = await db.query.CourseTable.findFirst({
    where: eq(CourseTable.id, courseId),
    with: {
      chapters: {
        with: {
          lessons: {
            orderBy: asc(LessonTable.position),
          },
        },
        orderBy: asc(ChapterTable.position),
      },
    },
  });

  return course ?? null;
};
