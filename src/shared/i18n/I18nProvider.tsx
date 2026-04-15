"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale, Translations } from "./types";
import { getLocale, getTranslations } from "./i18n";

type I18nValue = {
  locale: Locale;
  tr: Translations;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider(props: { children: React.ReactNode; locale?: Locale }) {
  const locale = props.locale ?? getLocale();
  const value = useMemo<I18nValue>(() => ({ locale, tr: getTranslations(locale) }), [locale]);
  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

