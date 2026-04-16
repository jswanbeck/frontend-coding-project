import { mockChatService } from "@/services/chat/mockChatService";
import type { ChatService } from "@/services/chat/types";

export type ChatMode = "mock";

export function setChatServiceMode(mode: ChatMode) {
  void mode;
}

export function getChatService(): ChatService {
  return mockChatService;
}

