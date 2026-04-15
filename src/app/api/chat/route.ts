import { NextResponse } from "next/server";
import { encodeSseEvent, sseHeaders } from "@/lib/sse";
import type { ChatMessage, StreamEvent } from "@/lib/types";
import { streamAssistantText } from "@/lib/llm";

export const runtime = "nodejs";

type ChatRequestBody = {
  messages: ChatMessage[];
};

function jsonError(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return jsonError(400, "Invalid JSON body.");
  }

  if (!body?.messages || !Array.isArray(body.messages)) {
    return jsonError(400, "Body must include `messages` array.");
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (event: StreamEvent) => {
        controller.enqueue(encoder.encode(encodeSseEvent(event)));
      };

      try {
        push({ type: "status", message: "Thinking…" });
        for await (const token of streamAssistantText({ messages: body.messages, signal: req.signal })) {
          push({ type: "text", content: token });
        }
        push({ type: "done" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong while generating the response.";
        push({ type: "error", message });
      } finally {
        controller.close();
      }
    },
    cancel() {},
  });

  return new NextResponse(stream, { headers: sseHeaders() });
}
