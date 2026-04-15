"use client";

import styles from "@/features/chat/styles/chat.module.css";
import { useChat } from "@/features/chat/hooks/useChat";
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import { ChatConversation } from "@/features/chat/components/ChatConversation";
import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { useI18n } from "@/shared/i18n/I18nProvider";

export function ChatPage() {
  const chat = useChat();
  const { tr } = useI18n();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ChatHeader
          title={tr.app.title}
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

