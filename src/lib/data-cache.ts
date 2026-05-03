type CacheTag = "users" | "courses" | "lessons" | "enrollments";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}`;
};

export const getUserTag = (tag: CacheTag, userId: string) => {
  return `user:${userId}:${tag}`;
};

export const getIdTag = (tag: CacheTag, id: string) => {
  return `${tag}:${id}`;
};
