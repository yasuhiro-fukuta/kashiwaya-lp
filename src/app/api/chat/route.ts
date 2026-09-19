import Anthropic from "@anthropic-ai/sdk";
import { getKnowledge } from "@/lib/knowledge";
import { getMealFormBlock } from "@/lib/mealform";
import { getScheduleBlock } from "@/lib/schedule";
import { buildStaffSystemPrompt, buildSystemPrompt, STAFF_REPLY_RULES, STAFF_REPLY_TAG_PATTERN, STAFF_TAG_PATTERN } from "@/lib/prompt";

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

type ChatMessage = { role: "user" | "assistant"; content: string; images?: string[] };

const MAX_IMAGES = 3;
const MAX_IMAGE_CHARS = 2_500_000; // ~1.8MB per image after base64
const IMAGE_DATA_URL = /^data:(image\/(?:jpeg|png|webp|gif));base64,([A-Za-z0-9+/=]+)$/;

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
        m.content.length <= MAX_MESSAGE_CHARS &&
        (m.images === undefined ||
          (Array.isArray(m.images) &&
            m.images.length <= MAX_IMAGES &&
            m.images.every(
              (img: unknown) =>
                typeof img === "string" && img.length <= MAX_IMAGE_CHARS,
            ))) &&
        (m.content.trim().length > 0 || (m.images?.length ?? 0) > 0),
    ) &&
    value[value.length - 1].role === "user"
  );
}

// Convert to API content blocks; image attachments become vision input.
function toApiMessages(history: ChatMessage[]): Anthropic.MessageParam[] {
  return history.map((m) => {
    const blocks: Anthropic.ContentBlockParam[] = [];
    for (const img of (m.images ?? []).slice(0, MAX_IMAGES)) {
      const match = IMAGE_DATA_URL.exec(img);
      if (!match) continue;
      blocks.push({
        type: "image",
        source: {
          type: "base64",
          media_type: match[1] as "image/jpeg" | "image/png" | "image/webp" | "image/gif",
          data: match[2],
        },
      });
    }
    blocks.push({
      type: "text",
      text: m.content.trim() || "(See attached image / 画像を確認してください)",
    });
    return { role: m.role, content: blocks };
  });
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

  const lastContent = history[history.length - 1].content;
  const replyMode = STAFF_REPLY_TAG_PATTERN.test(lastContent);
  const staffMode = replyMode || STAFF_TAG_PATTERN.test(lastContent);
  const knowledge = await getKnowledge();
  const schedule = staffMode ? await getScheduleBlock() : null;
  const meals = await getMealFormBlock();
  const client = new Anthropic();

  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text:
        (staffMode ? buildStaffSystemPrompt(knowledge) : buildSystemPrompt(knowledge)) +
        (replyMode ? "\n" + STAFF_REPLY_RULES : ""),
      cache_control: { type: "ephemeral" },
    },
  ];
  if (meals) system.push({ type: "text", text: meals });
  if (schedule) system.push({ type: "text", text: schedule });

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 1024,
    system,
    messages: toApiMessages(history),
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
