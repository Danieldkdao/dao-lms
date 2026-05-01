import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { ComponentProps, ReactNode } from "react";
import { VariantProps } from "class-variance-authority";

export const BackButton = ({
  href,
  children,
  ...props
}: {
  href: string;
  children?: ReactNode;
} & ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) => {
  return (
    <Link href={href}>
      <Button variant="outline" size="icon-lg" {...props}>
        {children ?? <ArrowLeftIcon className="text-muted-foreground" />}
      </Button>
    </Link>
  );
};
