import { cn } from "@/lib/utils";
import { markdownToHtml } from "./markdown-utils";

type MarkdownRendererProps = {
  content?: string | null;
  className?: string;
};

export const MarkdownRenderer = ({
  content,
  className,
}: MarkdownRendererProps) => {
  if (!content?.trim()) return null;

  return (
    <div
      className={cn(
        "text-base leading-7 text-foreground",
        "[&_p]:my-4",
        "[&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:leading-tight",
        "[&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight",
        "[&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:my-1",
        "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
        "[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm",
        "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_hr]:my-6 [&_hr]:border-border",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  );
};
