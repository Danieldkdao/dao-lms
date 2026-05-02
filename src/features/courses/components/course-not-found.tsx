import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SearchXIcon } from "lucide-react";
import Link from "next/link";

export const CourseNotFound = () => {
  return (
    <div className="p-10">
      <Card className="mx-auto max-w-xl">
        <CardContent>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
              <SearchXIcon className="size-6" />
            </div>
            <h1 className="text-center text-lg font-medium">
              Course not found
            </h1>
            <p className="font-medium text-muted-foreground">
              This course may have been deleted or the link may be incorrect.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/admin/courses">Back to courses</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
