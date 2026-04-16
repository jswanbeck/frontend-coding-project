import type { ChatMessage } from "@/lib/types";

export type ChatIndexItem = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

export type ChatIndexState = {
  activeChatId: string | null;
  chats: ChatIndexItem[];
};

export interface ChatRepository {
  loadIndex(): ChatIndexState;
  saveIndex(state: ChatIndexState): void;
  loadMessages(chatId: string): ChatMessage[] | null;
  saveMessages(chatId: string, messages: ChatMessage[]): void;
  deleteMessages(chatId: string): void;
}

const INDEX_KEY = "chat:index:v1";
const MESSAGES_KEY_PREFIX = "chat:messages:v1:";

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export const localStorageChatRepository: ChatRepository = {
  loadIndex() {
    if (typeof window === "undefined") return { activeChatId: null, chats: [] };
    const parsed = safeParse<ChatIndexState>(window.localStorage.getItem(INDEX_KEY));
    if (!parsed || !Array.isArray(parsed.chats)) return { activeChatId: null, chats: [] };
    return {
      activeChatId: typeof parsed.activeChatId === "string" ? parsed.activeChatId : null,
      chats: parsed.chats.filter(
        (c) =>
          c &&
          typeof c.id === "string" &&
          typeof c.title === "string" &&
          typeof c.createdAt === "number" &&
          typeof c.updatedAt === "number",
      ),
    };
  },

  saveIndex(state) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(INDEX_KEY, JSON.stringify(state));
  },

  loadMessages(chatId) {
    if (typeof window === "undefined") return null;

    const raw = window.localStorage.getItem(`${MESSAGES_KEY_PREFIX}${chatId}`);
    if (raw === null) return [];

    const parsed = safeParse<ChatMessage[]>(raw);
    if (!parsed || !Array.isArray(parsed)) return null;
    
    return parsed
      .filter((m) => m && typeof m.id === "string" && typeof m.role === "string" && typeof m.content === "string")
      .map((m) => ({
        ...m,
        createdAt: typeof (m as { createdAt?: unknown }).createdAt === "number" ? m.createdAt : Date.now(),
      }));
  },

  saveMessages(chatId, messages) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(`${MESSAGES_KEY_PREFIX}${chatId}`, JSON.stringify(messages));
  },

  deleteMessages(chatId) {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(`${MESSAGES_KEY_PREFIX}${chatId}`);
  },
};
