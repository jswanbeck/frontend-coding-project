import type { ChatService } from "@/services/chat/types";
import { parseSseEvents } from "@/services/chat/parseSse";
import type { StreamEvent } from "@/lib/types";

export const openaiSseChatService: ChatService = {
  async *stream(req, opts) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: opts?.signal,
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Request failed (${res.status})`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const parsed = parseSseEvents(buffer);
      buffer = parsed.rest;
      for (const evt of parsed.events) yield evt;
    }

    const doneEvent: StreamEvent = { type: "done" };
    yield doneEvent;
  },
};

