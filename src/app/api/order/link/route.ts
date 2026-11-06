// POST {token} → link paid meal orders to their bookings and write them to the
// sheet. Called by 定時チェック (6・12・18時). token = the sheet write API's
// 合言葉 (SHEET_WRITE_TOKEN), so no new secret is needed.
import { timingSafeEqual } from "crypto";
import { linkPendingOrders } from "@/lib/orderLink";

export const runtime = "nodejs";
export const maxDuration = 60;

function same(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: string };
  const secret = process.env.SHEET_WRITE_TOKEN ?? "";
  if (!secret || !same(String(body.token ?? ""), secret)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  try {
    const report = await linkPendingOrders();
    return Response.json({ ok: true, ...report });
  } catch (err) {
    console.error("order/link:", err);
    return Response.json({ ok: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
