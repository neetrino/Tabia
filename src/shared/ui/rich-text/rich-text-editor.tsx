"use client";

import { useEffect, useRef } from "react";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { cn } from "@/shared/lib/cn";
import { richTextClassName } from "./rich-text-class";
import { RichTextToolbar } from "./rich-text-toolbar";

type ImageUploadResult = {
  errorKey?: string;
  url?: string;
};

type RichTextEditorProps = {
  id: string;
  value: string;
  onChange: (html: string) => void;
  onError: (key: string) => void;
  uploadImage: (file: File) => Promise<ImageUploadResult>;
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

export function RichTextEditor({
  id,
  value,
  onChange,
  onError,
  uploadImage,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const onErrorRef = useRef(onError);
  const uploadImageRef = useRef(uploadImage);

  useEffect(() => {
    onChangeRef.current = onChange;
    onErrorRef.current = onError;
    uploadImageRef.current = uploadImage;
  }, [onChange, onError, uploadImage]);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: editorExtensions,
    content: value || "<p></p>",
    editorProps: {
      attributes: {
        id,
        class: cn("min-h-64 px-3 py-2 outline-none", richTextClassName),
      },
    },
    onUpdate: ({ editor: current }) => {
      onChangeRef.current(current.getHTML());
    },
  });

  return (
    <div className="overflow-hidden rounded-[15px] border border-[var(--border)]">
      <RichTextToolbar
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
          void insertEditorImage(file, editor, uploadImageRef.current, (key) =>
            onErrorRef.current(key),
          );
        }}
      />
    </div>
  );
}

async function insertEditorImage(
  file: File,
  editor: Editor | null,
  uploadImage: (file: File) => Promise<ImageUploadResult>,
  onError: (key: string) => void,
): Promise<void> {
  const result = await uploadImage(file);
  if (result.errorKey || !result.url || !editor) {
    onError(result.errorKey ?? "uploadMissing");
    return;
  }

  editor.chain().focus().setImage({ src: result.url }).run();
}
