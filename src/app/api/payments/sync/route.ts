// Copy every Square payment (柏屋 and 合同会社From Scratch) into the 入金台帳
// sheet, one row per payment, deduped by "square:<payment id>". No AI step:
// what is in Square is what lands in the sheet (2026-11-14 社長決定).
//   POST {token, days?}  token = SHEET_WRITE_TOKEN, days 1–400 (default 30)
//   GET  from Vercel Cron (daily, days=7) — Authorization: Bearer CRON_SECRET
//        when CRON_SECRET is set, otherwise the vercel-cron user agent.
// The 入金チェック scheduled task also POSTs here 3×/day before it reads.
// Writes only the 入金台帳 sheet. Never sends card numbers (brand + last 4).
import { readSquarePayments, same } from "@/lib/squarePayments";
import { upsertPayments, type PaymentRow } from "@/lib/sheetWrite";

export const runtime = "nodejs";
export const maxDuration = 300;

function jst(iso?: string): string {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 9 * 3600_000);
  return d.toISOString().slice(0, 16).replace("T", " ");
}

async function run(days: number) {
  const { begin, all, errors, notRead } = await readSquarePayments(days, 50);
  const rows: PaymentRow[] = all.map((p) => ({
    provider: "square",
    account: p.account,
    id: p.id,
    at: jst(p.createdAt),
    status: p.status ?? "",
    amount: p.amount,
    refunded: p.refunded,
    items: p.items.filter((s) => s.replace(/×\d+/, "").trim()).join(" / "),
    name: p.name,
    email: p.email,
    card: p.card,
    orderId: p.orderId,
    ref: Object.entries(p.orderMeta ?? {}).map(([k, v]) => `${k}=${v}`).join(" "),
    receipt: p.receipt,
  }));
  const written = rows.length ? await upsertPayments(rows) : { added: 0, updated: 0, unchanged: 0 };
  return {
    ok: notRead.length === 0,
    since: begin,
    read: rows.length,
    ...written,
    notRead,
    errors,
  };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: string; days?: number };
  const secret = process.env.SHEET_WRITE_TOKEN ?? "";
  if (!secret || !same(String(body.token ?? ""), secret)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const days = Math.min(Math.max(Number(body.days) || 30, 1), 400);
  try {
    return Response.json(await run(days));
  } catch (err) {
    console.error("payments/sync:", err);
    return Response.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const cron = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  const ua = req.headers.get("user-agent") ?? "";
  const ok = cron ? same(auth, `Bearer ${cron}`) : /vercel-cron/i.test(ua);
  if (!ok) return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  try {
    return Response.json(await run(7));
  } catch (err) {
    console.error("payments/sync cron:", err);
    return Response.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
