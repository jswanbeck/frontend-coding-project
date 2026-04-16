export type Locale = "en" | "debug" | "fr";

export type Translations = {
  app: {
    title: string;
  };
  nav: {
    conversations: string;
    settings: string;
  };
  home: {
    chatHistoryTitle: string;
    newChat: string;
    home: string;
    close: string;
    delete: string;
    historyEmptyTitle: string;
    historyEmptyBody: string;
    assistantTitle: string;
  };
  chat: {
    retry: string;
    cancel: string;
    send: string;
    placeholder: string;
    roleAssistant: string;
    roleYou: string;
    statusConnecting: string;
    statusCancelled: string;
    statusThinking: string;
    assistantWelcome: string;
    error: {
      generic: string;
      somethingWentWrong: string;
    };
  };
  mock: {
    statusThinking: string;
    cannedResponses: string[];
  };
  settings: {
    title: string;
    subtitle: string;
    language: string;
    languageEn: string;
    languageFr: string;
    languageDebug: string;
    apiMode: string;
    apiModeMock: string;
    apiModeOpenAI: string;
  };
};

