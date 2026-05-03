import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon, XIcon } from "lucide-react";
import Link from "next/link";

const PaymentCancelPage = () => {
  return (
    <div className="max-w-200 mt-50 w-full mx-auto">
      <Card>
        <CardContent className="flex flex-col items-center">
          <div className="size-20 rounded-full bg-red-600/20 dark:bg-destructive/20 flex items-center justify-center">
            <XIcon className="size-14 text-red-600 dark:text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold text-center mt-4">
            Payment Canceled
          </h1>
          <p className="text-center text-muted-foreground text-base max-w-100 mb-4">
            Looks like you canceled your enrollment or something went wrong.
            Navigate back the courses page to try again.
          </p>
          <Button asChild>
            <Link href="/courses" className="w-full max-w-100">
              Back to Courses
              <ArrowRightIcon />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelPage;
