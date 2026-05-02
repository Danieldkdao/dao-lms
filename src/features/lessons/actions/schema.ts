import z from "zod";

const nullableAssetKey = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => (value === undefined || value === "" ? null : value));

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
  thumbnailKey: nullableAssetKey,
  videoKey: nullableAssetKey,
});
export type LessonSchemaInputType = z.input<typeof lessonSchema>;
export type LessonSchemaType = z.output<typeof lessonSchema>;
