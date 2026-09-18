type LocalizedTriple = {
  hy: string;
  en: string;
  ru: string;
};

export function localizedText(
  locale: string,
  values: LocalizedTriple,
): string {
  if (locale === "ru") {
    return values.ru;
  }

  if (locale === "en") {
    return values.en;
  }

  return values.hy;
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
