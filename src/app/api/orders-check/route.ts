// Diagnostic: shows whether the caterer's order sheet (柏屋注文確認票) is
// readable. Returns counts per month only — no guest names, since this
// endpoint is public.
import { fetchOrders } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchOrders(true);
    const perMonth: Record<string, number> = {};
    for (const l of data.lines) {
      const k = l.date.slice(0, 7);
      perMonth[k] = (perMonth[k] ?? 0) + 1;
    }
    return Response.json({ ok: true, months: data.months, lines: data.lines.length, perMonth });
  } catch (err) {
    return Response.json({ ok: false, reason: String(err) });
  }
}
