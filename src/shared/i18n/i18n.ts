import { en } from "./en";
import type { Locale, Translations } from "./types";

export function getLocale(): Locale {
  return "en";
}

export function getTranslations(locale: Locale): Translations {
  switch (locale) {
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

