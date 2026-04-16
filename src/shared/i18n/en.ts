import type { Translations } from "@/shared/i18n/types";

export const en: Translations = {
  app: {
    title: "Chatbot App",
  },
  nav: {
    conversations: "Conversations",
    settings: "Settings",
  },
  home: {
    chatHistoryTitle: "Conversation History",
    newChat: "New Chat",
    home: "Home",
    close: "Close",
    delete: "Delete",
    historyEmptyTitle: "No conversation history",
    historyEmptyBody: "Create a new chat to get started.",
    assistantTitle: "AI Assistant",
  },
  chat: {
    retry: "Retry",
    cancel: "Cancel",
    send: "Send",
    placeholder: "Ask a question...",
    roleAssistant: "Assistant",
    roleYou: "You",
    statusConnecting: "Connecting...",
    statusCancelled: "Cancelled.",
    statusThinking: "Thinking...",
    assistantWelcome: "Ask me anything, and I'll stream back an answer.",
    error: {
      generic: "Something went wrong.",
      somethingWentWrong: "Something went wrong while generating the response.",
    }
  },
  settings: {
    title: "Settings",
    subtitle: "Manage your app preferences.",
    language: "Language",
    languageEn: "English",
    languageFr: "French",
    languageDebug: "Debug (show keys)",
    apiMode: "Chat API",
    apiModeMock: "Mock",
    apiModeOpenAI: "OpenAI",
  },
  mock: {
    statusThinking: "Thinking (mock)...",
    cannedResponses: [
      "Thanks for the question, happy to help.",
      "Let's work through it together.",
      "Got it. Here's how I'd approach this.",
      "Absolutely! Can do.",
      "Makes sense. Let's see what we can come up with.",
      "Good call. This is a solid direction.",
      "Yep, that's totally doable.",
      "Understood. I can help you iterate from here.",
      "Okie doke! Let's get you unstuck.",
      "Sounds good. We'll tackle this step by step.",
    ],
  },
};

