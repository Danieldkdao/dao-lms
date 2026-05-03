"use client";

import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { CheckCircleIcon } from "lucide-react";
import { useTransition } from "react";
import { markLessonComplete } from "../../actions/action";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export const MarkCompleteButton = ({
  courseId,
  lessonId,
  isCompleted,
}: {
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
}) => {
  const { triggerConfetti } = useConfetti();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleMarkCompletion = () => {
    if (isCompleted) return;
    startTransition(async () => {
      const response = await markLessonComplete(courseId, lessonId);
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        router.refresh();
        triggerConfetti();
      }
    });
  };

  return (
    <Button
      variant="outline"
      className="w-fit"
      disabled={isPending || isCompleted}
      onClick={handleMarkCompletion}
    >
      <LoadingSwap isLoading={isPending}>
        <div className="flex items-center gap-4">
          <CheckCircleIcon className="text-emerald-600" />
          <span className={cn(isCompleted && "text-emerald-600 font-medium")}>
            {isCompleted ? "Complete" : "Mark as Complete"}
          </span>
        </div>
      </LoadingSwap>
    </Button>
  );
};
