import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CourseTable } from "@/db/schema";
import { generateImageUrl } from "@/lib/utils";
import {
  ArrowRightIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PenIcon,
  SchoolIcon,
  Trash2Icon,
} from "lucide-react";
import Image from "next/image";
import { formatCourseLevel, formatCourseStatus } from "../lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const AdminCourseCard = ({
  course,
}: {
  course: typeof CourseTable.$inferSelect;
}) => {
  return (
    <Card className="p-0 group">
      <CardContent className="p-0">
        <div className="relative h-80">
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            <Badge variant="secondary">
              {formatCourseStatus(course.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  <EllipsisVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/courses/${course.id}/edit`}>
                    <PenIcon />
                    Edit Course
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/courses/${course.id}`}>
                    <EyeIcon />
                    Preview
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" asChild>
                  <Link href={`/admin/courses/${course.id}/delete`}>
                    <Trash2Icon />
                    Delete Course
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Image
            src={generateImageUrl(course.thumbnailKey)}
            alt={`${course.title} image`}
            fill
            sizes="(max-width: 37rem) calc(100vw - 5rem), calc((100vw - 7rem) / 2)"
            className="object-cover"
            loading="eager"
          />
        </div>
        <div className="p-5 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold line-clamp-2 group-hover:text-primary transition-all duration-300 hover:underline">
            {course.title}
          </h1>
          <p className="text-muted-foreground line-clamp-2 text-sm mb-2">
            {course.smallDescription}
          </p>
          <div className="flex items-center gap-4 flex-wrap mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/20 rounded-lg">
                <ClockIcon className="size-5 text-primary" />
              </div>
              <span className="text-muted-foreground">
                {course.duration} hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/20 rounded-lg">
                <SchoolIcon className="size-5 text-primary" />
              </div>
              <span className="text-muted-foreground">
                {formatCourseLevel(course.level)}
              </span>
            </div>
          </div>
          <Button className="w-full" asChild>
            <Link
              href={`/admin/courses/${course.id}/edit`}
              className="flex items-center gap-2"
            >
              Edit Course
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
