type CacheTag = "users" | "courses";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}`;
};

export const getUserTag = (tag: CacheTag, userId: string) => {
  return `user:${userId}:${tag}`;
};

export const getCourseTag = (courseId: string) => {
  return `course:${courseId}`;
};
