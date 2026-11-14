// POST {token, days?} → read-only list of Square payments (both accounts, all locations) for
// the last `days` days (default 14, max 60), with each payment's order line
// item names. Used by 入金チェック / 定時チェック to confirm whether a guest
// paid by Square. Writes nothing. token = SHEET_WRITE_TOKEN (same as order/link).
// Never returns card numbers (only brand + last 4, as Square's dashboard shows).
import { readSquarePayments, same } from "@/lib/squarePayments";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { token?: string; days?: number };
  const secret = process.env.SHEET_WRITE_TOKEN ?? "";
  if (!secret || !same(String(body.token ?? ""), secret)) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const days = Math.min(Math.max(Number(body.days) || 14, 1), 60);
  const { begin, all, errors, missing, notRead } = await readSquarePayments(days);
  return Response.json({
    ok: Object.keys(errors).length === 0,
    since: begin,
    count: all.length,
    notRead,
    missingToken: missing,
    errors,
    payments: all,
  });
}
