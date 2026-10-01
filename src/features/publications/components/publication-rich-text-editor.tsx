"use client";

import { RichTextEditor } from "@/shared/ui/rich-text/rich-text-editor";
import { uploadPublicationImageAction } from "../upload";

type PublicationRichTextEditorProps = {
  id: string;
  value: string;
  onChange: (html: string) => void;
  onError: (key: string) => void;
};

export function PublicationRichTextEditor({
  id,
  value,
  onChange,
  onError,
}: PublicationRichTextEditorProps) {
  return (
    <RichTextEditor
      id={id}
      value={value}
      onChange={onChange}
      onError={onError}
      uploadImage={uploadPublicationImage}
    />
  );
}

async function uploadPublicationImage(file: File): Promise<{
  errorKey?: string;
  url?: string;
}> {
  const formData = new FormData();
  formData.set("image", file);
  return uploadPublicationImageAction(formData);
}
