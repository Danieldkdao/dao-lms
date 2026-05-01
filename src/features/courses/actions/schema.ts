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
    .min(20, { error: "Please enter a course description." }),
  thumbnailImage: z
    .file({
      error: "Please upload a thumbnail image for the course.",
    })
    .optional(),
  thumbnailKey: z
    .string()
    .min(1, { error: "Please upload a thumbnail image for the course." }),
  category: z.enum(courseCategories, { error: "Please select a category" }),
  level: z.enum(courseLevels, { error: "Please select a level" }),
  duration: z
    .number({ error: "Please enter a positive integer greater than 0" })
    .int({ error: "Please enter a positive integer greater than 0" })
    .positive({ error: "Please enter a positive integer greater than 0" })
    .min(1, { error: "Please enter a positive integer greater than 0" }),
  price: z
    .number({ error: "Please enter a positive integer greater than 0" })
    .int({ error: "Please enter a positive integer greater than 0" })
    .positive({ error: "Please enter a positive integer greater than 0" })
    .min(1, { error: "Please enter a positive integer greater than 0" }),
  status: z.enum(courseStatuses, { error: "Please select a status" }),
});
export type CourseSchemaType = z.infer<typeof courseSchema>;
