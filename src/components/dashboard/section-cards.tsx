"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpenIcon,
  ListChecksIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";

export function SectionCards() {
  const sections = [
    {
      label: "Total Signups",
      data: 2400,
      details: "Registered users on the platform",
      icon: <UsersIcon />,
    },
    {
      label: "Total Customers",
      data: 1200,
      details: "Users who have enrolled in courses",
      icon: <ShoppingCartIcon />,
    },
    {
      label: "Total Courses",
      data: 100,
      details: "Available courses on the platform",
      icon: <BookOpenIcon />,
    },
    {
      label: "Total Lessons",
      data: 1000,
      details: "Total learning content available",
      icon: <ListChecksIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {sections.map((section) => (
        <Card className="@container/card" key={section.label}>
          <CardHeader>
            <div className="flex items-center gap-2 justify-between">
              <div>
                <CardDescription className="text-base">
                  {section.label}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {section.data}
                </CardTitle>
              </div>
              {section.icon}
            </div>
          </CardHeader>
          <CardContent className="text-base text-muted-foreground font-medium">
            {section.details}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
