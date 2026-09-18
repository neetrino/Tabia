import { cn } from "@/shared/lib/cn";

export const publicationRichTextClassName = cn(
  "leading-relaxed",
  "[&>:first-child]:mt-0",
  "[&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold",
  "[&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold",
  "[&_h4]:mt-4 [&_h4]:text-lg [&_h4]:font-semibold",
  "[&_p]:mt-3",
  "[&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6",
  "[&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_a]:text-[var(--brand)] [&_a]:underline",
  "[&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--border)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--muted)]",
  "[&_strong]:font-semibold [&_em]:italic",
);
