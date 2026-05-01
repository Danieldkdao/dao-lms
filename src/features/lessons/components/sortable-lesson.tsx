"use client";

import { Button } from "@/components/ui/button";
import { ChapterTable, LessonTable } from "@/db/schema";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";
import { FileTextIcon, GripVerticalIcon, Trash2Icon } from "lucide-react";
import { deleteLesson } from "../actions/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Setter } from "@/lib/types";
import Link from "next/link";

export const SortableLesson = ({
  chapter,
  lesson,
  setDisabled,
  index,
}: {
  chapter: typeof ChapterTable.$inferSelect;
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
          "rounded-md transition-opacity border p-2 flex items-center",
          isDragSource && "opacity-60",
        )}
      >
        <Link
          href={`/admin/courses/${chapter.courseId}/${chapter.id}/${lesson.id}`}
          className="w-full"
        >
          <div className="flex items-center gap-2 flex-1">
            <button
              ref={handleRef}
              type="button"
              className="cursor-grab touch-none active:cursor-grabbing"
              aria-label="Drag chapter"
            >
              <GripVerticalIcon className="text-muted-foreground size-4" />
            </button>

            <FileTextIcon className="text-muted-foreground size-4" />
            <span className="text-base line-clamp-1">{lesson.name}</span>
          </div>
        </Link>
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
