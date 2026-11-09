// POST {token, days?} → read-only list of Square payments (all locations) for
// the last `days` days (default 14, max 60), with each payment's order line
// item names. Used by 入金チェック / 定時チェック to confirm whether a guest
// paid by Square (E-bike before 11/1, luggage shuttle, guide tours), because
// Square payments are not written to the DM台帳 and the Square MCP connector
// is US-only. Writes nothing. token = SHEET_WRITE_TOKEN (same as order/link).
// Never returns card numbers (only brand + last 4, as Square's dashboard shows).
import { timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

const BASE = "https://connect.squareup.com/v2";
const VERSION = "2025-01-23";

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

type Money = { amount?: number; currency?: string };
type Payment = {
  id: string;
  created_at?: string;
  status?: string;
  amount_money?: Money;
  refunded_money?: Money;
  order_id?: string;
  location_id?: string;
  receipt_number?: string;
  buyer_email_address?: string;
  note?: string;
  source_type?: string;
  card_details?: { card?: { card_brand?: string; last_4?: string; cardholder_name?: string } };
  billing_address?: { first_name?: string; last_name?: string };
  shipping_address?: { first_name?: string; last_name?: string };
};
type Order = {
  id: string;
  line_items?: { name?: string; quantity?: string; total_money?: Money }[];
  metadata?: Record<string, string>;
  reference_id?: string;
  fulfillments?: { pickup_details?: { recipient?: { display_name?: string; email_address?: string; phone_number?: string } } }[];
};

async function sq<T>(token: string, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": VERSION,
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as T & { errors?: { code?: string; detail?: string }[] };
  if (!res.ok) {
    const msg = (json.errors ?? []).map((e) => `${e.code}: ${e.detail}`).join("; ");
    throw new Error(`square ${method} ${path.split("?")[0]} ${res.status} ${msg}`);
  }
  return json;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: string; days?: number };
  const secret = process.env.SHEET_WRITE_TOKEN ?? "";
  if (!secret || !same(String(body.token ?? ""), secret)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return Response.json({ ok: false, error: "SQUARE_ACCESS_TOKEN not set" }, { status: 500 });

  const days = Math.min(Math.max(Number(body.days) || 14, 1), 60);
  const begin = new Date(Date.now() - days * 86400_000).toISOString();

  try {
    // Payments across all locations (no location_id), newest first.
    const payments: Payment[] = [];
    let cursor: string | undefined;
    for (let i = 0; i < 10; i++) {
      const q = new URLSearchParams({ begin_time: begin, sort_order: "DESC", limit: "100" });
      if (cursor) q.set("cursor", cursor);
      const r = await sq<{ payments?: Payment[]; cursor?: string }>(token, "GET", `/payments?${q}`);
      payments.push(...(r.payments ?? []));
      cursor = r.cursor;
      if (!cursor) break;
    }

    // Order line items (what was bought), in batches of 100 per location.
    const orders = new Map<string, Order>();
    const byLoc = new Map<string, string[]>();
    for (const p of payments) {
      if (!p.order_id || !p.location_id) continue;
      const list = byLoc.get(p.location_id) ?? [];
      list.push(p.order_id);
      byLoc.set(p.location_id, list);
    }
    for (const [locationId, ids] of byLoc) {
      for (let i = 0; i < ids.length; i += 100) {
        const r = await sq<{ orders?: Order[] }>(token, "POST", "/orders/batch-retrieve", {
          location_id: locationId,
          order_ids: ids.slice(i, i + 100),
        });
        for (const o of r.orders ?? []) orders.set(o.id, o);
      }
    }

    const items = payments.map((p) => {
      const o = p.order_id ? orders.get(p.order_id) : undefined;
      const recipient = o?.fulfillments?.[0]?.pickup_details?.recipient;
      const nameParts = [
        p.card_details?.card?.cardholder_name,
        [p.billing_address?.first_name, p.billing_address?.last_name].filter(Boolean).join(" "),
        [p.shipping_address?.first_name, p.shipping_address?.last_name].filter(Boolean).join(" "),
        recipient?.display_name,
      ].filter((s) => s && String(s).trim());
      return {
        id: p.id,
        createdAt: p.created_at,
        status: p.status,
        amount: p.amount_money?.amount ?? 0,
        refunded: p.refunded_money?.amount ?? 0,
        items: (o?.line_items ?? []).map((li) => `${li.name ?? ""} ×${li.quantity ?? "1"}`),
        name: nameParts[0] ?? "",
        email: p.buyer_email_address ?? recipient?.email_address ?? "",
        phone: recipient?.phone_number ?? "",
        card: p.card_details?.card ? `${p.card_details.card.card_brand ?? ""} ${p.card_details.card.last_4 ?? ""}`.trim() : "",
        receipt: p.receipt_number ?? "",
        orderId: p.order_id ?? "",
        orderMeta: o?.metadata ?? {},
        source: p.source_type ?? "",
        note: p.note ?? "",
      };
    });
    return Response.json({ ok: true, since: begin, count: items.length, payments: items });
  } catch (err) {
    console.error("square/payments:", err);
    return Response.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
