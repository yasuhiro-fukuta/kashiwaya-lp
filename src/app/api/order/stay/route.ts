// POST {lastName, arrival} → the guest's nights + the live menu.
// Returns only the matched guest's own nights (no other board data).
import { findStay } from "@/lib/stay";
import { getMenuOptions } from "@/lib/mealOrder";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { lastName?: string; arrival?: string };
  const lastName = String(body.lastName ?? "").trim();
  const arrival = String(body.arrival ?? "").trim();
  if (lastName.length < 2 || !/^\d{4}-\d{2}-\d{2}$/.test(arrival)) {
    return Response.json({ ok: false, error: "Please enter your last name and check-in date." }, { status: 400 });
  }
  try {
    const [stay, menu] = await Promise.all([findStay(lastName, arrival), getMenuOptions()]);
    if (!menu) return Response.json({ ok: false, error: "The menu is temporarily unavailable. Please try again in a few minutes." }, { status: 503 });
    if (!stay) {
      return Response.json({
        ok: false,
        error: "We couldn't find a stay with that last name and check-in date. Please check both, or message us on WhatsApp.",
      }, { status: 404 });
    }
    return Response.json({ ok: true, room: stay.room, nights: stay.nights, menu });
  } catch (err) {
    console.error("order/stay:", err);
    return Response.json({ ok: false, error: "Something went wrong. Please try again in a few minutes." }, { status: 500 });
  }
}
