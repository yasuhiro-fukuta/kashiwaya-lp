// Diagnostic: shows whether the DM ledger (問い合わせ台帳 Google Doc) is
// reachable from the server. Returns size and the title line only — no
// guest data.
import { fetchDmLogText } from "@/lib/dmlog";

export const runtime = "nodejs";

export async function GET() {
  try {
    const text = await fetchDmLogText(true);
    return Response.json({
      ok: true,
      chars: text.length,
      title: text.split("\n")[0]?.slice(0, 60) ?? "",
    });
  } catch (err) {
    return Response.json({ ok: false, reason: String(err) });
  }
}
