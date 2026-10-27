import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { getOrder, isPaid, setOrderMetadata, type SquareOrder } from "@/lib/square";
import { appendDmOrders, type DmOrderRow } from "@/lib/sheetWrite";
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
  try {
    await appendDmOrders(rows);
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
  try {
    if (orderId) order = await getOrder(orderId);
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
