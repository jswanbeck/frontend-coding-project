"use client";

import { useChat, ChatConversation, ChatComposer } from "@/features/chat";
import type { ChatService } from "@/services/chat/types";
import type { ChatRepository } from "@/features/chat/persistence/chatRepository";
import styles from "@/features/chat/components/ChatAssistantPanel.module.css";

export function ChatAssistantPanel(props: {
  chatId: string;
  conversationCreatedAt: number;
  service: ChatService;
  repo: ChatRepository;
  onTouchChat?: (patch: { title?: string }) => void;
}) {
  const chat = useChat({
    chatId: props.chatId,
    conversationCreatedAt: props.conversationCreatedAt,
    service: props.service,
    onTouchChat: props.onTouchChat,
    onLoadMessages: (id) => props.repo.loadMessages(id),
    onSaveMessages: (id, messages) => props.repo.saveMessages(id, messages),
  });

  return (
    <div className={styles.chatPanel}>
      <ChatConversation
        messages={chat.messages}
        status={chat.status}
        toastMessage={chat.toastMessage}
        isStreaming={chat.isStreaming}
        onSetAssistantVersion={chat.setAssistantVersion}
      />
      <ChatComposer isStreaming={chat.isStreaming} onSend={chat.submit} onStop={chat.cancel} onRetry={chat.retry} />
    </div>
  );
}
