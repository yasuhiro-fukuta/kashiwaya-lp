import Anthropic from "@anthropic-ai/sdk";
import { getKnowledge } from "@/lib/knowledge";
import { getMenuBlock } from "@/lib/menu";
import { getEbikeBlock } from "@/lib/ebike";
import { getDmLogBlock, DMLOG_UNAVAILABLE_NOTE } from "@/lib/dmlog";
import { getOrdersBlock, ORDERS_UNAVAILABLE_NOTE } from "@/lib/orders";
import { getScheduleBlock, SCHEDULE_UNAVAILABLE_NOTE } from "@/lib/schedule";
import { buildStaffSystemPrompt, buildSystemPrompt, STAFF_REPLY_RULES, STAFF_REPLY_TAG_PATTERN, STAFF_TAG_PATTERN } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.CHAT_MODEL ?? "claude-haiku-4-5";
// Staff mode cross-references the schedule and the DM ledger across a
// large context; the small model missed matches (Okada vs 岡田様), so
// staff questions run on a stronger model. Guest mode stays on MODEL.
const STAFF_MODEL = process.env.STAFF_CHAT_MODEL ?? "claude-sonnet-5";
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
  // All sources are independent — fetch them at once. Run in series this was
  // 6 round trips (each 1-8s on a cache miss) before the model even started.
  const t0 = Date.now();
  const timing: Record<string, number> = {};
  const timed = <T,>(name: string, p: Promise<T>): Promise<T> =>
    p.finally(() => { timing[name] = Date.now() - t0; });
  const [knowledge, schedule, dmlog, orders, meals, ebike] = await Promise.all([
    timed("knowledge", getKnowledge()),
    timed("schedule", staffMode ? getScheduleBlock() : Promise.resolve(null)),
    timed("dmlog", staffMode ? getDmLogBlock() : Promise.resolve(null)),
    timed("orders", staffMode ? getOrdersBlock() : Promise.resolve(null)),
    timed("menu", getMenuBlock()),
    timed("ebike", getEbikeBlock()),
  ]);
  const contextMs = Date.now() - t0;
  console.log(`chat: context fetched in ${contextMs}ms (staff=${staffMode})`, timing);
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
  if (ebike) system.push({ type: "text", text: ebike });
  if (schedule) system.push({ type: "text", text: schedule });
  else if (staffMode && process.env.SHEET_API_URL) {
    system.push({ type: "text", text: SCHEDULE_UNAVAILABLE_NOTE });
  }
  // The caterer's order sheet is the final word on meals (what is cooked and delivered).
  if (orders) system.push({ type: "text", text: orders });
  else if (staffMode) system.push({ type: "text", text: ORDERS_UNAVAILABLE_NOTE });
  if (dmlog) system.push({ type: "text", text: dmlog });
  else if (staffMode) system.push({ type: "text", text: DMLOG_UNAVAILABLE_NOTE });
  // Cache the whole system prefix (knowledge + sheets + ledger ≈ 50k tokens in
  // staff mode). The sources are themselves cached for 5 minutes, so repeat
  // questions hit the prompt cache instead of re-reading everything.
  system[system.length - 1].cache_control = { type: "ephemeral" };

  const sizes = [knowledge, schedule, dmlog, orders, meals, ebike].map((b) => (b ? b.length : 0));
  const stream = client.messages.stream({
    model: staffMode ? STAFF_MODEL : MODEL,
    // Staff answers (shift table + DM記録) run long; 1024 cut them mid-sentence.
    max_tokens: staffMode ? 4096 : 1024,
    system,
    messages: toApiMessages(history),
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
      stream
        .finalMessage()
        .then((msg) => {
          const u = msg.usage as unknown as Record<string, unknown>;
          console.log(
            `chat: done in ${Date.now() - t0}ms input=${u.input_tokens} cache_read=${u.cache_read_input_tokens} cache_write=${u.cache_creation_input_tokens} output=${u.output_tokens}`,
          );
        })
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
      // Diagnostics (no guest data): how long the context took and how big it is.
      "X-Context-Ms": String(contextMs),
      "X-Context-Detail": Object.entries(timing).map(([k, v]) => `${k}=${v}`).join(","),
      "X-Context-Chars": sizes.join(","),
    },
  });
}
