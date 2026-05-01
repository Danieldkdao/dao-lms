"use client";

import { Button } from "@/components/ui/button";
import { LessonTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";
import { FileTextIcon, GripVerticalIcon, Trash2Icon } from "lucide-react";

export const SortableLesson = ({
  lesson,
  chapterId,
  index,
}: {
  lesson: typeof LessonTable.$inferSelect;
  chapterId: string;
  index: number;
}) => {
  const { handleRef, isDragSource, ref } = useSortable({
    id: lesson.id,
    index,
  });

  return (
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

      <Button type="button" variant="ghost" size="icon">
        <Trash2Icon />
      </Button>
    </div>
  );
};
