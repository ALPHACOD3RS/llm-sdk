/** Minimal SSE reader (`event:` / `data:` frames). */
export interface SseEvent {
  event?: string;
  data: string;
}

export async function* readSseEvents(body: ReadableStream<Uint8Array>): AsyncGenerator<SseEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        yield parseFrame(rawEvent);
      }
    }
    if (buffer.trim().length > 0) yield parseFrame(buffer);
  } finally {
    reader.releaseLock();
  }
}

function parseFrame(raw: string): SseEvent {
  let event: string | undefined;
  const dataLines: string[] = [];
  for (const line of raw.split("\n")) {
    if (line.startsWith("event:")) event = line.slice(6).trim();
    else if (line.startsWith("data:")) dataLines.push(line.slice(5).trim());
  }
  return { ...(event !== undefined ? { event } : {}), data: dataLines.join("\n") };
}
