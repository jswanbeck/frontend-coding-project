"use client";

import styles from "@/features/chat/ChatPage.module.css";
import { useEffect, useMemo } from "react";
import { useChat, ChatHeader, ChatConversation, ChatComposer, localStorageChatRepository, useChatIndex } from "@/features/chat";
import { useT } from "@/shared/i18n/useT";
import { mockChatService } from "@/services/chat/mockChatService";

export function ChatPage() {
  const repo = localStorageChatRepository;
  const { chats, activeChatId, createChat, touchChat } = useChatIndex(repo);
  const t = useT();

  useEffect(() => {
    if (activeChatId) return;
    createChat();
  }, [activeChatId, createChat]);

  const conversationCreatedAt = useMemo(() => {
    if (!activeChatId) return 0;
    return chats.find((c) => c.id === activeChatId)?.createdAt ?? 0;
  }, [activeChatId, chats]);

  const chat = useChat({
    chatId: activeChatId ?? undefined,
    conversationCreatedAt,
    service: mockChatService,
    onTouchChat: (patch) => {
      if (!activeChatId) return;
      touchChat(activeChatId, patch);
    },
    onLoadMessages: (id) => repo.loadMessages(id),
    onSaveMessages: (id, messages) => repo.saveMessages(id, messages),
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ChatHeader
          title={t("app.title")}
        />

        <ChatConversation
          messages={chat.messages}
          status={chat.status}
          error={chat.error}
          isStreaming={chat.isStreaming}
          onSetAssistantVersion={chat.setAssistantVersion}
        />

        <ChatComposer disabled={chat.isStreaming} onSend={chat.submit} onRetry={chat.retry} />
      </main>
    </div>
  );
}

