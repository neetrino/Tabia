import Image from "next/image";
import { cn } from "@/shared/lib/cn";

type CoverMediaProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  imageClassName?: string;
  fallback?: React.ReactNode;
  /** Eager-load for LCP only. Defaults to lazy loading. */
  priority?: boolean;
  sizes?: string;
};

export function CoverMedia({
  src,
  alt,
  className,
  imageClassName,
  fallback,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: CoverMediaProps) {
  return (
    <div className={cn("relative overflow-hidden bg-[var(--brand-soft)]", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          unoptimized={src.endsWith(".svg")}
          className={cn(
            "object-cover transition duration-500 group-hover:scale-[1.03]",
            imageClassName,
          )}
          sizes={sizes}
        />
      ) : (
        fallback
      )}
    </div>
  );
}
