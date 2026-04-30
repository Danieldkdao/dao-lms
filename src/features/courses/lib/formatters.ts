import {
  CourseCategoryType,
  CourseLevelType,
  CourseStatusType,
} from "@/db/schemas/course";

export const formatCourseCategory = (category: CourseCategoryType) => {
  switch (category) {
    case "design":
      return "Design";
    case "business":
      return "Business";
    case "development":
      return "Development";
    case "health-fitness":
      return "Health & Fitness";
    case "it-software":
      return "IT & Software";
    case "marketing":
      return "Marketing";
    case "music":
      return "Music";
    case "office-productivity":
      return "Office Productivity";
    case "personal-development":
      return "Personal Development";
    case "teaching-academics":
      return "Teaching & Academics";
    default:
      throw new Error(`Unknown course category: ${category satisfies never}`);
  }
};

export const formatCourseLevel = (level: CourseLevelType) => {
  switch (level) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    default:
      throw new Error(`Unknown course level: ${level satisfies never}`);
  }
};

export const formatCourseStatus = (status: CourseStatusType) => {
  switch (status) {
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    case "published":
      return "Published";
    default:
      throw new Error(`Unknown course status: ${status satisfies never}`);
  }
};
