import type { Translations } from "@/shared/i18n/types";

export const fr: Translations = {
  app: {
    title: "Application de chatbot",
  },
  nav: {
    conversations: "Conversations",
    settings: "Paramètres",
  },
  home: {
    chatHistoryTitle: "Historique des conversations",
    newChat: "Nouvelle conversation",
    close: "Fermer",
    delete: "Supprimer",
    historyEmptyTitle: "Aucun historique de conversation",
    historyEmptyBody: "Créez une nouvelle conversation pour commencer.",
    assistantTitle: "Assistant IA",
    expandSidebar: "Développer la barre latérale",
    collapseSidebar: "Réduire la barre latérale",
  },
  chat: {
    retry: "Réessayer",
    send: "Envoyer",
    stop: "Arrêter",
    placeholder: "Posez une question...",
    roleAssistant: "Assistant",
    roleYou: "Vous",
    statusConnecting: "Connexion...",
    statusCancelled: "Invite annulée.",
    statusThinking: "Réflexion...",
    assistantWelcome: "Demandez-moi n'importe quoi, je vous répondrai en streaming.",
    error: {
      generic: "Une erreur est survenue.",
      somethingWentWrong: "Une erreur est survenue lors de la génération de la réponse.",
    },
  },
  settings: {
    title: "Paramètres",
    language: "Langue",
    languageEn: "Anglais",
    languageFr: "Français",
    languageDebug: "Débogage (afficher les clés)",
    apiMode: "API de chat",
    apiModeMock: "Simulation",
  },
  mock: {
    statusThinking: "Réflexion (simulation)...",
    cannedResponses: [
      "Merci pour la question, je suis ravi de vous aider.",
      "Voyons ça ensemble.",
      "Bien compris. Voici comment je m'y prendrais.",
      "Bien sûr !",
      "Ça se tient. Voyons ce qu'on peut faire.",
      "Bonne idée. C'est une direction solide.",
      "Oui, c'est tout à fait faisable.",
      "Compris. Je peux vous aider à itérer à partir de là.",
      "D'accord ! On va vous débloquer.",
      "Très bien. On va avancer étape par étape.",
    ],
  },
};

