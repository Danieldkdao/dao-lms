"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CourseTable } from "@/db/schema";
import {
  BookOpenIcon,
  ChartNoAxesColumn,
  CheckIcon,
  ClockIcon,
  LayoutDashboardIcon,
} from "lucide-react";
import { formatCourseCategory, formatCourseLevel } from "../../lib/formatters";
import { EnrollCourseButton } from "./enroll-course-button";

export const CourseDetailsSide = ({
  course,
  lessons,
}: {
  course: typeof CourseTable.$inferSelect;
  lessons: number;
}) => {
  const features = [
    {
      label: "Course Duration",
      details: `${course.duration} hours`,
      icon: ClockIcon,
    },
    {
      label: "Difficulty Level",
      details: formatCourseLevel(course.level),
      icon: ChartNoAxesColumn,
    },
    {
      label: "Category",
      details: formatCourseCategory(course.category),
      icon: LayoutDashboardIcon,
    },
    {
      label: "Total Lessons",
      details: `${lessons} lessons`,
      icon: BookOpenIcon,
    },
  ];

  const includes = [
    "Full lifetime access",
    "Access on mobile and desktop",
    "Certificate of completion",
  ];

  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="w-full flex items-center gap-2 justify-between">
          <h3 className="text-xl font-medium">Price</h3>
          <h2 className="text-3xl font-bold text-primary">
            ${course.price.toFixed(2)}
          </h2>
        </div>
        <div className="bg-accent rounded-lg p-5 flex flex-col gap-4">
          <h3 className="text-xl font-medium">What you'll get:</h3>
          <div className="flex flex-col gap-2">
            {features.map((feature) => (
              <div className="flex items-center gap-2" key={feature.label}>
                <div className="size-10 rounded-full shrink-0 flex items-center justify-center bg-primary/20">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-medium">{feature.label}</span>
                  <span className="text-lg text-muted-foreground">
                    {feature.details}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-medium">This course includes:</h3>
          <div className="flex flex-col gap-1">
            {includes.map((include) => (
              <div className="flex items-center gap-2" key={include}>
                <div className="bg-emerald-600/20 size-6 rounded-full flex items-center justify-center">
                  <CheckIcon className="text-emerald-600 size-3" />
                </div>
                <span className="text-lg">{include}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <EnrollCourseButton courseId={course.id} />
          <div className="w-full flex items-center justify-center">
            <span className="text-base text-muted-foreground text-center">
              30-day money-back guarantee
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
