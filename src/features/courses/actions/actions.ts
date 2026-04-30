"use server";

import { requireAdminPermission } from "@/lib/auth/permissions";
import { courseSchema, CourseSchemaType } from "./schema";
import {
  INVALID_DATA_MESSAGE,
  NO_PERMISSION_MESSAGE,
} from "@/lib/auth/constants";
import { insertCourse } from "../db/courses";

export const createCourse = async (unsafeData: CourseSchemaType) => {
  const response = await requireAdminPermission();
  if (!response.data || !response.result) {
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
