"use client";

import { Controller, useForm } from "react-hook-form";
import { courseSchema, CourseSchemaType } from "../actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { borderRedError, cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/markdown/tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  courseCategories,
  courseLevels,
  courseStatuses,
} from "@/db/schemas/course";
import {
  formatCourseCategory,
  formatCourseLevel,
  formatCourseStatus,
} from "../lib/formatters";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const CourseForm = () => {
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      slug: "",
      smallDescription: "",
      description: "",
      thumbnailImage: undefined,
      thumbnailKey: undefined,
      category: undefined,
      level: undefined,
      duration: 0,
      price: 0,
      status: "draft",
    },
  });

  const handleCreateCourse = async (data: CourseSchemaType) => {
    return data;
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleCreateCourse)}
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
                {...field}
                placeholder="Course slug will be entered here..."
                className={borderRedError(fieldState.error)}
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
              {/* todo: handle secure file image uploads w/ custom dropzone */}
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
                <Select {...field}>
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
                <Select {...field}>
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
                    !Number.isNaN(e.target.value)
                      ? onChange(e.target.valueAsNumber)
                      : undefined
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
                    !Number.isNaN(e.target.value)
                      ? onChange(e.target.valueAsNumber)
                      : undefined
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
          <Select {...field}>
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
      <Button className="w-full sm:w-fit">
        Create Course
        <PlusIcon />
      </Button>
    </form>
  );
};
