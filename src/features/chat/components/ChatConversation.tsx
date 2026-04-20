"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import styles from "@/features/chat/components/ChatConversation.module.css";
import { formatTimestampUtc } from "@/shared/utils/time";
import { useT } from "@/shared/i18n/useT";

export function ChatConversation(props: {
  messages: ChatMessage[];
  status: string | null;
  toastMessage: string | null;
  isStreaming: boolean;
  onSetAssistantVersion: (messageId: string, nextIndex: number) => void;
}) {
  const t = useT();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [toast, setToast] = useState<string | null>(props.toastMessage);

  useEffect(() => {
    Promise.resolve().then(() => setToast(props.toastMessage));
  }, [props.toastMessage]);

  function dismissToast() {
    setToast(null);
  }

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [props.messages, props.status, props.isStreaming]);

  return (
    <div className={styles.conversation}>
      <div className={styles.conversationScroller} ref={scrollerRef} role="log" aria-live="polite">
        {props.messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? styles.userRow : styles.assistantRow}>
            {m.role === "assistant" ? (
              <div className={styles.messageStack}>
                <div className={styles.bubble}>
                  <div className={styles.roleRow}>
                    <div className={styles.roleLabel}>{t("chat.roleAssistant")}</div>
                    <div className={styles.timeLabel}>{formatTimestampUtc(m.createdAt)}</div>
                  </div>
                  <div className={styles.content}>{m.content}</div>
                </div>
                {m.assistantVersions && m.assistantVersions.items.length > 1 ? (
                  <div className={styles.pager} aria-label="Response versions">
                    <button
                      type="button"
                      className={styles.pagerButton}
                      onClick={() => props.onSetAssistantVersion(m.id, m.assistantVersions!.activeIndex - 1)}
                      disabled={m.assistantVersions.activeIndex <= 0}
                      aria-label="Previous version"
                    >
                      {"<"}
                    </button>
                    <div className={styles.pagerIndex} aria-label="Version index">
                      {m.assistantVersions.activeIndex + 1} / {m.assistantVersions.items.length}
                    </div>
                    <button
                      type="button"
                      className={styles.pagerButton}
                      onClick={() => props.onSetAssistantVersion(m.id, m.assistantVersions!.activeIndex + 1)}
                      disabled={m.assistantVersions.activeIndex >= m.assistantVersions.items.length - 1}
                      aria-label="Next version"
                    >
                      {">"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className={styles.bubble}>
                <div className={styles.roleRow}>
                  <div className={styles.roleLabel}>{t("chat.roleYou")}</div>
                  <div className={styles.timeLabel}>{formatTimestampUtc(m.createdAt)}</div>
                </div>
                <div className={styles.content}>{m.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {toast && (
        <div
          key={toast}
          className={`${styles.toast} ${styles.toastAuto}`}
          role="alert"
          aria-live="assertive"
          onAnimationEnd={(e) => {
            if (e.animationName === "toastSlideOut") dismissToast();
          }}
        >
          <span className={styles.toastMessage}>{toast}</span>
          <button
            type="button"
            className={styles.toastClose}
            onClick={dismissToast}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <div className={styles.statusDock} aria-live="polite" aria-atomic="true">
        {props.status ? <div className={styles.status}>{props.status}</div> : null}
      </div>
    </div>
  );
}

