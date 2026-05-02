import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CourseTable } from "@/db/schema";
import { generateImageUrl } from "@/lib/utils";
import { ArrowRightIcon, ClockIcon, SchoolIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCourseLevel } from "../../lib/formatters";

export const PublicCourseCard = ({
  course,
}: {
  course: typeof CourseTable.$inferSelect;
}) => {
  return (
    <Link href={`/courses/${course.id}`} className="w-full h-full">
      <Card className="p-0 group h-full">
        <CardContent className="p-0">
          <div className="relative h-80">
            <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
              <Badge variant="secondary">
                {formatCourseLevel(course.level)}
              </Badge>
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
            <Button className="w-full">
              Learn More
              <ArrowRightIcon />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
