"use client";

import { I18nProvider } from "@/shared/i18n/I18nProvider";

export function Providers(props: { children: React.ReactNode }) {
  return <I18nProvider>{props.children}</I18nProvider>;
}

