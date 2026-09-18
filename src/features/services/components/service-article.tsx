import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ButtonLink } from "@/shared/ui/button-link";
import { CoverMedia } from "@/shared/ui/cover-media";
import { getPublishedServiceBySlug } from "../queries";

type ServiceArticleProps = {
  locale: string;
  slug: string;
};

export async function ServiceArticle({ locale, slug }: ServiceArticleProps) {
  const service = await getPublishedServiceBySlug(locale, slug);
  if (!service) {
    notFound();
  }

  const t = await getTranslations("services");
  const common = await getTranslations("common");

  return (
    <article className="mx-auto max-w-4xl space-y-8 px-4 py-16 md:px-6">
      <Link
        href="/services"
        className="text-sm font-semibold text-[var(--brand)] hover:underline"
      >
        {t("back")}
      </Link>
      <header className="space-y-4">
        <h1 className="text-4xl tracking-tight md:text-5xl">{service.title}</h1>
        <p className="text-lg leading-relaxed text-[var(--muted)]">
          {service.summary}
        </p>
      </header>
      <CoverMedia
        src={service.imageUrl}
        alt={service.title}
        className="aspect-[16/9]"
      />
      {service.body.trim().length > 0 ? (
        <div className="max-w-3xl space-y-4 leading-relaxed whitespace-pre-line text-[#444748]">
          {service.body}
        </div>
      ) : null}
      <ButtonLink href="/contact">{common("actions.contactUs")}</ButtonLink>
    </article>
  );
}
