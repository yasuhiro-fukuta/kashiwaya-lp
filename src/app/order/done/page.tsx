import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { getOrder, isPaid, type SquareOrder } from "@/lib/square";
import { WHATSAPP_URL_EN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Meal order confirmed",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function OrderDonePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; transactionId?: string }>;
}) {
  const { orderId, transactionId } = await searchParams;
  let order: SquareOrder | null = null;
  // Square redirects here right after payment, sometimes before the tender
  // is attached to the order — so wait for it (up to ~15s) instead of
  // reporting "couldn't confirm" on a payment that did go through.
  // Right after the redirect Square can still answer 404 / an error for the
  // brand-new order, so an error must not end the wait (2026-11-07 13:34: a
  // paid ¥20,000 order showed "couldn't confirm" because the first read threw).
  for (let i = 0; orderId && i < 8; i++) {
    try {
      order = await getOrder(orderId);
      if (order.metadata?.src !== "kashiwaya-order" || isPaid(order)) break;
    } catch (err) {
      console.error("order/done: getOrder", err);
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  const ours = order?.metadata?.src === "kashiwaya-order";
  const paid = order && ours && isPaid(order);
  // Square only adds transactionId to the redirect after the card payment
  // went through, so with it the payment is real even when the order can't
  // be read yet: never show "couldn't confirm" in that case.
  const received = !paid && !!transactionId && (ours || !order);
  // The sheet is written later by /api/order/link (定時チェック), once the
  // order is linked to the booking (2026-11-06 社長決定).

  return (
    <>
      <SiteNav lang="en" solid hideBook />
      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">Meal order</span>
          <h2>
            {paid || received ? (
              <>Thank you — <em>your meals are booked.</em></>
            ) : (
              <>We couldn&apos;t confirm <em>your payment.</em></>
            )}
          </h2>
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
              sent by Square. We&apos;ll confirm the dinner time at check-in; breakfast is left in your fridge
              the night before. We&apos;ll match your order to your Booking.com reservation — no need to do
              anything else.
            </p>
            <p>
              Need to change something? Message us on{" "}
              <a href={WHATSAPP_URL_EN}>WhatsApp</a> at least 3 days before.
            </p>
          </>
        ) : received ? (
          <>
            {order && (
              <ul className="order-summary">
                {(order.line_items ?? []).map((li, i) => (
                  <li key={i}>
                    {li.name} × {li.quantity}
                  </li>
                ))}
              </ul>
            )}
            <p>
              Your payment has been received — Square will email you a receipt shortly. We&apos;ll match
              your order to your Booking.com reservation, so there is nothing else to do.
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
