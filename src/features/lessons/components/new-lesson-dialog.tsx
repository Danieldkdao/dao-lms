import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Setter } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { lessonSchema, LessonSchemaType } from "../actions/schema";
import { toast } from "sonner";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { borderRedError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { createLesson } from "../actions/action";

type NewChapterDialogProps = {
  open: boolean;
  setOpen: Setter<boolean>;
  courseId: string;
  chapterId: string;
  position: number;
};

export const NewLessonDialog = ({
  open,
  setOpen,
  courseId,
  chapterId,
  position,
}: NewChapterDialogProps) => {
  const router = useRouter();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      position,
    },
  });

  const handleCreateLesson = async (data: LessonSchemaType) => {
    const response = await createLesson(courseId, chapterId, data);
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
          <DialogTitle>New Lesson</DialogTitle>
          <DialogDescription>
            What would you like to name your new lesson?
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleCreateLesson)}
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
                    placeholder="Enter lesson name..."
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
