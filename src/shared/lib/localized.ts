type LocalizedTriple = {
  hy: string;
  en: string;
  ru: string;
};

const FALLBACK_ORDER: ReadonlyArray<keyof LocalizedTriple> = ["hy", "en", "ru"];

function isLocaleKey(locale: string): locale is keyof LocalizedTriple {
  return FALLBACK_ORDER.some((key) => key === locale);
}

/**
 * Returns the value for `locale`; when it is empty, falls back to the first
 * non-empty value in `hy → en → ru` order.
 */
export function localizedText(
  locale: string,
  values: LocalizedTriple,
): string {
  const requested = isLocaleKey(locale) ? values[locale] : "";
  if (requested.trim()) {
    return requested;
  }

  const fallback = FALLBACK_ORDER.find((key) => values[key].trim());
  return fallback ? values[fallback] : requested;
}

export function formatPublishedDate(
  locale: string,
  date: Date | null,
): string | null {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
