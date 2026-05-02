import { TerminalSquareIcon } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-1 rounded-xl bg-primary">
        <TerminalSquareIcon className="size-8 text-primary-foreground dark:text-foreground" />
      </div>
      <span className="text-xl font-semibold dark:text-muted-foreground">
        DaoLMS
      </span>
    </div>
  );
};
