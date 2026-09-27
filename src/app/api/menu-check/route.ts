// Diagnostic: shows whether the meal price list was fetched from the
// spreadsheet (kashiwaya_master_v2「メニュー」sheet via the Apps Script API).
// Returns item names and prices only — no guest data lives in that response.
import { fetchMenu } from "@/lib/menu";

export const runtime = "nodejs";

export async function GET() {
  if (!process.env.SHEET_API_URL || !process.env.SHEET_API_TOKEN) {
    return Response.json({ ok: false, reason: "env vars not set" });
  }
  const items = await fetchMenu();
  if (!items) return Response.json({ ok: false, reason: "fetch or parse failed" });
  return Response.json({
    ok: true,
    items: items.length,
    menu: items.map((it) => `${it.name} = ¥${it.price}`),
  });
}
