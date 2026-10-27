// POST OrderRequest → a Square hosted checkout URL.
// Everything is re-checked server-side: the stay (name + check-in date), the
// order deadline and the prices (from the「メニュー」sheet). The client never
// sends a price.
import { randomUUID } from "crypto";
import { findStay } from "@/lib/stay";
import { getMenuOptions, priceOrder, type OrderRequest } from "@/lib/mealOrder";
import { createPaymentLink } from "@/lib/square";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

function shortDate(d: string): string {
  return new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as OrderRequest;
  const booking = String(body.booking ?? "").replace(/[^0-9A-Za-z-]/g, "").slice(0, 30);
  const lastName = String(body.lastName ?? "").trim().slice(0, 60);
  const email = String(body.email ?? "").trim().slice(0, 120);
  // Don't take money we can't record: paid orders are written to the sheet.
  if (!process.env.SHEET_WRITE_URL || !process.env.SHEET_WRITE_TOKEN) {
    return Response.json({
      ok: false,
      error: "Online meal orders are temporarily unavailable. Please message us on WhatsApp (+81 90 3839 2354) to order.",
    }, { status: 503 });
  }
  if (!booking) return Response.json({ ok: false, error: "Please enter your Booking.com reservation number." }, { status: 400 });

  try {
    const [stay, menu] = await Promise.all([findStay(lastName, String(body.arrival ?? "")), getMenuOptions()]);
    if (!stay || !menu) {
      return Response.json({ ok: false, error: "We couldn't confirm your stay. Please reload and try again." }, { status: 404 });
    }
    const priced = priceOrder({ ...body, booking, lastName }, stay.nights, menu);

    const lineItems = priced.map((l) => ({
      name: `${shortDate(l.date)} · ${l.option.label}`,
      quantity: String(l.sets),
      base_price_money: { amount: l.option.price, currency: "JPY" as const },
      metadata: {
        date: l.date,
        room: l.room,
        item: l.option.item,
        label: l.option.boardLabel,
        persons: String(l.option.persons * l.sets),
        kind: l.option.kind,
      },
    }));

    const origin = new URL(req.url).origin;
    const base = origin.includes("localhost") || origin.includes("vercel.app") ? origin : SITE_URL;
    const { url } = await createPaymentLink({
      idempotencyKey: randomUUID(),
      referenceId: `BK${booking}`.slice(0, 40),
      metadata: {
        src: "kashiwaya-order",
        booking,
        guest: stay.guestName.slice(0, 200),
        time: body.time,
        rice: body.rice,
      },
      lineItems,
      redirectUrl: (orderId) => `${base}/order/done?orderId=${encodeURIComponent(orderId)}`,
      buyerEmail: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ? email : undefined,
    });
    return Response.json({ ok: true, url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("order/checkout:", msg);
    // priceOrder throws guest-readable messages; Square errors start with "square".
    const guestMsg = msg.startsWith("square") || msg.includes("not set")
      ? "Payment could not be started. Please try again in a few minutes."
      : msg;
    return Response.json({ ok: false, error: guestMsg }, { status: 400 });
  }
}
