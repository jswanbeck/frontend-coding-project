"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";
import type { ChatService } from "@/services/chat/types";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { useChatStream } from "@/features/chat/hooks/useChatStream";

export type UseChatOptions = {
  chatId?: string;
  conversationCreatedAt?: number;
  service: ChatService;
  onTouchChat?: (patch: { title?: string }) => void;
  onLoadMessages: (chatId: string) => ChatMessage[] | null;
  onSaveMessages: (chatId: string, messages: ChatMessage[]) => void;
};

export function useChat(opts: UseChatOptions) {
  const { chatId, service, onTouchChat, onLoadMessages, onSaveMessages } = opts;
  const conversationCreatedAt = opts.conversationCreatedAt ?? 0;

  const onTouchChatRef = useRef(onTouchChat);
  const onLoadMessagesRef = useRef(onLoadMessages);
  const onSaveMessagesRef = useRef(onSaveMessages);
  const hydratedChatIdRef = useRef<string | undefined>(undefined);
  const pendingHydrationRef = useRef<string | undefined>(undefined);
  const lastTitleRef = useRef<string | null>(null);

  const msg = useChatMessages(conversationCreatedAt);
  const stream = useChatStream(service, {
    onAppendAssistantPlaceholder: msg.appendAssistantPlaceholder,
    onTextChunk: msg.appendTextChunk,
  });

  const msgRef = useRef(msg);
  const streamRef = useRef(stream);

  useEffect(() => {
    onTouchChatRef.current = onTouchChat;
    onLoadMessagesRef.current = onLoadMessages;
    onSaveMessagesRef.current = onSaveMessages;
    msgRef.current = msg;
    streamRef.current = stream;
  }, [onTouchChat, onLoadMessages, onSaveMessages, msg, stream]);

  // Selected conversation in chat history (chatId) has changed, cancel current stream and reload messages
  useEffect(() => {
    if (!chatId) return;
    
    streamRef.current.cancel();
    hydratedChatIdRef.current = undefined;
    lastTitleRef.current = null;
    const stored = onLoadMessagesRef.current(chatId);
    if (stored === null) {
      msgRef.current.resetToInitial();
      pendingHydrationRef.current = undefined;
      return;
    }

    if (stored.length > 0) {
      msgRef.current.setMessages(stored);
    } else {
      msgRef.current.resetToInitial();
    }
    pendingHydrationRef.current = chatId;
  }, [chatId]);

  // Don't run side effects while msg.messages still contains the previous chat's messages
  // (Shouldn't update the conversation label until we're sure the new chat's messages are loaded)
  useEffect(() => {
    if (pendingHydrationRef.current) {
      hydratedChatIdRef.current = pendingHydrationRef.current;
      pendingHydrationRef.current = undefined;
    }
  }, [msg.messages]);

  // When messages change, persist them to chat history
  useEffect(() => {
    if (!chatId || hydratedChatIdRef.current !== chatId) return;

    const hasUserContent = msg.messages.some((m) => m.role === "user" && m.content.trim());
    if (!hasUserContent) return;

    onSaveMessagesRef.current(chatId, msg.messages);
  }, [chatId, msg.messages]);

  // If the user has interacte with the chat, derive a conversation label from their first message
  useEffect(() => {
    if (!chatId || hydratedChatIdRef.current !== chatId || !onTouchChatRef.current) return;
    
    const firstUser = msg.messages.find((m) => m.role === "user" && m.content.trim())?.content?.trim();
    if (!firstUser) return;
    
    const nextTitle = firstUser.slice(0, 40);
    if (lastTitleRef.current === nextTitle) return;
    
    lastTitleRef.current = nextTitle;
    onTouchChatRef.current({ title: nextTitle });
  }, [msg.messages, chatId]);

  async function submit(question: string) {
    const q = question.trim();
    if (!q || stream.isStreaming) return;

    const promptMessages = msg.appendUserMessage(q);
    await stream.run(promptMessages);
  }

  async function retry() {
    if (stream.isStreaming || !msg.lastUserMessage.trim()) return;

    const lastAssistant = [...msg.messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant) return;

    const promptMessages = msg.messages.filter((m) => {
      if (m.role === "assistant" && !m.content.trim()) return false;
      if (m.id === lastAssistant.id) return false;
      return true;
    });

    msg.prepareRetry(lastAssistant.id);
    await stream.run(promptMessages, lastAssistant.id);
  }

  return {
    messages: msg.messages,
    status: stream.status,
    error: stream.error,
    isStreaming: stream.isStreaming,
    submit,
    cancel: stream.cancel,
    retry,
    setAssistantVersion: msg.setAssistantVersion,
  };
}
