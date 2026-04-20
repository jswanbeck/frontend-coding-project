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
    close: string;
    delete: string;
    historyEmptyTitle: string;
    historyEmptyBody: string;
    assistantTitle: string;
    expandSidebar: string;
    collapseSidebar: string;
  };
  chat: {
    retry: string;
    send: string;
    stop: string;
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
    language: string;
    languageEn: string;
    languageFr: string;
    languageDebug: string;
    apiMode: string;
    apiModeMock: string;
  };
};

