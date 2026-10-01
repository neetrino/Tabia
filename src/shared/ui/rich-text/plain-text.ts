import { looksLikeHtml } from "./sanitize-html";

/** Keeps existing plain text editable without turning line breaks into one paragraph. */
export function plainTextToEditorHtml(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || looksLikeHtml(trimmed)) {
    return value;
  }

  return trimmed
    .split(/\n{2,}/)
    .map((block) => `<p>${escapePlainText(block).replaceAll("\n", "<br>")}</p>`)
    .join("");
}

function escapePlainText(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
