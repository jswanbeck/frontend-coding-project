"use client";

import { useMemo, useState } from "react";
import styles from "@/features/conversations/styles/conversations.module.css";
import { AppShell } from "@/features/shell";
import { useT } from "@/shared/i18n/useT";
import { ChatAssistantPanel, useChatIndex } from "@/features/chat";
import { formatTimestampUtc } from "@/shared/utils/time";
import { localStorageChatRepository } from "@/features/chat/persistence/chatRepository";
import { getChatService } from "@/services/chat";

const repo = localStorageChatRepository;

export function ConversationsPage() {
  const t = useT();
  const service = useMemo(() => getChatService(), []);
  const history = useChatIndex(repo);
  const [view, setView] = useState<"list" | "chat">("list");

  const activeId = history.activeChatId;
  const activeCreatedAt = useMemo(
    () => (activeId ? (history.chats.find((c) => c.id === activeId)?.createdAt ?? 0) : null),
    [activeId, history.chats],
  );

  function openChat(id: string) {
    history.selectChat(id);
    setView("chat");
  }

  function newChat() {
    history.createChat();
    setView("chat");
  }

  const conversationList = (
    <>
      <div className={styles.historyList}>
        {history.chats.length === 0 ? (
          <div className={styles.historyEmpty} role="status" aria-live="polite">
            {t("home.historyEmptyBody")}
          </div>
        ) : (
          <div className={styles.historyListInner} role="list">
            {history.chats.map((c) => (
              <div key={c.id} className={styles.historyRow} role="listitem">
                <button
                  type="button"
                  className={c.id === activeId ? styles.historyItemActive : styles.historyItem}
                  onClick={() => history.selectChat(c.id)}
                >
                  <div className={styles.historyItemTitle}>{c.title}</div>
                  <div className={styles.historyItemMeta}>{formatTimestampUtc(c.createdAt)}</div>
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={(e) => { e.stopPropagation(); history.deleteChat(c.id); }}
                  aria-label={`${t("home.delete")}: ${c.title}`}
                  title={t("home.delete")}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.historyFooter}>
        <button type="button" className={styles.buttonPrimary} onClick={newChat}>
          {t("home.newChat")}
        </button>
      </div>
    </>
  );

  const chatPanel = activeId ? (
    <div className={styles.chatRight}>
      <div className={styles.assistantHeader}>
        <p className={styles.assistantTitle}>{t("home.assistantTitle")}</p>
        <button type="button" className={styles.buttonSecondary} onClick={() => setView("list")}>
          {t("home.close")}
        </button>
      </div>
      <ChatAssistantPanel
        chatId={activeId}
        conversationCreatedAt={activeCreatedAt ?? 0}
        service={service}
        repo={repo}
        onTouchChat={(patch) => history.touchChat(activeId, patch)}
      />
    </div>
  ) : null;

  if (view === "chat" && activeId) {
    return (
      <AppShell active="conversations" fillHeight>
        <div className={styles.splitLayout}>
          <aside className={styles.splitSidebar} aria-label={t("home.chatHistoryTitle")}>
            {conversationList}
          </aside>
          <section className={styles.splitMain} aria-label={t("app.title")}>
            {chatPanel}
          </section>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell active="conversations">
      <div className={styles.landing}>
        <div className={styles.historyLandingContent}>
          <div className={styles.historyLandingHeader}>
            <p className={styles.shellTitle}>{t("home.chatHistoryTitle")}</p>
            <button type="button" className={styles.buttonPrimary} onClick={newChat}>
              {t("home.newChat")}
            </button>
          </div>

          {history.chats.length === 0 ? (
            <div className={styles.emptyState} role="status" aria-live="polite">
              <h2 className={styles.emptyTitle}>{t("home.historyEmptyTitle")}</h2>
              <p className={styles.emptyBody}>{t("home.historyEmptyBody")}</p>
            </div>
          ) : (
            <div className={styles.historyListInner} role="list">
              {history.chats.map((c) => (
                <div key={c.id} className={styles.historyRow} role="listitem">
                  <button type="button" className={styles.historyItem} onClick={() => openChat(c.id)}>
                    <div className={styles.historyItemTitle}>{c.title}</div>
                    <div className={styles.historyItemMeta}>{formatTimestampUtc(c.createdAt)}</div>
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={(e) => { e.stopPropagation(); history.deleteChat(c.id); }}
                    aria-label={`${t("home.delete")}: ${c.title}`}
                    title={t("home.delete")}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
