"use client";

import { useRef, useState, useTransition, type DragEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { CoverMedia } from "@/shared/ui/cover-media";
import { cn } from "@/shared/lib/cn";
import { uploadPublicationImageAction } from "../upload";

const MAX_GALLERY_IMAGES = 12;

type GalleryUpdate = string[] | ((current: string[]) => string[]);

type PublicationGalleryFieldProps = {
  urls: string[];
  onChange: (update: GalleryUpdate) => void;
  onError: (key: string) => void;
};

export function PublicationGalleryField({
  urls,
  onChange,
  onError,
}: PublicationGalleryFieldProps) {
  const form = useTranslations("admin.publicationForm");
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const images = urls ?? [];
  const canAdd = images.length < MAX_GALLERY_IMAGES;

  function addFiles(files: File[]): void {
    const selected = files.slice(0, MAX_GALLERY_IMAGES - images.length);
    if (selected.length === 0) {
      return;
    }

    startTransition(async () => {
      const uploaded = await uploadGalleryFiles(selected, onError);
      if (uploaded.length === 0) {
        return;
      }
      onChange((current) =>
        [...current, ...uploaded].slice(0, MAX_GALLERY_IMAGES),
      );
    });
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">{form("gallery")}</p>
        <p className="text-xs text-[var(--muted)]">{form("galleryHint")}</p>
      </div>
      <GalleryDropZone
        urls={images}
        canAdd={canAdd && !pending}
        addLabel={form("addGalleryImage")}
        removeLabel={form("removeGalleryImage")}
        onAdd={addFiles}
        onRemove={(index) =>
          onChange(images.filter((_, item) => item !== index))
        }
        onPick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={pending || !canAdd}
        className="sr-only"
        onChange={(event) => {
          const files = [...(event.target.files ?? [])];
          event.target.value = "";
          addFiles(files);
        }}
      />
    </div>
  );
}

function GalleryDropZone({
  urls,
  canAdd,
  addLabel,
  removeLabel,
  onAdd,
  onRemove,
  onPick,
}: {
  urls: string[];
  canAdd: boolean;
  addLabel: string;
  removeLabel: string;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  onPick: () => void;
}) {
  const [dragging, setDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setDragging(false);
    if (!canAdd) {
      return;
    }
    onAdd([...(event.dataTransfer.files ?? [])]);
  }

  return (
    <div
      className={cn(
        "rounded-[15px] border border-dashed p-3 transition",
        dragging
          ? "border-[var(--brand)] bg-[var(--brand)]/5"
          : "border-[var(--border)]",
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        if (leftDropZone(event)) {
          setDragging(false);
        }
      }}
      onDrop={handleDrop}
    >
      <div className="flex flex-wrap gap-3">
        {urls.map((url, index) => (
          <GalleryThumb
            key={`${url}-${index}`}
            url={url}
            removeLabel={removeLabel}
            onRemove={() => onRemove(index)}
          />
        ))}
        {canAdd ? (
          <button
            type="button"
            className="flex h-28 min-w-28 flex-1 items-center justify-center gap-2 rounded-[15px] px-4 text-sm text-[var(--muted)] transition hover:text-[var(--brand)]"
            onClick={onPick}
          >
            <ImagePlus className="size-5 shrink-0" aria-hidden />
            {addLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function leftDropZone(event: DragEvent<HTMLDivElement>): boolean {
  const next = event.relatedTarget;
  return !(next instanceof Node && event.currentTarget.contains(next));
}

function GalleryThumb({
  url,
  removeLabel,
  onRemove,
}: {
  url: string;
  removeLabel: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative size-28">
      <CoverMedia
        src={url}
        alt=""
        className="size-28 overflow-hidden rounded-[15px]"
        imageClassName="object-cover"
      />
      <button
        type="button"
        aria-label={removeLabel}
        title={removeLabel}
        className="absolute top-1.5 right-1.5 flex size-7 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
        onClick={onRemove}
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}

async function uploadGalleryFiles(
  files: File[],
  onError: (key: string) => void,
): Promise<string[]> {
  const uploaded: string[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.set("image", file);
    const result = await uploadPublicationImageAction(formData);
    if (result.errorKey || !result.url) {
      onError(result.errorKey ?? "uploadMissing");
      continue;
    }
    uploaded.push(result.url);
  }
  return uploaded;
}
