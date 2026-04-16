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

export function i18nDebugKeysEnabled() {
  const raw = (process.env.NEXT_PUBLIC_I18N_DEBUG_KEYS || "").toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

export function t(key: string, locale: Locale = getLocale()): string {
  if (i18nDebugKeysEnabled()) return key;
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

