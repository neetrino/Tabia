import { Link } from "@/i18n/navigation";
import { HOME_ASSETS } from "@/shared/config/content";
import { cn } from "@/shared/lib/cn";

type SiteBrandProps = {
  label: string;
  href?: "/" | null;
  className?: string;
};

export function SiteBrand({ label, href = "/", className }: SiteBrandProps) {
  const mark = (
    <img src={HOME_ASSETS.logo} alt={label} width={131} height={38} className="block" />
  );

  if (!href) {
    return <span className={cn("inline-flex items-center", className)}>{mark}</span>;
  }

  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      {mark}
    </Link>
  );
}
