"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/lib/types";
import styles from "@/features/chat/styles/chat.module.css";

export function ChatConversation(props: {
  messages: ChatMessage[];
  status: string | null;
  error: string | null;
  isStreaming: boolean;
  onSetAssistantVersion: (messageId: string, nextIndex: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [props.messages, props.status, props.error, props.isStreaming]);

  return (
    <div className={styles.conversation}>
      <div className={styles.conversationScroller} ref={scrollerRef} role="log" aria-live="polite">
        {props.messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? styles.userRow : styles.assistantRow}>
            {m.role === "assistant" ? (
              <div className={styles.messageStack}>
                <div className={styles.bubble}>
                  <div className={styles.roleLabel}>Assistant</div>
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
                <div className={styles.roleLabel}>You</div>
                <div className={styles.content}>{m.content}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.statusDock} aria-live="polite" aria-atomic="true">
        {props.error ? <div className={styles.error}>{props.error}</div> : null}
        {!props.error && props.status ? <div className={styles.status}>{props.status}</div> : null}
      </div>
    </div>
  );
}

