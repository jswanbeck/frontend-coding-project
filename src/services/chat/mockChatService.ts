import type { ChatService } from "./types";
import { getLocale, getTranslations } from "@/shared/i18n/i18n";

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(() => resolve(), ms);
    const onAbort = () => {
      clearTimeout(id);
      reject(Object.assign(new Error("Aborted"), { name: "AbortError" as const }));
    };
    if (signal) {
      if (signal.aborted) return onAbort();
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

export const mockChatService: ChatService = {
  async *stream(req, opts) {
    const tr = getTranslations(getLocale());
    yield { type: "status", message: tr.mock.statusThinking };
    await sleep(250, opts?.signal);

    const body = tr.mock.cannedResponses[Math.floor(Math.random() * tr.mock.cannedResponses.length)];
    for (const ch of body) {
      await sleep(8, opts?.signal);
      yield { type: "text", content: ch };
    }

    yield { type: "done" };
  },
};

