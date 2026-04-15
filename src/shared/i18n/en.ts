import type { Translations } from "./types";

export const en: Translations = {
  app: {
    title: "AI Assistant",
  },
  chat: {
    retry: "Retry",
    cancel: "Cancel",
    send: "Send",
    placeholder: "Ask a question…",
    statusConnecting: "Connecting…",
    statusCancelled: "Cancelled.",
    errorGeneric: "Something went wrong.",
    assistantWelcome: "Ask me anything, and I'll stream back an answer.",
  },
  mock: {
    statusThinking: "Thinking (mock)…",
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

