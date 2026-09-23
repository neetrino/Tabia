"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/cn";

type PublicationRichTextToolbarProps = {
  editor: Editor | null;
  onInsertImage: () => void;
};

export function PublicationRichTextToolbar({
  editor,
  onInsertImage,
}: PublicationRichTextToolbarProps) {
  const t = useTranslations("admin.publicationForm.editor");

  function setLink(): void {
    if (!editor) {
      return;
    }

    const previous = editor.getAttributes("link").href;
    const current = typeof previous === "string" ? previous : "https://";
    const href = window.prompt(t("linkPrompt"), current);
    if (href === null) {
      return;
    }

    if (href.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-[var(--border)] bg-[var(--surface)] p-2">
      <ToolbarButton
        label={t("heading2")}
        active={editor?.isActive("heading", { level: 2 }) ?? false}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label={t("heading3")}
        active={editor?.isActive("heading", { level: 3 }) ?? false}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label={t("bold")}
        active={editor?.isActive("bold") ?? false}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label={t("italic")}
        active={editor?.isActive("italic") ?? false}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label={t("link")}
        active={editor?.isActive("link") ?? false}
        disabled={!editor}
        onClick={setLink}
      >
        <LinkIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label={t("bulletList")}
        active={editor?.isActive("bulletList") ?? false}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label={t("orderedList")}
        active={editor?.isActive("orderedList") ?? false}
        disabled={!editor}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton
        label={t("image")}
        active={false}
        disabled={!editor}
        onClick={onInsertImage}
      >
        <ImagePlus className="size-4" />
      </ToolbarButton>
    </div>
  );
}

type ToolbarButtonProps = {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(
        "rounded-[15px] p-1.5 text-[var(--muted)] hover:bg-white hover:text-[var(--foreground)]",
        active && "bg-white text-[var(--brand)]",
        disabled && "opacity-50",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
