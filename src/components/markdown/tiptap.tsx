"use client";

import type { Editor as TiptapEditor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import StarterKit from "@tiptap/starter-kit";
import {
  BoldIcon,
  BracesIcon,
  CodeIcon,
  Columns3Icon,
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
  Rows3Icon,
  StrikethroughIcon,
  TableIcon,
  TextIcon,
  Trash2Icon,
  Undo2Icon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Suspense, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  htmlToMarkdown,
  looksLikeHtml,
  markdownToHtml,
  tiptapJsonToMarkdown,
} from "./markdown-utils";

type TiptapProps = {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  editorClassName?: string;
};

type Editor = TiptapEditor;

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
      label: "Insert table",
      icon: <TableIcon />,
      onClick: (editor) =>
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      label: "Add row",
      icon: <Rows3Icon />,
      disabled: (editor) => !editor.can().addRowAfter(),
      onClick: (editor) => editor.chain().focus().addRowAfter().run(),
    },
    {
      label: "Add column",
      icon: <Columns3Icon />,
      disabled: (editor) => !editor.can().addColumnAfter(),
      onClick: (editor) => editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: "Delete row",
      icon: <Rows3Icon />,
      disabled: (editor) => !editor.can().deleteRow(),
      onClick: (editor) => editor.chain().focus().deleteRow().run(),
    },
    {
      label: "Delete column",
      icon: <Columns3Icon />,
      disabled: (editor) => !editor.can().deleteColumn(),
      onClick: (editor) => editor.chain().focus().deleteColumn().run(),
    },
    {
      label: "Delete table",
      icon: <Trash2Icon />,
      disabled: (editor) => !editor.can().deleteTable(),
      onClick: (editor) => editor.chain().focus().deleteTable().run(),
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
  const markdownValue = useMemo(() => {
    if (!value) return "";

    return looksLikeHtml(value) ? htmlToMarkdown(value) : value;
  }, [value]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: markdownToHtml(markdownValue),
    editable: !disabled,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn("min-h-48 px-4 py-5 text-base leading-7 outline-none"),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(tiptapJsonToMarkdown(editor.getJSON()));
    },
  });

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;

    const currentMarkdown = tiptapJsonToMarkdown(editor.getJSON());
    if (markdownValue === currentMarkdown) return;

    editor.commands.setContent(markdownToHtml(markdownValue), {
      emitUpdate: false,
    });
  }, [editor, markdownValue]);

  return (
    <TooltipProvider>
      <div className={cn("space-y-2", className)}>
        <div className="min-w-0 overflow-hidden rounded-md border border-input bg-card text-card-foreground shadow-xs transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
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
              "min-w-0 max-w-full bg-transparent dark:bg-input/30 max-h-250 overflow-auto",
              "[&_.ProseMirror]:min-w-0 [&_.ProseMirror]:max-w-full",
              "[&_.ProseMirror_p]:text-base [&_.ProseMirror_p]:my-1",
              "[&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:font-semibold [&_.ProseMirror_h1]:leading-tight [&_.ProseMirror_h1]:mb-4",
              "[&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:font-semibold [&_.ProseMirror_h2]:leading-tight [&_.ProseMirror_h2]:mb-2",
              "[&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:leading-tight [&_.ProseMirror_h3]:mb-1",
              "[&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-2",
              "[&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-2",
              "[&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-border [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:text-muted-foreground",
              "[&_.ProseMirror_code]:rounded-sm [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:px-1 [&_.ProseMirror_code]:py-0.5 [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:text-sm",
              "[&_.ProseMirror_pre]:box-border [&_.ProseMirror_pre]:w-full [&_.ProseMirror_pre]:max-w-full [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:whitespace-pre [&_.ProseMirror_pre]:rounded-md [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:p-4",
              "[&_.ProseMirror_pre_code]:block [&_.ProseMirror_pre_code]:w-max [&_.ProseMirror_pre_code]:min-w-full [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0",
              "[&_.ProseMirror_hr]:my-6 [&_.ProseMirror_hr]:border-border",
              "[&_.ProseMirror_.tableWrapper]:my-4 [&_.ProseMirror_.tableWrapper]:overflow-x-auto",
              "[&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:table-fixed",
              "[&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-border [&_.ProseMirror_th]:bg-muted [&_.ProseMirror_th]:px-3 [&_.ProseMirror_th]:py-2 [&_.ProseMirror_th]:text-left [&_.ProseMirror_th]:font-semibold",
              "[&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-border [&_.ProseMirror_td]:px-3 [&_.ProseMirror_td]:py-2 [&_.ProseMirror_td]:align-top",
              "[&_.ProseMirror_td_p]:my-0 [&_.ProseMirror_th_p]:my-0",
              "[&_.ProseMirror_.selectedCell]:bg-primary/10",
              "[&_.ProseMirror_.column-resize-handle]:pointer-events-none [&_.ProseMirror_.column-resize-handle]:absolute [&_.ProseMirror_.column-resize-handle]:bottom-0 [&_.ProseMirror_.column-resize-handle]:right-0 [&_.ProseMirror_.column-resize-handle]:top-0 [&_.ProseMirror_.column-resize-handle]:w-1 [&_.ProseMirror_.column-resize-handle]:bg-primary",
              "[&_.ProseMirror.resize-cursor]:cursor-col-resize",
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
