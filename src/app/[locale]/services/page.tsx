import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getPublishedServices, type ServicePreview } from "@/features/services";
import { Link } from "@/i18n/navigation";
import { HOME_ASSETS, SERVICE_ILLUSTRATION_FRAME } from "@/shared/config/content";
import { cn } from "@/shared/lib/cn";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  InteriorPageHeader,
  InteriorPageShell,
} from "@/shared/ui/interior-page-header";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const items = await getPublishedServices(locale);

  return (
    <InteriorPageShell>
      <InteriorPageHeader
        titleLead={t("titleLead")}
        titleTail={t("titleTail")}
        subtitle={t("subtitle")}
      />
      {items.length === 0 ? (
        <EmptyState message={t("empty")} className="mt-12 lg:mt-16" />
      ) : (
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:gap-[23px] xl:grid-cols-3">
          {items.map((item) => (
            <ServiceCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </InteriorPageShell>
  );
}

function ServiceCard({ item }: { item: ServicePreview }) {
  const frameClass =
    SERVICE_ILLUSTRATION_FRAME[item.slug] ??
    "left-[153px] top-[42px] size-[302px]";

  return (
    <Link
      href={`/services/${item.slug}`}
      className="group relative block h-[260px] overflow-hidden rounded-xl bg-[linear-gradient(-43deg,#fff_12%,#999_101%)] lg:h-[295px] lg:rounded-[10px] lg:bg-[linear-gradient(-57deg,#fff_6%,#d6d6d6_109%)]"
    >
      {item.imageUrl ? (
        <>
          <div className="pointer-events-none absolute -bottom-4 right-2 size-[178px] [mask-image:linear-gradient(90deg,transparent,black_18%)] lg:hidden">
            <Image
              src={item.imageUrl}
              alt=""
              fill
              className="object-contain object-center transition duration-500 group-hover:scale-[1.03]"
              sizes="178px"
            />
          </div>
          <div className={cn("absolute hidden overflow-hidden lg:block", frameClass)}>
            <Image
              src={item.imageUrl}
              alt=""
              fill
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
              sizes="410px"
            />
          </div>
        </>
      ) : (
        <div className="pointer-events-none absolute -right-6 top-10 size-[349px]">
          <Image
            src={HOME_ASSETS.serviceScales}
            alt=""
            fill
            className="object-cover"
            sizes="349px"
          />
        </div>
      )}

      <div className="relative z-10 flex items-start justify-between gap-4 px-5 pt-5 lg:gap-6 lg:pt-[23px]">
        <h2 className="max-w-[70%] text-sm font-semibold leading-normal text-black lg:max-w-[248px] lg:text-lg">
          {item.title}
        </h2>
        <img
          src={HOME_ASSETS.serviceArrow}
          alt=""
          width={29}
          height={16}
          className="mt-1 block shrink-0 transition duration-300 group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}
