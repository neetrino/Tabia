import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function r2ImageHost(): string | undefined {
  const publicUrl = process.env.R2_PUBLIC_URL?.trim();
  if (!publicUrl) {
    return undefined;
  }

  try {
    const { hostname, protocol } = new URL(publicUrl);
    if (protocol !== "https:" || !hostname) {
      return undefined;
    }
    return hostname;
  } catch {
    return undefined;
  }
}

const r2Hostname = r2ImageHost();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(r2Hostname
        ? [{ protocol: "https" as const, hostname: r2Hostname }]
        : []),
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
};

export default withNextIntl(nextConfig);
