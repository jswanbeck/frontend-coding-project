"use client";

import dynamic from "next/dynamic";

const SettingsPage = dynamic(() => import("@/features/settings").then((m) => m.SettingsPage), {
  ssr: false,
});

export default function SettingsRoute() {
  return <SettingsPage />;
}

