"use client";

import { ChapterTable, LessonTable } from "@/db/schema";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortableOperation } from "@dnd-kit/react/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SortableLesson } from "./sortable-lesson";
import { reorderLessons } from "../actions/action";
import { cn } from "@/lib/utils";

type Lesson = typeof LessonTable.$inferSelect;

const moveItem = <T,>(items: T[], from: number, to: number) => {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(from, 1);

  if (!movedItem) {
    return items;
  }

  nextItems.splice(to, 0, movedItem);

  return nextItems;
};

export const ChapterLessonsDnd = ({
  chapter,
  lessons,
}: {
  chapter: typeof ChapterTable.$inferSelect;
  lessons: Lesson[];
}) => {
  const [orderedLessons, setOrderedLessons] = useState(lessons);
  const [disabled, setDisabled] = useState(false);
  const shouldSaveOrderRef = useRef(false);

  useEffect(() => {
    setOrderedLessons(lessons);
  }, [lessons]);

  const handleReorderLessons = useCallback(
    async (orderedLessons: Lesson[]) => {
      const response = await reorderLessons(chapter.id, orderedLessons);
      if (response.error) {
        toast.error(response.message);
      }
    },
    [chapter.id],
  );

  useEffect(() => {
    if (!shouldSaveOrderRef.current) {
      return;
    }

    shouldSaveOrderRef.current = false;
    void handleReorderLessons(orderedLessons);
  }, [handleReorderLessons, orderedLessons]);

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
    setOrderedLessons((currentLessons) =>
      moveItem(currentLessons, initialIndex, index),
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
        {orderedLessons.map((lesson, index) => (
          <SortableLesson
            key={lesson.id}
            lesson={lesson}
            chapter={chapter}
            setDisabled={setDisabled}
            index={index}
          />
        ))}
      </div>
    </DragDropProvider>
  );
};
