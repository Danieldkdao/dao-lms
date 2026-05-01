import { getIdTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getLessonIdTag = (id: string) => {
  return getIdTag("lessons", id);
};

export const revalidateLessonCache = (lessonId: string) => {
  revalidateTag(getLessonIdTag(lessonId), { expire: 0 });
};
