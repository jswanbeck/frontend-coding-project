export function formatTimestampUtc(ts: number) {
  const iso = new Date(ts).toISOString(); // e.g. 2026-04-15T17:24:15.000Z
  return iso.slice(0, 16).replace("T", " ");
}

