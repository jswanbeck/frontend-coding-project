"use client";

import { useCallback } from "react";
import { useI18n } from "@/shared/i18n/I18nProvider";

export function useT() {
  const { tr } = useI18n();
  return useCallback(
    (key: string) => {
      const dict = tr as unknown as Record<string, unknown>;
      const value = key.split(".").reduce<unknown>((acc, part) => {
        if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[part];
        }
        return undefined;
      }, dict);
      return typeof value === "string" ? value : key;
    },
    [tr],
  );
}

