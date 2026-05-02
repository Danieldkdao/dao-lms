import z from "zod";

export const chapterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: "Please enter a name for this chapter." }),
  position: z
    .number({ error: "Position must be a postive integer greater than 0." })
    .int({ error: "Position must be a postive integer greater than 0." })
    .positive({ error: "Position must be a postive integer greater than 0." })
    .min(1, { error: "Position must be a postive integer greater than 0." }),
});
export type ChapterSchemaType = z.infer<typeof chapterSchema>;

export const updateChapterSchema = chapterSchema.omit({
  position: true,
});
export type UpdateChapterSchemaType = z.infer<typeof updateChapterSchema>;
