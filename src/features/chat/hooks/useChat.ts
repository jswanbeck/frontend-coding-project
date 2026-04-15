"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { uid } from "@/shared/utils/id";
import { getChatService } from "@/services/chat";
import { t } from "@/shared/i18n/i18n";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: "assistant",
      content: t("chat.assistantWelcome"),
      assistantVersions: { items: [t("chat.assistantWelcome")], activeIndex: 0 },
    },
  ]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  function setAssistantVersion(messageId: string, nextIndex: number) {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== messageId) return m;
        if (m.role !== "assistant" || !m.assistantVersions) return m;
        const clamped = Math.max(0, Math.min(nextIndex, m.assistantVersions.items.length - 1));
        const nextContent = m.assistantVersions.items[clamped] ?? m.content;
        return { ...m, content: nextContent, assistantVersions: { ...m.assistantVersions, activeIndex: clamped } };
      }),
    );
  }

  const lastUserMessage = useMemo(() => {
    const reversed = [...messages].reverse();
    return reversed.find((m) => m.role === "user")?.content ?? "";
  }, [messages]);

  async function runChat(nextMessages: ChatMessage[], opts?: { assistantMessageId?: string }) {
    setError(null);
    setStatus(t("chat.statusConnecting"));
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    const assistantId = opts?.assistantMessageId ?? uid();
    if (!opts?.assistantMessageId) {
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", assistantVersions: { items: [""], activeIndex: 0 } },
      ]);
    }

    try {
      const svc = getChatService();
      for await (const evt of svc.stream({ messages: nextMessages }, { signal: controller.signal })) {
        if (evt.type === "status") setStatus(evt.message);
        if (evt.type === "text") {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantId) return m;
              if (m.role !== "assistant") return m;

              const nextContent = m.content + evt.content;
              const av = m.assistantVersions;
              if (!av) return { ...m, content: nextContent };

              const items = [...av.items];
              items[av.activeIndex] = nextContent;
              return { ...m, content: nextContent, assistantVersions: { ...av, items } };
            }),
          );
        }
        if (evt.type === "error") {
          setError(evt.message);
          setStatus(null);
        }
        if (evt.type === "done") setStatus(null);
      }
    } catch (e) {
      if ((e as { name?: string }).name === "AbortError") {
        setStatus(t("chat.statusCancelled"));
      } else {
        setError(e instanceof Error ? e.message : t("chat.errorGeneric"));
        setStatus(null);
      }
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  }

  async function submit(question: string) {
    const q = question.trim();
    if (!q || isStreaming) return;
    const next: ChatMessage[] = [...messages, { id: uid(), role: "user", content: q }];
    setMessages(next);
    await runChat(next);
  }

  function cancel() {
    controllerRef.current?.abort();
  }

  async function retry() {
    if (isStreaming) return;
    const trimmed = lastUserMessage.trim();
    if (!trimmed) return;

    const lastAssistantIdx = [...messages].map((m, idx) => ({ m, idx })).reverse().find(({ m }) => m.role === "assistant")
      ?.idx;
    if (lastAssistantIdx == null) return;

    const assistantMsg = messages[lastAssistantIdx];
    if (!assistantMsg || assistantMsg.role !== "assistant") return;

    const promptMessages = messages.filter((m, idx) => {
      if (m.role === "assistant" && m.content.trim().length === 0) return false;
      if (idx === lastAssistantIdx) return false;
      return true;
    });

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== assistantMsg.id) return m;
        if (m.role !== "assistant") return m;
        const existingItems = m.assistantVersions?.items?.length ? m.assistantVersions.items : [m.content];
        const items = [...existingItems, ""];
        const activeIndex = items.length - 1;
        return { ...m, content: "", assistantVersions: { items, activeIndex } };
      }),
    );

    await runChat(promptMessages, { assistantMessageId: assistantMsg.id });
  }

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { messages, status, error, isStreaming, submit, cancel, retry, setAssistantVersion };
}

