// POST OrderRequest → a Square hosted checkout URL.
// Re-checked server-side: the nights (from what the guest typed), the order
// deadline and the prices (from the「メニュー」sheet). The client never sends
// a price.
// 2026-11-06 社長決定：ここでは予約を照合しない。支払い済みの注文は
// /api/order/link（定時チェックが呼ぶ）が Booking 予約番号で Lodgify の予約に
// 紐づけてから、シート（DMからの食事注文・CleaningOverride）に書く。
import { randomUUID } from "crypto";
import { applyHouseNights, buildNights, getMenuOptions, priceOrder, type OrderRequest } from "@/lib/mealOrder";
import { houseNights } from "@/lib/stay";
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
  const arrival = String(body.arrival ?? "").trim();
  // Don't take money we can't record: paid orders are written to the sheet.
  if (!process.env.SHEET_WRITE_URL || !process.env.SHEET_WRITE_TOKEN) {
    return Response.json({
      ok: false,
      error: "Online meal orders are temporarily unavailable. Please message us on WhatsApp (+81 90 3839 2354) to order.",
    }, { status: 503 });
  }
  if (!booking) return Response.json({ ok: false, error: "Please enter your Booking.com reservation number." }, { status: 400 });
  if (lastName.length < 2) return Response.json({ ok: false, error: "Please enter your last name." }, { status: 400 });

  try {
    let nights = buildNights(arrival, Number(body.nights), "room", Number(body.guests));
    const [menu, house] = await Promise.all([
      getMenuOptions(),
      houseNights(nights[0].date, nights[nights.length - 1].date).catch((err) => {
        console.error("order/checkout: house lookup failed", err);
        return new Set<string>();
      }),
    ]);
    nights = applyHouseNights(nights, house);
    const stayType = nights.some((n) => n.wholeHouse) ? "house" : "room";
    if (!menu) {
      return Response.json({ ok: false, error: "The menu is temporarily unavailable. Please try again in a few minutes." }, { status: 503 });
    }
    const priced = priceOrder({ ...body, booking, lastName }, nights, menu);

    const lineItems = priced.map((l) => ({
      name: `${shortDate(l.date)} · ${l.option.label}`,
      quantity: String(l.sets),
      base_price_money: { amount: l.option.price, currency: "JPY" as const },
      metadata: {
        date: l.date,
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
        lastName: lastName.slice(0, 200),
        arrival,
        nights: String(nights.length),
        stayType,
        guests: String(nights[0].guests),
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
    // buildNights / priceOrder throw guest-readable messages; Square errors start with "square".
    const guestMsg = msg.startsWith("square") || msg.includes("not set")
      ? "Payment could not be started. Please try again in a few minutes."
      : msg;
    return Response.json({ ok: false, error: guestMsg }, { status: 400 });
  }
}
