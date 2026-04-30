import { getCourseTag, getGlobalTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getCourseGlobalTag = () => {
  return getGlobalTag("courses");
};

export const getCourseIdTag = (courseId: string) => {
  return getCourseTag(courseId);
};

export const revalidateCourseCache = (courseId: string) => {
  revalidateTag(getCourseGlobalTag(), { expire: 0 });
  revalidateTag(getCourseIdTag(courseId), { expire: 0 });
};
