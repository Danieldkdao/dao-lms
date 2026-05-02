"use client";

import { Controller, useForm } from "react-hook-form";
import { lessonSchema, LessonSchemaType } from "../../actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LessonTable } from "@/db/schema";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { borderRedError } from "@/lib/utils";
import { MarkdownEditor } from "@/components/markdown/tiptap";
import { UploadDropzone } from "@/components/upload-dropzone";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { SaveIcon } from "lucide-react";
import { updateLesson } from "../../actions/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const LessonConfigForm = ({
  lesson,
}: {
  lesson: typeof LessonTable.$inferSelect;
}) => {
  const router = useRouter();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson.name,
      description: lesson.description ?? "",
      thumbnailKey: lesson.thumbnailKey ?? undefined,
      videoKey: lesson.videoKey ?? undefined,
    },
  });

  const handleUpdateLesson = async (data: LessonSchemaType) => {
    const response = await updateLesson(lesson.id, data);
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      form.reset(data);
      router.refresh();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleUpdateLesson)}
      className="flex flex-col gap-4"
    >
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Lesson Name</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                placeholder="Enter the lesson name..."
                className={borderRedError(fieldState.error)}
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Description</FieldLabel>
            <FieldContent>
              <MarkdownEditor
                value={field.value}
                onChange={field.onChange}
                className={borderRedError(fieldState.error)}
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="thumbnailKey"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Thumbnail Image</FieldLabel>
            <FieldContent>
              <UploadDropzone
                value={field.value}
                onChange={field.onChange}
                keyPrefix="courses/lessons/thumbnails"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                uploadMessage="Thumbnail uploaded successfully."
                deleteMessage="Thumbnail deleted successfully."
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="videoKey"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Lesson Video</FieldLabel>
            <FieldContent>
              <UploadDropzone
                value={field.value}
                onChange={field.onChange}
                keyPrefix="courses/lessons/videos"
                accept="video/mp4, video/webm"
                uploadMessage="Video uploaded successfully."
                deleteMessage="Video deleted successfully."
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        className="w-full sm:w-fit"
        disabled={form.formState.isSubmitting || !form.formState.isDirty}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          <div className="flex items-center gap-2">
            Save Lesson
            <SaveIcon />
          </div>
        </LoadingSwap>
      </Button>
    </form>
  );
};
