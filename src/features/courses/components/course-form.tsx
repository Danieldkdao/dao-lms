"use client";

import { MarkdownEditor } from "@/components/markdown/tiptap";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/upload-dropzone";
import {
  courseCategories,
  courseLevels,
  courseStatuses,
  CourseTable,
} from "@/db/schemas/course";
import {
  borderRedError,
  cn,
  generateImageUrl,
  generateSlug,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, SaveIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createCourse, updateCourse } from "../actions/actions";
import { courseSchema, CourseSchemaType } from "../actions/schema";
import {
  formatCourseCategory,
  formatCourseLevel,
  formatCourseStatus,
} from "../lib/formatters";
import { useRouter } from "next/navigation";

type PresignedUrlResponse = {
  error: boolean;
  message: string;
  data?: {
    url?: string;
  };
};

const createThumbnailKey = (file: File) => {
  const safeFileName = file.name
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");

  return `courses/thumbnails/${crypto.randomUUID()}-${safeFileName}`;
};

const uploadFileWithProgress = (
  url: string,
  file: File,
  onProgress: (progress: number) => void,
) => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;

      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 204) {
        onProgress(100);
        resolve();
        return;
      }

      reject(new Error(`Upload failed with status ${xhr.status}`));
    };

    xhr.onerror = () => {
      reject(new Error("Upload failed"));
    };

    xhr.open("PUT", url);

    if (file.type) {
      xhr.setRequestHeader("Content-Type", file.type);
    }

    xhr.send(file);
  });
};

export const CourseForm = ({
  course,
}: {
  course?: typeof CourseTable.$inferSelect;
}) => {
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isDeletingThumbnail, setIsDeletingThumbnail] = useState(false);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const router = useRouter();
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ?? {
      title: "",
      slug: "",
      smallDescription: "",
      description: "",
      thumbnailImage: undefined,
      thumbnailKey: "",
      category: undefined,
      level: undefined,
      duration: 0,
      price: 0,
      status: "draft",
    },
  });

  const thumbnailImage = form.watch("thumbnailImage");
  const thumbnailKey = form.watch("thumbnailKey");
  const thumbnailPreviewUrl = useMemo(() => {
    if (thumbnailImage instanceof File) {
      return URL.createObjectURL(thumbnailImage);
    }

    if (thumbnailKey) {
      return generateImageUrl(thumbnailKey);
    }

    return "";
  }, [thumbnailImage, thumbnailKey]);

  useEffect(() => {
    if (!(thumbnailImage instanceof File)) return;

    return () => URL.revokeObjectURL(thumbnailPreviewUrl);
  }, [thumbnailImage, thumbnailPreviewUrl]);

  const handleCreateUpdateCourse = async (data: CourseSchemaType) => {
    const action = course ? updateCourse(course.id, data) : createCourse(data);
    const response = await action;
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
    if (course) {
      form.reset(data);
      router.refresh();
    } else {
      form.reset();
      router.push("/admin/courses");
    }
  };

  const handleUploadImage = async (files: File[]) => {
    const imageToUpload = files[0];
    if (!imageToUpload) return;

    const key = createThumbnailKey(imageToUpload);

    setIsUploadingThumbnail(true);
    setThumbnailUploadProgress(0);

    try {
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const presignedPayload =
        (await presignedResponse.json()) as PresignedUrlResponse;
      const presignedUrl = presignedPayload.data?.url;

      if (!presignedResponse.ok || presignedPayload.error || !presignedUrl) {
        throw new Error(
          presignedPayload.message || "Failed to get upload URL.",
        );
      }

      await uploadFileWithProgress(
        presignedUrl,
        imageToUpload,
        setThumbnailUploadProgress,
      );

      form.setValue("thumbnailImage", imageToUpload, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue("thumbnailKey", key, {
        shouldDirty: true,
        shouldValidate: true,
      });
      toast.success("Thumbnail uploaded successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload thumbnail.";

      form.setValue("thumbnailKey", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setThumbnailUploadProgress(0);
      toast.error(message);
      throw error;
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleDeleteImage = async (key?: string) => {
    const keyToUse = key ?? form.getValues("thumbnailKey");
    if (!keyToUse) return;

    setIsDeletingThumbnail(true);

    try {
      const presignedResponse = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyToUse }),
      });

      const presignedPayload =
        (await presignedResponse.json()) as PresignedUrlResponse;
      const presignedUrl = presignedPayload.data?.url;

      if (!presignedResponse.ok || presignedPayload.error || !presignedUrl) {
        throw new Error(
          presignedPayload.message || "Failed to get delete URL.",
        );
      }

      const deleteResponse = await fetch(presignedUrl, { method: "DELETE" });

      if (!deleteResponse.ok) {
        throw new Error("Failed to delete thumbnail from storage.");
      }

      form.setValue("thumbnailKey", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue("thumbnailImage", undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setThumbnailUploadProgress(0);
      toast.success("Thumbnail deleted successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete thumbnail.";

      toast.error(message);
      throw error;
    } finally {
      setIsDeletingThumbnail(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleCreateUpdateCourse)}
      className="w-full space-y-4"
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Title</FieldLabel>
            <FieldContent>
              <Input
                {...field}
                onChange={(e) => {
                  form.setValue("slug", generateSlug(e.target.value));
                  field.onChange(e);
                }}
                placeholder="Enter course title here..."
                className={borderRedError(fieldState.error)}
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="slug"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Slug</FieldLabel>
            <FieldContent>
              <Input
                value={field.value}
                placeholder="Course slug will be entered here..."
                className={borderRedError(fieldState.error)}
                disabled
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="smallDescription"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Small Description</FieldLabel>
            <FieldContent>
              <Textarea
                {...field}
                placeholder="Enter a small description about the course here..."
                className={cn(
                  borderRedError(fieldState.error),
                  "resize-none min-h-32 max-h-40",
                )}
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
                {...field}
                className={borderRedError(fieldState.error)}
              />
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="thumbnailImage"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Thumbnail Image</FieldLabel>
            <FieldContent>
              <UploadDropzone
                values={
                  thumbnailPreviewUrl
                    ? [
                        {
                          file:
                            field.value instanceof File
                              ? field.value
                              : undefined,
                          url: thumbnailPreviewUrl,
                          key: thumbnailKey || undefined,
                        },
                      ]
                    : []
                }
                onChange={(files) => field.onChange(files?.[0])}
                onFilesSelected={handleUploadImage}
                onFileDelete={handleDeleteImage}
                accept="image/png, image/jpeg, image/jpg, image/webp"
              />
              {(isUploadingThumbnail || isDeletingThumbnail) && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {isUploadingThumbnail
                        ? "Uploading thumbnail..."
                        : "Deleting thumbnail..."}
                    </span>
                    {isUploadingThumbnail && (
                      <span>{thumbnailUploadProgress}%</span>
                    )}
                  </div>
                  {isUploadingThumbnail && (
                    <Progress value={thumbnailUploadProgress} />
                  )}
                </div>
              )}
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="category"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Category</FieldLabel>
              <FieldContent>
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger
                    className={cn(borderRedError(fieldState.error), "w-full")}
                  >
                    <SelectValue placeholder="Select a course category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {courseCategories.map((category) => (
                      <SelectItem value={category} key={category}>
                        {formatCourseCategory(category)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="level"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Level</FieldLabel>
              <FieldContent>
                <Select
                  {...field}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger
                    className={cn("w-full", borderRedError(fieldState.error))}
                  >
                    <SelectValue placeholder="Select a course level..." />
                  </SelectTrigger>
                  <SelectContent>
                    {courseLevels.map((level) => (
                      <SelectItem value={level} key={level}>
                        {formatCourseLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="duration"
          control={form.control}
          render={({ field: { value, onChange, ...props }, fieldState }) => (
            <Field>
              <FieldLabel>Duration (hours)</FieldLabel>
              <FieldContent>
                <Input
                  {...props}
                  placeholder="Enter course duration (hours)..."
                  type="number"
                  className={borderRedError(fieldState.error)}
                  min={0}
                  step={1}
                  value={value ?? ""}
                  onChange={(e) =>
                    Number.isNaN(e.target.value)
                      ? undefined
                      : onChange(e.target.valueAsNumber)
                  }
                />
              </FieldContent>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="price"
          control={form.control}
          render={({ field: { value, onChange, ...props }, fieldState }) => (
            <Field>
              <FieldLabel>Price ($)</FieldLabel>
              <FieldContent>
                <Input
                  {...props}
                  placeholder="Enter course price ($)..."
                  type="number"
                  className={borderRedError(fieldState.error)}
                  min={0}
                  step={1}
                  value={value ?? ""}
                  onChange={(e) =>
                    Number.isNaN(e.target.value)
                      ? undefined
                      : onChange(e.target.valueAsNumber)
                  }
                />
              </FieldContent>
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name="status"
        control={form.control}
        render={({ field, fieldState }) => (
          <Select {...field} onValueChange={(value) => field.onChange(value)}>
            <SelectTrigger
              className={cn("w-full", borderRedError(fieldState.error))}
            >
              <SelectValue placeholder="Select a course status..." />
            </SelectTrigger>
            <SelectContent>
              {courseStatuses.map((status) => (
                <SelectItem value={status} key={status}>
                  {formatCourseStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Button
        className="w-full sm:w-fit"
        disabled={
          form.formState.isSubmitting ||
          isUploadingThumbnail ||
          isDeletingThumbnail ||
          !form.formState.isDirty
        }
      >
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          <div className="flex items-center gap-2">
            {course ? (
              <>
                Update Course
                <SaveIcon />
              </>
            ) : (
              <>
                Create Course
                <PlusIcon />
              </>
            )}
          </div>
        </LoadingSwap>
      </Button>
    </form>
  );
};
