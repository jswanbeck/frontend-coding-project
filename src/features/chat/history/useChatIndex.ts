"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { uid } from "@/shared/utils/id";
import type { ChatRepository, ChatIndexItem, ChatIndexState } from "@/features/chat/persistence/chatRepository";

export function useChatIndex(repo: ChatRepository) {
  const [state, setState] = useState<ChatIndexState>(() => repo.loadIndex());
  const hydratedRef = useRef(true);

  useEffect(() => {
    if (!hydratedRef.current) return;
    repo.saveIndex(state);
  }, [repo, state]);

  const chats = useMemo(() => [...state.chats].sort((a, b) => b.createdAt - a.createdAt), [state.chats]);
  const activeChatId = state.activeChatId;

  function selectChat(chatId: string) {
    setState((prev) => ({ ...prev, activeChatId: chatId }));
  }

  function createChat() {
    const now = Date.now();
    const id = uid();
    const item: ChatIndexItem = { id, title: "New Chat", createdAt: now, updatedAt: now };
    setState((prev) => ({ activeChatId: id, chats: [item, ...prev.chats] }));
    return id;
  }

  function touchChat(chatId: string, patch?: { title?: string }) {
    const now = Date.now();
    setState((prev) => ({
      ...prev,
      chats: prev.chats.map((c) => (c.id === chatId ? { ...c, updatedAt: now, title: patch?.title ?? c.title } : c)),
    }));
  }

  function deleteChat(chatId: string) {
    repo.deleteMessages(chatId);
    setState((prev) => {
      const nextChats = prev.chats.filter((c) => c.id !== chatId);
      const nextActive =
        prev.activeChatId === chatId ? (nextChats.length > 0 ? nextChats[0]!.id : null) : prev.activeChatId;
      return { activeChatId: nextActive, chats: nextChats };
    });
  }

  return { chats, activeChatId, selectChat, createChat, touchChat, deleteChat };
}
