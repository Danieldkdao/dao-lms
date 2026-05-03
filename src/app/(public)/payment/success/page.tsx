import { ConfettiOnRender } from "@/components/confetti-onrender";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Link from "next/link";

const PaymentSuccessPage = () => {
  return (
    <>
      <ConfettiOnRender />
      <div className="max-w-200 mt-50 w-full mx-auto">
        <Card>
          <CardContent className="flex flex-col items-center">
            <div className="size-20 rounded-full bg-emerald-600/20 flex items-center justify-center">
              <CheckIcon className="size-14 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-center mt-4">
              Payment Successful!
            </h1>
            <p className="text-center text-muted-foreground text-base max-w-100 mb-4">
              Your enrollment was successful! Head to your dashboard to see the
              enrolled course and start learning!
            </p>
            <Button asChild>
              <Link href="/dashboard" className="w-full max-w-100">
                Go to Dashboard
                <ArrowRightIcon />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
