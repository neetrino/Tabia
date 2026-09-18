import { publicationRichTextClassName } from "../rich-text-class";
import { looksLikeHtml, sanitizePublicationHtml } from "../sanitize-html";

type PublicationBodyProps = {
  html: string;
};

export function PublicationBody({ html }: PublicationBodyProps) {
  if (!looksLikeHtml(html)) {
    return (
      <div className="space-y-4 leading-relaxed whitespace-pre-line">{html}</div>
    );
  }

  return (
    <div
      className={publicationRichTextClassName}
      dangerouslySetInnerHTML={{ __html: sanitizePublicationHtml(html) }}
    />
  );
}
