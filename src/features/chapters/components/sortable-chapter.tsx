"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChapterTable, LessonTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import {
  BookOpenTextIcon,
  ChevronDownIcon,
  GripVerticalIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useSortable } from "@dnd-kit/react/sortable";

export const SortableChapter = ({
  chapter,
  index,
}: {
  chapter: typeof ChapterTable.$inferSelect & {
    lessons: (typeof LessonTable.$inferSelect)[];
  };
  index: number;
}) => {
  const { handleRef, isDragSource, ref } = useSortable({
    id: chapter.id,
    index,
  });

  return (
    <Collapsible
      ref={ref}
      className={cn(
        "rounded-md transition-opacity border p-2 group",
        isDragSource && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between group-data-[state=open]:border-b-2 p-2">
        <div className="flex items-center gap-2">
          <button
            ref={handleRef}
            type="button"
            className="cursor-grab touch-none active:cursor-grabbing"
            aria-label="Drag chapter"
          >
            <GripVerticalIcon className="text-muted-foreground size-4" />
          </button>

          <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer group">
            <ChevronDownIcon className="text-muted-foreground size-4 group-data-[state=open]:rotate-180 transition-transform duration-300" />
            <span className="text-base">{chapter.name}</span>
          </CollapsibleTrigger>
        </div>

        <Button type="button" variant="ghost" size="icon">
          <Trash2Icon />
        </Button>
      </div>
      <CollapsibleContent>
        <div className="p-2 space-y-4">
          <div className="border-2 border-dashed rounded-md p-5 flex flex-col items-center gap-2 justify-center w-full">
            <BookOpenTextIcon />
            <h1 className="text-center text-lg font-medium ">No Lessons Yet</h1>
            <p className="text-center text-muted-foreground">
              Create your first lesson to get started!
            </p>
          </div>
          <Button variant="outline" className="w-full">
            <PlusIcon />
            New Lesson
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
