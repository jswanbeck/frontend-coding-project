import type { ChatService } from "@/services/chat/types";
import { t } from "@/shared/i18n/i18n";
import { en } from "@/shared/i18n/en";

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
    yield { type: "status", message: t("mock.statusThinking") };
    await sleep(250, opts?.signal);

    const max = en.mock.cannedResponses.length;
    const idx = max > 0 ? Math.floor(Math.random() * max) : 0;
    const body = t(`mock.cannedResponses.${idx}`);
    for (const ch of body) {
      await sleep(8, opts?.signal);
      yield { type: "text", content: ch };
    }

    yield { type: "done" };
  },
};

