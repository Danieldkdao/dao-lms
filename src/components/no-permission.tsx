import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlertIcon } from "lucide-react";
import Link from "next/link";

export const NoPermission = () => {
  return (
    <div className="p-10">
      <Card className="mx-auto max-w-xl">
        <CardHeader className="items-center text-center">
          <div className="bg-destructive/10 text-destructive flex size-12 items-center justify-center rounded-full">
            <ShieldAlertIcon className="size-6" />
          </div>
          <CardTitle>Access restricted</CardTitle>
          <CardDescription>
            Your account does not have permission to access this content.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/admin/courses">Back to courses</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
