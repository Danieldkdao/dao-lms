import { getGlobalTag, getIdTag, getUserTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export const getEnrollmentGlobalTag = () => {
  return getGlobalTag("enrollments");
};

export const getEnrollmentIdTag = (enrollmentId: string) => {
  return getIdTag("enrollments", enrollmentId);
};

export const getUserEnrollmentTag = (userId: string) => {
  return getUserTag("enrollments", userId);
};

export const revalidateEnrollmentCache = (
  enrollmentId: string,
  userId: string,
) => {
  revalidateTag(getEnrollmentGlobalTag(), { expire: 0 });
  revalidateTag(getEnrollmentIdTag(enrollmentId), { expire: 0 });
  revalidateTag(getUserEnrollmentTag(userId), { expire: 0 });
};
