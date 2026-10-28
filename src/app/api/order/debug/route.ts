// TEMP diagnostic: shape of a Square order (no personal data returned).
import { getOrder } from "@/lib/square";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("orderId") ?? "";
  try {
    const o = await getOrder(id);
    return Response.json({
      ok: true, state: o.state, tenders: o.tenders?.length ?? 0,
      total: o.total_money, due: o.net_amount_due_money,
      mdKeys: Object.keys(o.metadata ?? {}), src: o.metadata?.src,
      lineMd: (o.line_items ?? []).map((l) => Object.keys(l.metadata ?? {})),
    });
  } catch (e) {
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) });
  }
}
