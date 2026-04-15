import { mockChatService } from "./mockChatService";
import { openaiSseChatService } from "./openaiSseChatService";
import type { ChatService } from "./types";

type Mode = "mock" | "openai";

function getMode(): Mode {
  const raw = (process.env.NEXT_PUBLIC_CHAT_MODE || "").toLowerCase();
  if (raw === "openai") return "openai";
  return "mock";
}

export function getChatService(): ChatService {
  return getMode() === "openai" ? openaiSseChatService : mockChatService;
}

