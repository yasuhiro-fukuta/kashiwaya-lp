// Diagnostic: verifies the staff schedule API is reachable from the server.
// Returns counts only — no schedule contents, so it is safe to leave enabled.
export const runtime = "nodejs";

export async function GET() {
  const url = process.env.SHEET_API_URL;
  const token = process.env.SHEET_API_TOKEN;
  if (!url || !token) {
    return Response.json({ ok: false, reason: "env vars not set" });
  }
  try {
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${url}${sep}token=${encodeURIComponent(token)}`, {
      cache: "no-store",
      redirect: "follow",
    });
    if (!res.ok) {
      return Response.json({ ok: false, reason: `http ${res.status}` });
    }
    const data = await res.json();
    if (data.error) return Response.json({ ok: false, reason: data.error });
    return Response.json({
      ok: true,
      generatedAt: data.generatedAt,
      today: data.today,
      boardRows: Array.isArray(data.board) ? data.board.length : -1,
      specialTasks: Array.isArray(data.special) ? data.special.length : -1,
      staff: Array.isArray(data.staff) ? data.staff.length : -1,
    });
  } catch (err) {
    return Response.json({ ok: false, reason: String(err) });
  }
}
