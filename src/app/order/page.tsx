import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import OrderForm from "./OrderForm";

export const metadata: Metadata = {
  title: "Order meals for your stay",
  description: "Booked via Booking.com? Order Kashiwaya's nabe dinner and ochazuke breakfast here and pay online.",
  robots: { index: false, follow: false },
};

export default function OrderPage() {
  return (
    <>
      <SiteNav lang="en" solid />
      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">Meal order</span>
          <h2>
            Order meals <em>for your stay.</em>
          </h2>
          <p>
            For guests who booked via Booking.com. Choose dinner and breakfast for each night and pay
            online — orders close 3 days before each night.
          </p>
        </div>
      </div>
      <section className="order-page">
        <OrderForm />
      </section>
      <SiteFooter lang="en" />
    </>
  );
}
