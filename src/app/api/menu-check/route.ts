// Diagnostic: shows whether the meal price list was fetched from the
// spreadsheet (kashiwaya_master_v2「メニュー」sheet via the Apps Script API).
// Returns item names and prices only — no guest data lives in that response.
import { fetchMenu, priceMenuRows } from "@/lib/menu";
import { NEW_TARIFF, OLD_TARIFF, tariffAt } from "@/lib/mealPrices";

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
    // シートの価格（参考）と、料金表で計算した いま／旧／新 の売値（2026-11-22 値上げ）
    sheet: items.map((it) => `${it.name} = ¥${it.price}`),
    tariffNow: tariffAt(Date.now()).id,
    menu: priceMenuRows(items, tariffAt(Date.now())).map((it) => `${it.name} = ¥${it.price}`),
    old: priceMenuRows(items, OLD_TARIFF).map((it) => `${it.name} = ¥${it.price}`),
    new: priceMenuRows(items, NEW_TARIFF).map((it) => `${it.name} = ¥${it.price}`),
  });
}
