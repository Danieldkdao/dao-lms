import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";

export const BackButton = ({
  href,
  className,
}: {
  href: string;
  className?: string;
}) => {
  return (
    <Link href={href} className={className}>
      <Button variant="outline" size="icon-lg">
        <ArrowLeftIcon className="text-muted-foreground" />
      </Button>
    </Link>
  );
};
