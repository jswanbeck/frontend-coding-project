"use client";

import dynamic from "next/dynamic";

const ConversationsPage = dynamic(
  () => import("@/features/conversations").then((m) => m.ConversationsPage),
  { ssr: false },
);

export default function ConversationsRoute() {
  return <ConversationsPage />;
}

