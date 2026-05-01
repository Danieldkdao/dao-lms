"use server";

import { requireAdminPermission } from "@/lib/auth/permissions";
import { courseSchema, CourseSchemaType } from "./schema";
import {
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import { insertCourse } from "../db/courses";
import { db } from "@/db/db";
import { CourseTable } from "@/db/schema";
import { cacheTag } from "next/cache";
import { getCourseGlobalTag } from "../db/cache/courses";

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

export const getCourses = async () => {
  "use cache";
  cacheTag(getCourseGlobalTag());

  const courses = await db.select().from(CourseTable);

  return courses;
};
