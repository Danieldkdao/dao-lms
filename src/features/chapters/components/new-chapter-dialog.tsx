"use cliet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Setter } from "@/lib/types";
import { Controller, useForm } from "react-hook-form";
import { chapterSchema, ChapterSchemaType } from "../actions/schema";
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
import { createChapter } from "../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingSwap } from "@/components/ui/loading-swap";

type NewChapterDialogProps = {
  open: boolean;
  setOpen: Setter<boolean>;
  courseId: string;
  position: number;
};

export const NewChapterDialog = ({
  open,
  setOpen,
  courseId,
  position,
}: NewChapterDialogProps) => {
  const router = useRouter();
  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      position,
    },
  });

  const handleCreateChapter = async (data: ChapterSchemaType) => {
    const response = await createChapter(courseId, data);
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
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            What would you like to name your new chapter?
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleCreateChapter)}
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
              Create
            </LoadingSwap>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
