import Anthropic from "@anthropic-ai/sdk";
import { getKnowledge } from "@/lib/knowledge";
import { buildSystemPrompt } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.CHAT_MODEL ?? "claude-haiku-4-5";
const MAX_MESSAGE_CHARS = 2000;
const MAX_TURNS = 30;

// Naive per-IP rate limit. In-memory, so it resets per serverless instance —
// good enough as a cost brake for a small inn; swap for Upstash if it grows.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function isValidHistory(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= MAX_TURNS &&
    value.every(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0 &&
        m.content.length <= MAX_MESSAGE_CHARS,
    ) &&
    value[value.length - 1].role === "user"
  );
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("Chat is not configured yet.", { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return new Response("Too many requests. Please wait a moment.", { status: 429 });
  }

  let history: unknown;
  try {
    history = (await req.json()).messages;
  } catch {
    return new Response("Invalid request.", { status: 400 });
  }
  if (!isValidHistory(history)) {
    return new Response("Invalid request.", { status: 400 });
  }

  const knowledge = await getKnowledge();
  const client = new Anthropic();

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: buildSystemPrompt(knowledge),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: history,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
      stream
        .finalMessage()
        .catch((err) => {
          console.error("chat: stream error:", err);
          controller.enqueue(
            encoder.encode(
              "\n\nSorry, something went wrong. Please try again, or contact us on WhatsApp: https://wa.me/819038392354",
            ),
          );
        })
        .finally(() => controller.close());
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
