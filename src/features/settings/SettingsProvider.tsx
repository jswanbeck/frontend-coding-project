"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { I18nProvider } from "@/shared/i18n/I18nProvider";
import { setChatServiceMode, type ChatMode } from "@/services/chat";
import type { Locale } from "@/shared/i18n/types";

type SettingsValue = {
  locale: Locale;
  chatMode: ChatMode;
  setLocale: (l: Locale) => void;
  setChatMode: (m: ChatMode) => void;
};

const SettingsContext = createContext<SettingsValue | null>(null);

function loadStored<T extends string>(key: string, fallback: T, valid: readonly T[]): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  return valid.includes(raw as T) ? (raw as T) : fallback;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    loadStored("settings:locale", "en", ["en", "fr", "debug"] as const),
  );
  const [chatMode, setChatModeState] = useState<ChatMode>(() =>
    loadStored("settings:chatMode", "mock", ["mock"] as const),
  );

  useEffect(() => {
    setChatServiceMode(chatMode);
  }, [chatMode]);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem("settings:locale", l);
  }

  function setChatMode(m: ChatMode) {
    setChatModeState(m);
    setChatServiceMode(m);
    localStorage.setItem("settings:chatMode", m);
  }

  return (
    <SettingsContext.Provider value={{ locale, chatMode, setLocale, setChatMode }}>
      <I18nProvider locale={locale}>{children}</I18nProvider>
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
