// Diagnostic: confirms SQUARE_ACCESS_TOKEN / SQUARE_LOCATION_ID are set and
// valid by fetching the location. Never returns the token itself.
export const runtime = "nodejs";

export async function GET() {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  if (!token || !locationId) {
    return Response.json({
      ok: false,
      reason: "env vars not set",
      hasToken: Boolean(token),
      hasLocationId: Boolean(locationId),
    });
  }
  const res = await fetch(
    `https://connect.squareup.com/v2/locations/${encodeURIComponent(locationId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Square-Version": "2025-01-23",
      },
      cache: "no-store",
    },
  );
  const body = (await res.json().catch(() => ({}))) as {
    location?: { name?: string; currency?: string; status?: string };
    errors?: { code?: string; detail?: string }[];
  };
  if (!res.ok) {
    return Response.json({
      ok: false,
      status: res.status,
      errors: (body.errors ?? []).map((e) => e.code),
    });
  }
  // Also confirm the sheet write API answers (ping only — writes nothing).
  let sheetWrite: string = "env vars not set";
  if (process.env.SHEET_WRITE_URL && process.env.SHEET_WRITE_TOKEN) {
    try {
      const r = await fetch(process.env.SHEET_WRITE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: process.env.SHEET_WRITE_TOKEN, action: "ping" }),
        redirect: "follow",
        cache: "no-store",
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      sheetWrite = j.ok ? "ok" : `error: ${j.error ?? r.status}`;
    } catch (e) {
      sheetWrite = `error: ${e instanceof Error ? e.message : String(e)}`;
    }
  }
  return Response.json({
    ok: true,
    sheetWrite,
    location: body.location?.name,
    currency: body.location?.currency,
    status: body.location?.status,
  });
}
