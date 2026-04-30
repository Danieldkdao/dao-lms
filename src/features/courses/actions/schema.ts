import {
  courseCategories,
  courseLevels,
  courseStatuses,
} from "@/db/schemas/course";
import z from "zod";

export const courseSchema = z.object({
  title: z.string().trim().min(1, { error: "Please enter a course title." }),
  slug: z.string().trim().min(1, { error: "Please enter a course slug." }),
  smallDescription: z
    .string()
    .trim()
    .min(1, { error: "Please enter a small description for the course." }),
  description: z
    .string()
    .trim()
    .min(1, { error: "Please enter a course description." }),
  thumbnailImage: z
    .string()
    .min(1, { error: "Please upload a thumbnail image for the course." }),
  thumbnailKey: z.string().min(1),
  category: z.enum(courseCategories),
  level: z.enum(courseLevels),
  duration: z.number().int().positive().min(1),
  price: z.number().int().positive().min(1),
  status: z.enum(courseStatuses),
});
export type CourseSchemaType = z.infer<typeof courseSchema>;
