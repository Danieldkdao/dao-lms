"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  BracesIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PilcrowIcon,
  QuoteIcon,
  Redo2Icon,
  RotateCcwIcon,
  StrikethroughIcon,
  TextIcon,
  Undo2Icon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type TiptapProps = {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  editorClassName?: string;
};

type Editor = NonNullable<ReturnType<typeof useEditor>>;

type ToolbarToggle = {
  label: string;
  icon: ReactNode;
  isActive: (editor: Editor) => boolean;
  onPressedChange: (editor: Editor) => void;
};

type ToolbarButton = {
  label: string;
  icon: ReactNode;
  disabled?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
};

const toolbarGroups: ToolbarToggle[][] = [
  [
    {
      label: "Bold",
      icon: <BoldIcon />,
      isActive: (editor) => editor.isActive("bold"),
      onPressedChange: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      icon: <ItalicIcon />,
      isActive: (editor) => editor.isActive("italic"),
      onPressedChange: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Strikethrough",
      icon: <StrikethroughIcon />,
      isActive: (editor) => editor.isActive("strike"),
      onPressedChange: (editor) => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "Inline code",
      icon: <CodeIcon />,
      isActive: (editor) => editor.isActive("code"),
      onPressedChange: (editor) => editor.chain().focus().toggleCode().run(),
    },
  ],
  [
    {
      label: "Paragraph",
      icon: <PilcrowIcon />,
      isActive: (editor) => editor.isActive("paragraph"),
      onPressedChange: (editor) => editor.chain().focus().setParagraph().run(),
    },
    {
      label: "Heading 1",
      icon: <Heading1Icon />,
      isActive: (editor) => editor.isActive("heading", { level: 1 }),
      onPressedChange: (editor) =>
        editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "Heading 2",
      icon: <Heading2Icon />,
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
      onPressedChange: (editor) =>
        editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Heading 3",
      icon: <Heading3Icon />,
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
      onPressedChange: (editor) =>
        editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  [
    {
      label: "Bullet list",
      icon: <ListIcon />,
      isActive: (editor) => editor.isActive("bulletList"),
      onPressedChange: (editor) =>
        editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Ordered list",
      icon: <ListOrderedIcon />,
      isActive: (editor) => editor.isActive("orderedList"),
      onPressedChange: (editor) =>
        editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Blockquote",
      icon: <QuoteIcon />,
      isActive: (editor) => editor.isActive("blockquote"),
      onPressedChange: (editor) =>
        editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Code block",
      icon: <BracesIcon />,
      isActive: (editor) => editor.isActive("codeBlock"),
      onPressedChange: (editor) =>
        editor.chain().focus().toggleCodeBlock().run(),
    },
  ],
];

const actionGroups: ToolbarButton[][] = [
  [
    {
      label: "Horizontal rule",
      icon: <MinusIcon />,
      onClick: (editor) => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      label: "Hard break",
      icon: <TextIcon />,
      onClick: (editor) => editor.chain().focus().setHardBreak().run(),
    },
  ],
  [
    {
      label: "Undo",
      icon: <Undo2Icon />,
      disabled: (editor) => !editor.can().undo(),
      onClick: (editor) => editor.chain().focus().undo().run(),
    },
    {
      label: "Redo",
      icon: <Redo2Icon />,
      disabled: (editor) => !editor.can().redo(),
      onClick: (editor) => editor.chain().focus().redo().run(),
    },
    {
      label: "Clear formatting",
      icon: <RotateCcwIcon />,
      onClick: (editor) =>
        editor.chain().focus().unsetAllMarks().clearNodes().run(),
    },
  ],
];

const ToolbarDivider = () => (
  <div className="mx-1 h-8 w-px shrink-0 bg-border" aria-hidden="true" />
);

const EditorToggle = ({
  editor,
  item,
  disabled,
}: {
  editor: Editor;
  item: ToolbarToggle;
  disabled?: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Toggle
        type="button"
        size="sm"
        pressed={item.isActive(editor)}
        disabled={disabled}
        aria-label={item.label}
        onPressedChange={() => item.onPressedChange(editor)}
        className="size-8 min-w-8 text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:text-foreground"
      >
        {item.icon}
      </Toggle>
    </TooltipTrigger>
    <TooltipContent>{item.label}</TooltipContent>
  </Tooltip>
);

const EditorButton = ({
  editor,
  item,
  disabled,
}: {
  editor: Editor;
  item: ToolbarButton;
  disabled?: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled || item.disabled?.(editor)}
        aria-label={item.label}
        onClick={() => item.onClick(editor)}
        className="text-muted-foreground hover:text-foreground"
      >
        {item.icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{item.label}</TooltipContent>
  </Tooltip>
);

export const MDEditor = ({
  value,
  onChange,
  disabled = false,
  className,
  editorClassName,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn("min-h-48 px-4 py-5 text-base leading-7 outline-none"),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor || value === undefined || value === editor.getHTML()) return;

    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  return (
    <TooltipProvider>
      <div className={cn("space-y-2", className)}>
        <div className="overflow-hidden rounded-md border border-input bg-card text-card-foreground shadow-xs transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <div className="flex min-h-14 flex-wrap items-center gap-1 border-b border-border bg-muted/40 px-3 py-2">
            {editor &&
              toolbarGroups.map((group, index) => (
                <div className="flex items-center gap-1" key={index}>
                  {index > 0 && <ToolbarDivider />}
                  {group.map((item) => (
                    <EditorToggle
                      key={item.label}
                      editor={editor}
                      item={item}
                      disabled={disabled}
                    />
                  ))}
                </div>
              ))}

            {editor &&
              actionGroups.map((group, index) => (
                <div className="flex items-center gap-1" key={index}>
                  <ToolbarDivider />
                  {group.map((item) => (
                    <EditorButton
                      key={item.label}
                      editor={editor}
                      item={item}
                      disabled={disabled}
                    />
                  ))}
                </div>
              ))}
          </div>

          <EditorContent
            editor={editor}
            className={cn(
              "bg-input dark:bg-input/30",
              "[&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h1]:leading-tight",
              "[&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:leading-tight",
              "[&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:leading-tight",
              "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6",
              "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6",
              "[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-muted-foreground",
              "[&_.ProseMirror_code]:rounded-sm [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-sm",
              "[&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4",
              "[&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0",
              "[&_.ProseMirror_hr]:my-6 [&_.ProseMirror_hr]:border-border",
              disabled && "opacity-70",
              editorClassName,
            )}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export const MarkdownEditor = (props: TiptapProps) => {
  return (
    <Suspense>
      <MDEditor {...props} />
    </Suspense>
  );
};
