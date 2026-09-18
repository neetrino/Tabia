import { setRequestLocale } from "next-intl/server";
import { ContactPageContent } from "@/features/contact";

type PageProps = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactPageContent />;
}
