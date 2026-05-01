import z from "zod";

export const lessonSchema = z.object({
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
export type LessonSchemaType = z.infer<typeof lessonSchema>;
