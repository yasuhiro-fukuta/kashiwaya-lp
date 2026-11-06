// POST {lastName, arrival, booking, nights, stayType, guests} → the nights to
// order for + the live menu.
// 2026-11-06 社長決定：注文ページでは予約を照合しない（Booking.com → Lodgify の
// 同期に時間差があるため）。入力どおりに夜を並べて注文・決済を受け、部屋と
// 一棟貸しの確認は定時チェックが /api/order/link で後から紐づける。
import { buildNights, getMenuOptions } from "@/lib/mealOrder";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    lastName?: string;
    arrival?: string;
    booking?: string;
    nights?: number;
    stayType?: string;
    guests?: number;
  };
  const lastName = String(body.lastName ?? "").trim();
  const booking = String(body.booking ?? "").replace(/[^0-9A-Za-z-]/g, "").slice(0, 30);
  if (!booking) return Response.json({ ok: false, error: "Please enter your Booking.com reservation number." }, { status: 400 });
  if (lastName.length < 2) return Response.json({ ok: false, error: "Please enter your last name." }, { status: 400 });
  let nights;
  try {
    nights = buildNights(String(body.arrival ?? "").trim(), Number(body.nights), String(body.stayType ?? ""), Number(body.guests));
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "Please check your details." }, { status: 400 });
  }
  try {
    const menu = await getMenuOptions();
    if (!menu) return Response.json({ ok: false, error: "The menu is temporarily unavailable. Please try again in a few minutes." }, { status: 503 });
    return Response.json({ ok: true, nights, menu });
  } catch (err) {
    console.error("order/stay:", err);
    return Response.json({ ok: false, error: "Something went wrong. Please try again in a few minutes." }, { status: 500 });
  }
}
