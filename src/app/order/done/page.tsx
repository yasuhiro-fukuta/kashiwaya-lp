import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { findOrdersForGuest, getOrder, isPaid, setOrderMetadata, type SquareOrder } from "@/lib/square";
import { appendDmOrders, appendOverrides, type DmOrderRow, type OverrideRow } from "@/lib/sheetWrite";
import { todayJst } from "@/lib/mealOrder";
import { WHATSAPP_URL_EN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Meal order confirmed",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/** Write the paid order to the sheet once (guarded by order metadata). */
async function logOnce(order: SquareOrder): Promise<"logged" | "already" | "failed"> {
  if (order.metadata?.logged === "1") return "already";
  const md = order.metadata ?? {};
  const rows: DmOrderRow[] = (order.line_items ?? [])
    .filter((li) => li.metadata?.date && li.metadata?.item)
    .map((li) => {
      const m = li.metadata!;
      const isDinner = m.kind === "dinner";
      return {
        date: m.date,
        room: m.room === "2F" ? "2F" : "1F",
        guest: md.guest ?? "",
        item: m.item,
        persons: Number(m.persons) || 1,
        time: isDinner ? md.time ?? "" : "",
        channel: "Booking",
        dmDate: todayJst(),
        status: "有効",
        memo: [
          "注文ページ（Square支払済）",
          `${li.name} ×${li.quantity}`,
          isDinner && md.rice ? `ご飯:${md.rice}` : "",
          `Booking予約番号:${md.booking ?? "?"}`,
          `Square注文:${order.id}`,
        ].filter(Boolean).join(" / "),
      };
    });
  // One CleaningOverride row per night+room, every item marked "(paid)" so
  // staff on site never charge it again. The batch keys overrides by
  // night+room and the LAST row wins, so the row must carry every paid item
  // of that night — including earlier orders from this page by the same
  // guest (a second order for the same night would otherwise hide the first).
  const nightsHere = new Set(
    (order.line_items ?? [])
      .filter((li) => li.metadata?.date && li.metadata?.label)
      .map((li) => `${li.metadata!.date}|${li.metadata!.room === "2F" ? "2F" : "1F"}`),
  );
  let paidOrders: SquareOrder[] = [order];
  try {
    const others = await findOrdersForGuest(md.guest ?? "");
    paidOrders = [order, ...others.filter((o) => o.id !== order.id && isPaid(o))];
  } catch (err) {
    console.error("order/done: could not look up earlier orders", err);
  }
  const byNight = new Map<string, OverrideRow>();
  for (const o of paidOrders) {
    for (const li of o.line_items ?? []) {
      const m = li.metadata;
      if (!m?.date || !m?.label) continue;
      const room = m.room === "2F" ? "2F" : "1F";
      const k = `${m.date}|${room}`;
      if (!nightsHere.has(k)) continue; // only rewrite nights this order touches
      const part = `(paid) ${m.label}(${Number(m.persons) || 1}人前)`;
      const cur = byNight.get(k);
      if (cur) {
        cur.meal += `, ${part}`;
        if (!cur.memo!.includes(o.id)) cur.memo += ` ${o.id}`;
      } else {
        byNight.set(k, { date: m.date, room, meal: part, memo: `注文ページ Square支払済 ${o.id}` });
      }
    }
  }
  try {
    await appendDmOrders(rows);
    await appendOverrides([...byNight.values()]);
    await setOrderMetadata(order, { logged: "1" }).catch((e) => console.error("order/done: metadata", e));
    return "logged";
  } catch (err) {
    console.error("order/done: sheet write failed", order.id, err);
    return "failed";
  }
}

export default async function OrderDonePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  let order: SquareOrder | null = null;
  // Square redirects here right after payment, sometimes before the tender
  // is attached to the order — so wait for it (up to ~15s) instead of
  // reporting "couldn't confirm" on a payment that did go through.
  try {
    for (let i = 0; orderId && i < 8; i++) {
      order = await getOrder(orderId);
      if (order.metadata?.src !== "kashiwaya-order" || isPaid(order)) break;
      await new Promise((r) => setTimeout(r, 2000));
    }
  } catch (err) {
    console.error("order/done: getOrder", err);
  }
  const ours = order?.metadata?.src === "kashiwaya-order";
  const paid = order && ours && isPaid(order);
  if (order && paid) await logOnce(order);

  return (
    <>
      <SiteNav lang="en" solid />
      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">Meal order</span>
          <h2>{paid ? <>Thank you — <em>your meals are booked.</em></> : <>We couldn&apos;t confirm <em>your payment.</em></>}</h2>
        </div>
      </div>
      <section className="order-page">
        {paid && order ? (
          <>
            <ul className="order-summary">
              {(order.line_items ?? []).map((li, i) => (
                <li key={i}>
                  {li.name} × {li.quantity}
                </li>
              ))}
            </ul>
            <p>
              Total paid: ¥{(order.total_money?.amount ?? 0).toLocaleString("en-US")}. A receipt has been
              sent by Square. Dinner is served at {order.metadata?.time}; breakfast is left in your fridge the
              night before.
            </p>
            <p>
              Need to change something? Message us on{" "}
              <a href={WHATSAPP_URL_EN}>WhatsApp</a> at least 3 days before.
            </p>
          </>
        ) : (
          <p>
            If you completed the payment, don&apos;t worry — please send us a message on{" "}
            <a href={WHATSAPP_URL_EN}>WhatsApp</a> and we&apos;ll check it for you.{" "}
            <Link href="/order">Back to the order page</Link>
          </p>
        )}
      </section>
      <SiteFooter lang="en" />
    </>
  );
}
