"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Setter } from "@/lib/types";
import { Controller, useForm } from "react-hook-form";
import {
  chapterSchema,
  ChapterSchemaType,
} from "../actions/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { borderRedError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createChapter, updateChapter } from "../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { ChapterTable } from "@/db/schema";
import { useEffect } from "react";

type NewUpdateChapterDialogProps = {
  open: boolean;
  setOpen: Setter<boolean>;
  courseId: string;
  position: number;
  chapter?: typeof ChapterTable.$inferSelect;
};

export const NewUpdateChapterDialog = ({
  open,
  setOpen,
  courseId,
  position,
  chapter,
}: NewUpdateChapterDialogProps) => {
  const isUpdating = !!chapter;
  const router = useRouter();

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: chapter?.name ?? "",
      position: chapter?.position ?? position,
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: chapter?.name ?? "",
      position: chapter?.position ?? position,
    });
  }, [chapter, form, open, position]);

  const handleCreateUpdateChapter = async (data: ChapterSchemaType) => {
    const action = isUpdating
      ? updateChapter(chapter.id, { name: data.name })
      : createChapter(courseId, data);
    const response = await action;
    if (response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
      form.reset();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdating ? "Update Chapter" : "Create New Chapter"}
          </DialogTitle>
          <DialogDescription>
            {isUpdating
              ? "Choosing a new name for your chapter?"
              : "What would you like to name your new chapter?"}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleCreateUpdateChapter)}
          className="flex flex-col gap-2"
        >
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Name</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    placeholder="Enter chapter name..."
                    className={borderRedError(fieldState.error)}
                  />
                </FieldContent>
                {fieldState.error && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button className="self-end" disabled={form.formState.isSubmitting}>
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              {isUpdating ? "Save changes" : "Create"}
            </LoadingSwap>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
