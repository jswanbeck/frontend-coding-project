"use client";

import { useState } from "react";
import styles from "@/features/chat/styles/chat.module.css";
import { useT } from "@/shared/i18n/useT";

export function ChatComposer(props: {
  disabled: boolean;
  onSend: (text: string) => Promise<void> | void;
  onRetry: () => Promise<void> | void;
}) {
  const [input, setInput] = useState("");
  const t = useT();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || props.disabled) return;
    setInput("");
    await props.onSend(text);
  }

  return (
    <form className={styles.composer} onSubmit={onSubmit}>
      <input
        className={styles.input}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={t("chat.placeholder")}
      />
      <button className={styles.buttonPrimary} type="submit">
        {t("chat.send")}
      </button>
      <button
        className={`${styles.buttonSecondary} ${styles.retryButton}`}
        type="button"
        onClick={props.onRetry}
        disabled={props.disabled}
      >
        {t("chat.retry")}
      </button>
    </form>
  );
}

