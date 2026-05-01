"use client";

import { ChapterTable, LessonTable } from "@/db/schema";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortableOperation } from "@dnd-kit/react/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import { SortableChapter } from "./sortable-chapter";
import { reorderChapters } from "../actions/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ChapterWithLessons = typeof ChapterTable.$inferSelect & {
  lessons: (typeof LessonTable.$inferSelect)[];
};

const moveItem = <T,>(items: T[], from: number, to: number) => {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(from, 1);

  if (!movedItem) {
    return items;
  }

  nextItems.splice(to, 0, movedItem);

  return nextItems;
};

export const CourseChaptersDnd = ({
  courseId,
  chapters,
}: {
  courseId: string;
  chapters: ChapterWithLessons[];
}) => {
  const [orderedChapters, setOrderedChapters] = useState(chapters);
  const [disabled, setDisabled] = useState(false);
  const shouldSaveOrderRef = useRef(false);

  useEffect(() => {
    setOrderedChapters(chapters);
  }, [chapters]);

  const handleReorderChapters = useCallback(
    async (orderChapters: ChapterWithLessons[]) => {
      const response = await reorderChapters(courseId, orderChapters);
      if (response.error) {
        toast.error(response.message);
      }
    },
    [courseId],
  );

  useEffect(() => {
    if (!shouldSaveOrderRef.current) {
      return;
    }

    shouldSaveOrderRef.current = false;
    void handleReorderChapters(orderedChapters);
  }, [handleReorderChapters, orderedChapters]);

  const handleDragEnd: DragEndEvent = async (event) => {
    if (event.canceled || disabled) {
      return;
    }

    if (!isSortableOperation(event.operation)) {
      return;
    }

    const { source } = event.operation;

    if (!source) {
      return;
    }

    const { initialIndex, index } = source;

    if (initialIndex === index) {
      return;
    }

    shouldSaveOrderRef.current = true;
    setOrderedChapters((currentChapters) =>
      moveItem(currentChapters, initialIndex, index),
    );
  };

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      <div
        className={cn(
          "flex flex-col gap-2 transition-all duration-300 relative",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        {disabled && (
          <div className="absolute inset-0 z-10 cursor-not-allowed bg-transparent" />
        )}
        <div></div>
        {orderedChapters.map((chapter, index) => (
          <SortableChapter
            key={chapter.id}
            chapter={chapter}
            setDisabled={setDisabled}
            index={index}
          />
        ))}
      </div>
    </DragDropProvider>
  );
};
