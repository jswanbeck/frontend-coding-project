"use client";

import styles from "@/features/chat/styles/chat.module.css";
export function ChatHeader(props: {
  title: string;
}) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{props.title}</h1>
      </div>
    </header>
  );
}

