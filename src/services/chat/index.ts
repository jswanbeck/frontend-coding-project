import { mockChatService } from "@/services/chat/mockChatService";
import { openaiSseChatService } from "@/services/chat/openaiSseChatService";
import type { ChatService } from "@/services/chat/types";

export type ChatMode = "mock" | "openai";

function getEnvMode(): ChatMode {
  const raw = (process.env.NEXT_PUBLIC_CHAT_MODE || "").toLowerCase();
  if (raw === "openai") return "openai";
  return "mock";
}

let runtimeMode: ChatMode | null = null;

export function setChatServiceMode(mode: ChatMode) {
  runtimeMode = mode;
}

export function getChatService(): ChatService {
  const mode = runtimeMode ?? getEnvMode();
  return mode === "openai" ? openaiSseChatService : mockChatService;
}

