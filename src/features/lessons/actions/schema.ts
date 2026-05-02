import z from "zod";

export const createLessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter a name for this lesson." }),
  position: z
    .number({ error: "Position must be a postive integer greater than 0." })
    .int({ error: "Position must be a postive integer greater than 0." })
    .positive({ error: "Position must be a postive integer greater than 0." })
    .min(1, { error: "Position must be a postive integer greater than 0." }),
});
export type CreateLessonSchemaType = z.infer<typeof createLessonSchema>;

export const lessonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter a name for this lesson." }),
  description: z
    .string()
    .trim()
    .min(20, { error: "Please enter a description for this lesson." }),
  thumbnailKey: z
    .string()
    .min(1, { error: "Please upload a thumbnail image for the course." }),
  videoKey: z
    .string()
    .min(1, { error: "Please upload a video for the course." }),
});
export type LessonSchemaType = z.infer<typeof lessonSchema>;
