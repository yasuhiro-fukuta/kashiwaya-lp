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
  return Response.json({
    ok: true,
    location: body.location?.name,
    currency: body.location?.currency,
    status: body.location?.status,
  });
}
