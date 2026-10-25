import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, UtensilsCrossed, Beer } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { MARUSHO_SITE_URL, WHATSAPP_URL_EN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dining — Dinner & Breakfast",
  description:
    "Nabe dinners and ochazuke breakfasts cooked by the chef next door, craft beer brewed only for Kashiwaya — and dinner delivery by Marusho on whole-house dates.",
  alternates: {
    canonical: "/dining",
    languages: { en: "/dining", ja: "/ja/dining", "x-default": "/dining" },
  },
};

const FOOD_IMG = "/gallery/somen.jpg";
const DRINK_IMG = "/gallery/beer.jpg";

export default function DiningPage() {
  return (
    <>
      <SiteNav lang="en" solid />

      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">Dining</span>
          <h2>
            Dinner &amp; breakfast, <em>cooked by the chef next door.</em>
          </h2>
        </div>
      </div>

      {/* ============ FOOD OPTION ============ */}
      <section className="food-option" id="food">
        <div className="section-head">
          <span className="eyebrow-dark">Food option</span>
          <h2>
            Reserved in advance, <em>cooked around you.</em>
          </h2>
          <p>
            Meals at Kashiwaya are optional and reserved in advance — a
            traditional nabe dinner and an ochazuke breakfast, cooked around
            any dietary needs. Booking direct on this site? Add them at
            checkout when you book your room. Booked via Booking.com?
            Order your meals on WhatsApp.
          </p>
        </div>
        <div className="meal-order">
          <div className="meal-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FOOD_IMG}
              alt="Dinner at Kashiwaya — chilled somen and seasonal dishes"
              loading="lazy"
              decoding="async"
            />
          </div>
          <ul className="food-menu">
            <li>
              <span>Chicken hot pot dinner (serves 2 / 3)</span>
              <span>¥6,000 / ¥8,000</span>
            </li>
            <li>
              <span>Pork shabu-shabu hot pot dinner (serves 2 / 3)</span>
              <span>¥8,000 / ¥11,000</span>
            </li>
            <li>
              <span>Pork chilled shabu (rei-shabu) dinner (serves 2 / 3)</span>
              <span>¥8,000 / ¥11,000</span>
            </li>
            <li>
              <span>Wagyu sukiyaki dinner (serves 2 / 3)</span>
              <span>¥10,000 / ¥14,000</span>
            </li>
            <li>
              <span>Vegan gluten-free hot pot dinner (serves 2 / 3)</span>
              <span>¥8,000 / ¥11,000</span>
            </li>
            <li>
              <span>Vegan gluten-free chilled pot dinner (serves 2 / 3)</span>
              <span>¥8,000 / ¥11,000</span>
            </li>
            <li>
              <span>Ochazuke breakfast set (vegan &amp; gluten-free)</span>
              <span>¥1,500 / person</span>
            </li>
          </ul>
          <Link href="/stay#book" className="meal-cta">
            Book your stay &amp; add meals at checkout <ArrowRight size={16} />
          </Link>
          <ul className="meal-note">
            <li>
              <strong>Booking direct on this site?</strong> Choose your meals
              as add-ons at checkout (each menu once per stay). Staying one
              night? Nothing more to do. Staying longer? Tell us on WhatsApp
              which order you&apos;d like on which date — e.g. staying
              Oct 3–6 and you&apos;d like sukiyaki on the 3rd and shabu-shabu
              on the 5th: add both sets at checkout, then message us
              &quot;Sukiyaki on the 3rd, Shabu-shabu on the 5th&quot;. Same
              for breakfast mornings.
            </li>
            <li>
              <strong>Booked via Booking.com?</strong> Meal add-ons aren&apos;t
              available there — order your meals on{" "}
              <a href={WHATSAPP_URL_EN} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>{" "}
              instead.
            </li>
            <li>
              Order at least <strong>3 days before your stay</strong>.
            </li>
            <li>
              Travelling solo? One dinner set per day at{" "}
              <strong>half the two-person price</strong> (not available for
              wagyu sukiyaki) — message us on
              WhatsApp.
            </li>
            <li>
              Cancellation is free until 4 days before your stay;
              non-refundable from 3 days before.
            </li>
            <li>
              <strong>Luggage transport</strong> and <strong>activities</strong>{" "}
              before check-in / after check-out can also be arranged on
              WhatsApp.
            </li>
            <li>
              Booking the <strong>whole house</strong>? Kashiwaya&apos;s
              dinner isn&apos;t available on those unmanned dates &mdash;
              see the delivery menu just below. Breakfast can be ordered
              as usual.
            </li>
          </ul>
        </div>

        <div className="meal-order" id="marusho">
          <div className="meal-order-head">
            <UtensilsCrossed size={22} className="meal-icon" />
            <h3>Whole-house dates &mdash; dinner, delivered</h3>
            <p>
              Kashiwaya&apos;s own dinner isn&apos;t available for the
              unmanned whole-house rental, but eating well is still easy:{" "}
              <strong>Marusho</strong>, a local shop, delivers dinner
              straight to Kashiwaya.
            </p>
          </div>
          <a
            href={MARUSHO_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="meal-cta"
          >
            Open the Marusho order page <ArrowRight size={16} />
          </a>
          <ul className="meal-note">
            <li>
              Pick your dishes on the order page (photo menu &mdash; dinner
              sets ¥1,500–¥3,500 with vegetarian/vegan options, breakfast
              set ¥1,500, drinks), set the quantities, fill in the date,
              delivery time and your name &mdash; it then opens WhatsApp
              with the order message already written. Just press send.
            </li>
            <li>
              Payment is made locally to Marusho (credit cards accepted,
              5% card fee). Please order in advance where possible.
            </li>
            <li>
              Prefer Kashiwaya&apos;s <strong>ochazuke breakfast set
              (¥1,500 per person)</strong>? It&apos;s available for
              whole-house stays too &mdash; add it at checkout when booking
              direct, or order it on WhatsApp if you booked via Booking.com.
            </li>
          </ul>
        </div>
      </section>

      {/* ============ FOOD CHAPTER ============ */}
      <section className="chapter reverse">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOOD_IMG} alt="Local kitchen, seasonal meal" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">The Food</span>
          <h3>
            What a Japanese family eats <em>on a special day.</em>
          </h3>
          <p>
            Not the menu you find in a Japanese restaurant. The food a family
            in this valley would put on the table for a celebration — a
            traditional nabe at dinner, ochazuke at breakfast. Quiet, seasonal,
            careful.
          </p>
          <p>
            Wagyu to vegan, gluten-free if you need it — tell us when you book
            and we&apos;ll cook around you.
          </p>
          <div className="note">
            <UtensilsCrossed
              size={14}
              style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.4rem" }}
            />
            Dinner: traditional nabe · Breakfast: ochazuke.
          </div>
        </div>
      </section>

      {/* ============ DRINK CHAPTER ============ */}
      <section className="chapter">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DRINK_IMG} alt="Kashiwaya-exclusive craft beer" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">The Drink</span>
          <h3>
            Three craft beers, <em>brewed only for us.</em>
          </h3>
          <p>
            A brewery run by the owner&apos;s family makes three beers
            exclusively for Kashiwaya — you won&apos;t find them anywhere else.
            Alongside them, a small selection of local sake and wine, hand-picked
            by the master.
          </p>
          <div className="note">
            <Beer
              size={14}
              style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.4rem" }}
            />
            Three exclusive craft beers · curated local sake and wine.
          </div>
        </div>
      </section>

      <SiteFooter lang="en" />
      <ChatWidget />
    </>
  );
}
