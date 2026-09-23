import { cn } from "@/shared/lib/cn";

export const publicationRichTextClassName = cn(
  "font-light leading-[1.75] text-[#363636]",
  "[&>:first-child]:mt-0",
  "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-[-0.5px] [&_h2]:text-[#0a0a0a]",
  "[&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0a0a0a]",
  "[&_h4]:mt-5 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#0a0a0a]",
  "[&_p]:mt-4",
  "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6",
  "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_a]:font-medium [&_a]:text-[var(--brand)] [&_a]:underline-offset-2 hover:[&_a]:underline",
  "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--brand)] [&_blockquote]:pl-5 [&_blockquote]:text-[var(--muted)]",
  "[&_strong]:font-semibold [&_em]:italic",
);
