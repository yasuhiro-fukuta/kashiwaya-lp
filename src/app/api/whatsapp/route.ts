import { getKnowledge } from "@/lib/knowledge";
import { buildStaffSystemPrompt, buildSystemPrompt, STAFF_TAG_PATTERN } from "@/lib/prompt";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.CHAT_MODEL ?? "claude-haiku-4-5";
const GRAPH_API = "https://graph.facebook.com/v20.0";

// Meta retries webhook deliveries; remember recently handled message ids so a
// retry doesn't produce a duplicate reply (best effort, per instance).
const handled = new Map<string, number>();
function alreadyHandled(id: string): boolean {
  const now = Date.now();
  for (const [k, t] of handled) if (now - t > 10 * 60_000) handled.delete(k);
  if (handled.has(id)) return true;
  handled.set(id, now);
  return false;
}

// Webhook verification handshake (Meta calls this once when you save the URL).
export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN && challenge) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

type WaMessage = {
  id: string;
  from: string;
  type: string;
  text?: { body: string };
};

export async function POST(req: Request) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId || !process.env.ANTHROPIC_API_KEY) {
    return new Response("Not configured", { status: 200 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response("Bad request", { status: 200 });
  }

  // Collect inbound text messages from the webhook payload.
  const messages: WaMessage[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const entry of (payload as any).entry ?? []) {
      for (const change of entry.changes ?? []) {
        for (const m of change.value?.messages ?? []) messages.push(m);
      }
    }
  } catch {
    /* ignore malformed payloads */
  }

  for (const m of messages) {
    if (m.type !== "text" || !m.text?.body || !m.from) continue;
    if (alreadyHandled(m.id)) continue;
    const question = m.text.body.slice(0, 2000);

    try {
      const knowledge = await getKnowledge();
      const client = new Anthropic();
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system: [
          {
            type: "text",
            text:
              (STAFF_TAG_PATTERN.test(question)
                ? buildStaffSystemPrompt(knowledge)
                : buildSystemPrompt(knowledge)) +
              "\n\n# WhatsApp用の追加ルール\n- ここはWhatsAppです。回答は短め(数文〜箇条書き数点)に。\n- マークダウン記法(** や # など)は使わない。\n- 会話の履歴は保持されないため、直前のやり取りを前提にしない。",
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: question }],
      });

      const answer = response.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      if (answer) await sendWhatsAppText(phoneNumberId, token, m.from, answer);
    } catch (err) {
      console.error("whatsapp: failed to answer:", err);
      await sendWhatsAppText(
        phoneNumberId,
        token,
        m.from,
        "Sorry, I couldn't process that right now. Please contact Kashiwaya directly: +81 90 3839 2354",
      ).catch(() => {});
    }
  }

  // Always 200 so Meta doesn't keep retrying.
  return new Response("OK", { status: 200 });
}

async function sendWhatsAppText(
  phoneNumberId: string,
  token: string,
  to: string,
  body: string,
) {
  const res = await fetch(`${GRAPH_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: body.slice(0, 4000) },
    }),
  });
  if (!res.ok) {
    console.error("whatsapp: send failed:", res.status, await res.text().catch(() => ""));
  }
}
