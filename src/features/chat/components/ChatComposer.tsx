"use client";

import { useState } from "react";
import styles from "@/features/chat/components/ChatComposer.module.css";
import { useT } from "@/shared/i18n/useT";

export function ChatComposer(props: {
  isStreaming: boolean;
  onSend: (text: string) => Promise<void> | void;
  onStop: () => void;
  onRetry: () => Promise<void> | void;
}) {
  const [input, setInput] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);
  const t = useT();

  const showPrimaryStop = props.isStreaming && !isRetrying;
  const showSecondaryStop = isRetrying;

  async function onSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    const text = input.trim();
    if (!text || props.isStreaming) return;
    setInput("");
    await props.onSend(text);
  }

  async function onRetry() {
    setIsRetrying(true);
    await props.onRetry();
    setIsRetrying(false);
    setInput("");
  }

  return (
    <form className={styles.composer} onSubmit={onSubmit}>
      <input
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("chat.placeholder")}
        disabled={props.isStreaming}
      />
      <button
        className={styles.buttonPrimary}
        type={showPrimaryStop ? "button" : "submit"}
        onClick={showPrimaryStop ? props.onStop : undefined}
        disabled={!showPrimaryStop && isRetrying}
      >
        {showPrimaryStop ? t("chat.stop") : t("chat.send")}
      </button>

      <button
        className={
          showSecondaryStop
            ? styles.buttonSecondary
            : `${styles.buttonSecondary} ${styles.retryButton}`
        }
        type="button"
        onClick={showSecondaryStop ? props.onStop : onRetry}
        disabled={!showSecondaryStop && props.isStreaming}
      >
        {showSecondaryStop ? t("chat.stop") : t("chat.retry")}
      </button>
    </form>
  );
}

