import type { ChatMessage, StreamEvent } from "@/lib/types";

export type ChatRequest = {
  messages: ChatMessage[];
};

export type ChatStream = AsyncGenerator<StreamEvent>;

export type ChatService = {
  stream: (req: ChatRequest, opts?: { signal?: AbortSignal }) => ChatStream;
};

