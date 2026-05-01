"use client";

import { Button } from "@/components/ui/button";
import { LessonTable } from "@/db/schema";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";
import { FileTextIcon, GripVerticalIcon, Trash2Icon } from "lucide-react";
import { deleteLesson } from "../actions/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Setter } from "@/lib/types";

export const SortableLesson = ({
  lesson,
  setDisabled,
  index,
}: {
  lesson: typeof LessonTable.$inferSelect;
  setDisabled: Setter<boolean>;
  index: number;
}) => {
  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Lesson Deletion",
    "Are you sure you want to delete this lesson?",
  );
  const router = useRouter();
  const { handleRef, isDragSource, ref } = useSortable({
    id: lesson.id,
    index,
  });

  const handleLessonDeletion = async () => {
    const confirmation = await confirm();
    if (!confirmation) return;
    setDisabled(true);

    const response = await deleteLesson(lesson.chapterId, lesson.id);
    if (!response.error) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      router.refresh();
    }
    setDisabled(false);
  };

  return (
    <>
      <ConfirmationDialog />
      <div
        ref={ref}
        className={cn(
          "rounded-md transition-opacity border p-2 flex items-center justify-between",
          isDragSource && "opacity-60",
        )}
      >
        <div className="flex items-center gap-2">
          <button
            ref={handleRef}
            type="button"
            className="cursor-grab touch-none active:cursor-grabbing"
            aria-label="Drag chapter"
          >
            <GripVerticalIcon className="text-muted-foreground size-4" />
          </button>

          <FileTextIcon className="text-muted-foreground size-4" />
          <span className="text-base">{lesson.name}</span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleLessonDeletion}
        >
          <Trash2Icon />
        </Button>
      </div>
    </>
  );
};
