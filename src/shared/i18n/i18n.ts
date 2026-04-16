import { en } from "@/shared/i18n/en";
import { debug } from "@/shared/i18n/debug";
import { fr } from "@/shared/i18n/fr";
import type { Locale, Translations } from "@/shared/i18n/types";

export function getLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const raw = window.localStorage.getItem("settings:locale");
  return raw === "debug" || raw === "fr" || raw === "en" ? raw : "en";
}

export function getTranslations(locale: Locale): Translations {
  switch (locale) {
    case "debug":
      return debug;
    case "fr":
      return fr;
    case "en":
    default:
      return en;
  }
}

export function t(key: string, locale: Locale = getLocale()): string {
  const dict = getTranslations(locale) as unknown as Record<string, unknown>;
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);

  if (typeof value === "string") return value;
  return key;
}

