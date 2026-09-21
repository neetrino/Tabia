"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { HOME_ASSETS } from "@/shared/config/content";
import { cn } from "@/shared/lib/cn";

type SiteBrandProps = {
  label: string;
  href?: "/" | null;
  className?: string;
  mark?: "inverse" | "ink";
};

const marks = {
  inverse: { src: HOME_ASSETS.logo, width: 131, height: 38 },
  ink: { src: HOME_ASSETS.logoDark, width: 104, height: 30 },
} as const;

export function SiteBrand({
  label,
  href = "/",
  className,
  mark = "inverse",
}: SiteBrandProps) {
  const pathname = usePathname();
  const markAsset = marks[mark];

  const logo = (
    <img
      src={markAsset.src}
      alt={label}
      width={markAsset.width}
      height={markAsset.height}
      className="block"
    />
  );

  if (!href) {
    return <span className={cn("inline-flex items-center", className)}>{logo}</span>;
  }

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center", className)}
      onClick={(event) => {
        if (pathname !== "/") {
          return;
        }

        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      {logo}
    </Link>
  );
}
