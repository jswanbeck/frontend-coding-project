import OpenAI from "openai";
import type { ChatMessage } from "./types";

function toChatMessages(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({
      role: m.role,
      content: m.content,
    })) as Array<{ role: "user" | "assistant"; content: string }>;
}

export async function* streamAssistantText(params: {
  messages: ChatMessage[];
  signal: AbortSignal;
}): AsyncGenerator<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const openai = new OpenAI({ apiKey });
  const stream = await openai.chat.completions.create(
    {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: toChatMessages(params.messages),
      stream: true,
    },
    { signal: params.signal },
  );

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) yield delta;
  }
}

