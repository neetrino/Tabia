"use client";

import type { ComponentProps, FocusEvent, MouseEvent } from "react";
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

const { Link: IntlLink, useRouter } = createNavigation(routing);

type AppLinkProps = ComponentProps<typeof IntlLink>;
type AppRouter = ReturnType<typeof useRouter>;
type PrefetchOptions = NonNullable<Parameters<AppRouter["prefetch"]>[1]>;

const FULL_PREFETCH = { kind: "full" } as PrefetchOptions;

function prefetchRoute(router: AppRouter, href: AppLinkProps["href"]): void {
  if (typeof href !== "string") {
    return;
  }

  router.prefetch(href, FULL_PREFETCH);
}

/**
 * Locale-aware link that full-prefetches the destination on hover/focus
 * so public navigation does not wait for a fresh server render.
 */
export function Link({
  href,
  prefetch = true,
  onFocus,
  onMouseEnter,
  ...props
}: AppLinkProps) {
  const router = useRouter();

  function prefetchIfEnabled(): void {
    if (prefetch === false) {
      return;
    }

    prefetchRoute(router, href);
  }

  return (
    <IntlLink
      href={href}
      prefetch={prefetch}
      onMouseEnter={(event: MouseEvent<HTMLAnchorElement>) => {
        prefetchIfEnabled();
        onMouseEnter?.(event);
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        prefetchIfEnabled();
        onFocus?.(event);
      }}
      {...props}
    />
  );
}
