"use client";

import { useRef } from "react";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/shared/lib/cn";
import { publicationRichTextClassName } from "../rich-text-class";
import { uploadPublicationImageAction } from "../upload";
import { PublicationRichTextToolbar } from "./publication-rich-text-toolbar";

type PublicationRichTextEditorProps = {
  id: string;
  value: string;
  onChange: (html: string) => void;
  onError: (key: string) => void;
};

const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4] },
    code: false,
    codeBlock: false,
    link: {
      openOnClick: false,
      autolink: true,
    },
  }),
  Image.configure({
    allowBase64: false,
  }),
];

export function PublicationRichTextEditor({
  id,
  value,
  onChange,
  onError,
}: PublicationRichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: editorExtensions,
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        id,
        class: cn(
          "min-h-64 px-3 py-2 outline-none",
          publicationRichTextClassName,
        ),
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-md border border-[var(--border)]">
      <PublicationRichTextToolbar
        editor={editor}
        onInsertImage={() => fileInputRef.current?.click()}
      />
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) {
            return;
          }
          void insertEditorImage(file, editor, onError);
        }}
      />
    </div>
  );
}

async function insertEditorImage(
  file: File,
  editor: Editor | null,
  onError: (key: string) => void,
): Promise<void> {
  const formData = new FormData();
  formData.set("image", file);
  const result = await uploadPublicationImageAction(formData);
  if (result.errorKey || !result.url || !editor) {
    onError(result.errorKey ?? "uploadMissing");
    return;
  }

  editor.chain().focus().setImage({ src: result.url }).run();
}
