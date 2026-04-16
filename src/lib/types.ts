export type Role = "user" | "assistant";

export type AssistantVersions = {
  items: string[];
  activeIndex: number;
};

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  assistantVersions?: AssistantVersions;
};

export type StreamEvent =
  | { type: "status"; message: string }
  | { type: "text"; content: string }
  | { type: "tool_start"; tool: string }
  | { type: "tool_result"; tool: string; result: string }
  | { type: "citation"; title: string; url: string }
  | { type: "done" }
  | { type: "error"; message: string };

