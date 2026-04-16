"use client";

import { SettingsProvider } from "@/features/settings";

export function Providers(props: { children: React.ReactNode }) {
  return <SettingsProvider>{props.children}</SettingsProvider>;
}

