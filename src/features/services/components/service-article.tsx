import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Enter, Reveal } from "@/shared/motion/reveal";
import { ButtonLink } from "@/shared/ui/button-link";
import { ArticleBackLink, ArticleTitle } from "@/shared/ui/article-chrome";
import { CoverMedia } from "@/shared/ui/cover-media";
import { InteriorPageShell } from "@/shared/ui/interior-page-header";
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
    <InteriorPageShell>
      <article className="mx-auto max-w-[920px]">
        <Enter>
          <ArticleBackLink href="/services" label={t("back")} />
        </Enter>

        <Enter delay={0.08}>
        <header className="mt-8 space-y-5 lg:mt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[1px] text-[var(--brand)]">
            {common("nav.services")}
          </p>
          <ArticleTitle>{service.title}</ArticleTitle>
          {service.summary ? (
            <p className="max-w-[720px] text-sm font-light uppercase leading-[21px] tracking-[0.35px] text-[#0a0a0a]/70 lg:text-base lg:leading-6">
              {service.summary}
            </p>
          ) : null}
        </header>
        </Enter>

        <Reveal delay={0.05}>
          <CoverMedia
            src={service.imageUrl}
            alt={service.title}
            className="mt-10 aspect-[16/9] rounded-2xl bg-[#e8e8e8] lg:mt-12 lg:rounded-3xl"
            imageClassName="object-cover"
          />
        </Reveal>

        {service.body.trim().length > 0 ? (
          <Reveal delay={0.08}>
            <div className="mt-10 max-w-[720px] space-y-4 whitespace-pre-line text-base font-light leading-[1.75] text-[#363636] lg:mt-12 lg:text-lg lg:leading-[1.8]">
              {service.body}
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.1}>
          <ButtonLink href="/contact" withArrow className="mt-12 h-14 px-8 lg:mt-14">
            {common("actions.contactUs")}
          </ButtonLink>
        </Reveal>
      </article>
    </InteriorPageShell>
  );
}
