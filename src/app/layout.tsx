import type { Metadata } from "next";
import { Montserrat, Noto_Sans_Armenian } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic", "cyrillic-ext", "latin-ext"],
  variable: "--font-montserrat",
  display: "swap",
});

const notoSansArmenian = Noto_Sans_Armenian({
  subsets: ["armenian"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-sans-armenian",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TABIA",
    template: "%s · TABIA",
  },
  description: "TABIA — professional legal and advisory services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${notoSansArmenian.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
