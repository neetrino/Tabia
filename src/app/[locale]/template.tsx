import type { ReactNode } from "react";
import { PageEnter } from "@/shared/motion/reveal";

type LocaleTemplateProps = {
  children: ReactNode;
};

export default function LocaleTemplate({ children }: LocaleTemplateProps) {
  return <PageEnter>{children}</PageEnter>;
}
