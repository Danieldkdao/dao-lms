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
import { borderRedError, cn, generateSlug } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, SaveIcon } from "lucide-react";
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
import { useConfirm } from "@/hooks/use-confirm";

export const CourseForm = ({
  course,
}: {
  course?: typeof CourseTable.$inferSelect;
}) => {
  const router = useRouter();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Course Publishing",
    "Are you sure you want to publish this course? This course will be available for people to view and purchase.",
  );
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: course ?? {
      title: "",
      slug: "",
      smallDescription: "",
      description: "",
      thumbnailKey: "",
      category: "development",
      level: "beginner",
      duration: undefined,
      price: undefined,
      status: "draft",
    },
  });

  const handleCreateUpdateCourse = async (data: CourseSchemaType) => {
    if (
      (data.status === "published" &&
        course &&
        course.status !== "published") ||
      (!course && data.status === "published")
    ) {
      const confirmation = await confirm();
      if (!confirmation) return;
    }
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

  return (
    <>
      <ConfirmationDialog />
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
          name="thumbnailKey"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Thumbnail Image</FieldLabel>
              <FieldContent>
                <UploadDropzone
                  value={field.value}
                  onChange={field.onChange}
                  keyPrefix="courses/thumbnails"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  uploadMessage="Thumbnail uploaded successfully."
                  deleteMessage="Thumbnail deleted successfully."
                />
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
                    value={value || ""}
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
                    value={value || ""}
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
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
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
    </>
  );
};
