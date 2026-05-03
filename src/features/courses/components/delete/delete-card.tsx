"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteCourse } from "../../actions/actions";
import { toast } from "sonner";
import { CourseTable } from "@/db/schema";
import Image from "next/image";
import { generateFileUrl } from "@/lib/utils";
import { LoadingSwap } from "@/components/ui/loading-swap";

export const DeleteCard = ({
  course,
}: {
  course: typeof CourseTable.$inferSelect;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCourseDeletion = async () => {
    startTransition(async () => {
      const response = await deleteCourse(course.id);
      if (response.error) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        router.push("/admin/courses");
      }
    });
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <h1 className="text-lg font-medium">{course.title}</h1>
        <div className="w-full relative h-50 md:h-75">
          <Image
            src={generateFileUrl(course.thumbnailKey)}
            alt="Thumbnail image"
            fill
            sizes="(max-width: 48rem) calc(100vw - 5rem), 62.5rem"
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-lg font-medium">
            Are you sure want to delete this course?
          </h1>
          <p className="text-base text-muted-foreground font-medium">
            This action cannot be undone.
          </p>
        </div>

        <div className="w-full flex flex-wrap items-center gap-2 justify-between">
          <Button
            variant="outline"
            className="w-full sm:w-fit"
            disabled={isPending}
          >
            <Link href="/admin/courses">Cancel</Link>
          </Button>
          <Button
            variant="destructive"
            className="w-full sm:w-fit"
            disabled={isPending}
            onClick={handleCourseDeletion}
          >
            <LoadingSwap isLoading={isPending}>
              <div className="flex items-center gap-2">
                <Trash2Icon />
                Delete
              </div>
            </LoadingSwap>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
