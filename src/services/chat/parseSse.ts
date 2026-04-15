import type { StreamEvent } from "@/lib/types";

export function parseSseEvents(buffer: string): { events: StreamEvent[]; rest: string } {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  const events: StreamEvent[] = [];

  for (const part of parts) {
    const line = part
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l.startsWith("data:"));
    if (!line) continue;
    const json = line.replace(/^data:\s?/, "");
    try {
      events.push(JSON.parse(json) as StreamEvent);
    } catch { /* ignore */ }
  }

  return { events, rest };
}

