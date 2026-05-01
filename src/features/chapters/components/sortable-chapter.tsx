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
import { NewLessonDialog } from "@/features/lessons/components/new-lesson-dialog";
import { useState } from "react";
import { ChapterLessonsDnd } from "@/features/lessons/components/chapter-lessons-dnd";
import { Setter } from "@/lib/types";
import { deleteChapter } from "../actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";

export const SortableChapter = ({
  chapter,
  setDisabled,
  index,
}: {
  chapter: typeof ChapterTable.$inferSelect & {
    lessons: (typeof LessonTable.$inferSelect)[];
  };
  setDisabled: Setter<boolean>;
  index: number;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Chapter Deletion",
    "Are you sure that you want to delete this chapter?",
  );
  const { handleRef, isDragSource, ref } = useSortable({
    id: chapter.id,
    index,
  });

  const handleChapterDeletion = async () => {
    const confirmation = await confirm();
    if (!confirmation) return;
    setDisabled(true);

    const response = await deleteChapter(chapter.id);
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
      <NewLessonDialog
        open={open}
        setOpen={setOpen}
        courseId={chapter.courseId}
        chapterId={chapter.id}
        position={chapter.lessons.length + 1}
      />
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

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleChapterDeletion}
          >
            <Trash2Icon />
          </Button>
        </div>
        <CollapsibleContent>
          <div className="p-2 space-y-4">
            {chapter.lessons.length ? (
              <ChapterLessonsDnd
                lessons={chapter.lessons}
                chapterId={chapter.id}
              />
            ) : (
              <div className="border-2 border-dashed rounded-md p-5 flex flex-col items-center gap-2 justify-center w-full">
                <BookOpenTextIcon />
                <h1 className="text-center text-lg font-medium ">
                  No Lessons Yet
                </h1>
                <p className="text-center text-muted-foreground">
                  Create your first lesson to get started!
                </p>
              </div>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpen(true)}
            >
              <PlusIcon />
              New Lesson
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
