"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import type { ChatService } from "@/services/chat/types";
import { t } from "@/shared/i18n/i18n";

type StreamCallbacks = {
  onAppendAssistantPlaceholder: () => string;
  onTextChunk: (assistantId: string, chunk: string) => void;
};

export function useChatStream(service: ChatService, callbacks: StreamCallbacks) {
  const [status, setStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  async function run(promptMessages: ChatMessage[], assistantMessageId?: string) {
    setToastMessage(null);
    setStatus(t("chat.statusConnecting"));
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    const assistantId = assistantMessageId ?? callbacksRef.current.onAppendAssistantPlaceholder();

    try {
      for await (const evt of service.stream({ messages: promptMessages }, { signal: controller.signal })) {
        if (evt.type === "status") setStatus(evt.message);
        if (evt.type === "text") callbacksRef.current.onTextChunk(assistantId, evt.content);
        if (evt.type === "error") { setToastMessage(evt.message); setStatus(null); }
        if (evt.type === "done") setStatus(null);
      }
    } catch (e) {
      let toastMessage = e instanceof Error ? e.message : t("chat.error.generic");
      if ((e as { name?: string }).name === "AbortError") {
        toastMessage = t("chat.statusCancelled");
      }
      setToastMessage(toastMessage);
      setStatus(null);
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  }

  function cancel() {
    controllerRef.current?.abort();
  }

  return { status, toastMessage, isStreaming, run, cancel };
}
