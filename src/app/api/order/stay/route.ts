// POST {lastName, arrival, booking, nights, guests} → the nights to (一棟貸しか部屋貸しかは日付から判定)
// order for + the live menu.
// 2026-11-06 社長決定：注文ページでは予約を照合しない（Booking.com → Lodgify の
// 同期に時間差があるため）。入力どおりに夜を並べて注文・決済を受け、部屋と
// 一棟貸しの確認は定時チェックが /api/order/link で後から紐づける。
import { applyHouseNights, buildNights, getMenuOptions } from "@/lib/mealOrder";
import { houseNights } from "@/lib/stay";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    lastName?: string;
    arrival?: string;
    booking?: string;
    nights?: number;
    guests?: number;
  };
  const lastName = String(body.lastName ?? "").trim();
  const booking = String(body.booking ?? "").replace(/[^0-9A-Za-z-]/g, "").slice(0, 30);
  if (!booking) return Response.json({ ok: false, error: "Please enter your Booking.com reservation number." }, { status: 400 });
  if (lastName.length < 2) return Response.json({ ok: false, error: "Please enter your last name." }, { status: 400 });
  let nights;
  try {
    nights = buildNights(String(body.arrival ?? "").trim(), Number(body.nights), "room", Number(body.guests));
  } catch (err) {
    return Response.json({ ok: false, error: err instanceof Error ? err.message : "Please check your details." }, { status: 400 });
  }
  try {
    // 一棟貸しか部屋貸しかは日付で判定（Lodgify で一棟貸しを売っている日）。読めなければ部屋貸し扱い
    // （一棟貸しに夕食が入っても /api/order/link が止めて社長に聞く）。
    const [menu, house] = await Promise.all([
      getMenuOptions(),
      houseNights(nights[0].date, nights[nights.length - 1].date).catch((err) => {
        console.error("order/stay: house lookup failed", err);
        return new Set<string>();
      }),
    ]);
    nights = applyHouseNights(nights, house);
    if (!menu) return Response.json({ ok: false, error: "The menu is temporarily unavailable. Please try again in a few minutes." }, { status: 503 });
    return Response.json({ ok: true, nights, menu });
  } catch (err) {
    console.error("order/stay:", err);
    return Response.json({ ok: false, error: "Something went wrong. Please try again in a few minutes." }, { status: 500 });
  }
}
