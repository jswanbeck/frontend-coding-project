"use client";

import { useMemo, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { uid } from "@/shared/utils/id";
import { t } from "@/shared/i18n/i18n";

function getInitialMessages(conversationCreatedAt: number): ChatMessage[] {
  const welcome = t("chat.assistantWelcome");
  return [
    {
      id: uid(),
      role: "assistant",
      content: welcome,
      createdAt: conversationCreatedAt,
      assistantVersions: { items: [welcome], activeIndex: 0 },
    },
  ];
}

export function useChatMessages(conversationCreatedAt: number) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getInitialMessages(conversationCreatedAt),
  );

  function resetToInitial() {
    setMessages(getInitialMessages(conversationCreatedAt));
  }

  function appendUserMessage(content: string): ChatMessage[] {
    const msg: ChatMessage = { id: uid(), role: "user", content, createdAt: Date.now() };
    const next = [...messages, msg];
    setMessages(next);
    return next;
  }

  function appendAssistantPlaceholder(): string {
    const id = uid();
    setMessages((prev) => [
      ...prev,
      { id, role: "assistant", content: "", createdAt: Date.now(), assistantVersions: { items: [""], activeIndex: 0 } },
    ]);
    return id;
  }

  function appendTextChunk(assistantId: string, chunk: string) {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== assistantId || m.role !== "assistant") return m;
        const nextContent = m.content + chunk;
        const av = m.assistantVersions;
        if (!av) return { ...m, content: nextContent };
        const items = [...av.items];
        items[av.activeIndex] = nextContent;
        return { ...m, content: nextContent, assistantVersions: { ...av, items } };
      }),
    );
  }

  function setAssistantVersion(messageId: string, nextIndex: number) {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId || m.role !== "assistant" || !m.assistantVersions) return m;
        const clamped = Math.max(0, Math.min(nextIndex, m.assistantVersions.items.length - 1));
        const nextContent = m.assistantVersions.items[clamped] ?? m.content;
        return { ...m, content: nextContent, assistantVersions: { ...m.assistantVersions, activeIndex: clamped } };
      }),
    );
  }

  function prepareRetry(assistantId: string) {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== assistantId || m.role !== "assistant") return m;
        const existingItems = m.assistantVersions?.items?.length ? m.assistantVersions.items : [m.content];
        const items = [...existingItems, ""];
        return { ...m, content: "", createdAt: Date.now(), assistantVersions: { items, activeIndex: items.length - 1 } };
      }),
    );
  }

  const lastUserMessage = useMemo(() => {
    const reversed = [...messages].reverse();
    return reversed.find((m) => m.role === "user")?.content ?? "";
  }, [messages]);

  return {
    messages,
    setMessages,
    lastUserMessage,
    resetToInitial,
    appendUserMessage,
    appendAssistantPlaceholder,
    appendTextChunk,
    setAssistantVersion,
    prepareRetry,
  };
}
