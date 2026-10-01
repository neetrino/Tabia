import { richTextClassName } from "./rich-text-class";
import { looksLikeHtml, sanitizeRichTextHtml } from "./sanitize-html";

type RichTextBodyProps = {
  html: string;
};

export function RichTextBody({ html }: RichTextBodyProps) {
  if (!looksLikeHtml(html)) {
    return (
      <div className="space-y-4 leading-relaxed whitespace-pre-line">{html}</div>
    );
  }

  return (
    <div
      className={richTextClassName}
      dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(html) }}
    />
  );
}
