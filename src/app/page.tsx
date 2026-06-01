"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bike,
  BedDouble,
  Instagram,
  MapPin,
  Bath,
  UtensilsCrossed,
  Beer,
} from "lucide-react";

/** =================== CUSTOMIZE ZONE =====================
 *  Update links and image filenames here. All gallery files
 *  live under /public/gallery/ (case sensitive on Vercel).
 *  ======================================================== */
const INSTAGRAM_URL = "https://www.instagram.com/kashiwaya_nakasendo";
const GOOGLE_MAP_URL = "https://maps.app.goo.gl/ViXN6oJNxvjQkv2SA?g_st=ac";
const EBIKE_LP_URL = "https://kiso-ebike-lp.vercel.app/";
const WHATSAPP_URL =
  "https://wa.me/819038392354?text=Hello%20Kashiwaya%2C%20I%27d%20like%20to%20ask%20about%20a%20stay.";

const HERO_IMG = "/gallery/entrance.JPG";
const HOUSE_IMG = "/gallery/1stfloor.JPG";
const ONSEN_IMG = "/gallery/onsen1.jpg";
const FOOD_IMG = "/gallery/somen.jpg";
const DRINK_IMG = "/gallery/beer.jpg";
const BIKE_IMG = "/gallery/ebike1.jpg";
const GORGE_IMG = "/gallery/kakizore.JPG";
/** ====================================================== */

const PEOPLE = [
  {
    name: "Shu Ichikawa",
    role: "Owner",
    body: [
      "Fourth-generation owner of Kashiwaya, founded by the Ichikawa family.",
      "He has kept the house alive while moving between overseas, Tokyo, and Nagiso — protecting it through changing times.",
    ],
  },
  {
    name: "Kaku Ichikawa",
    role: "Craft Beer Creator",
    body: [
      "Eldest son of Shu Ichikawa.",
      "Based in Tokyo, he runs a hair salon and a brewery, and developed three Kashiwaya-exclusive beers.",
    ],
  },
  {
    name: "Hiroshi Kumagai",
    role: "Renovator",
    body: [
      "Moved from Tokyo in 2015 and renovated three kominka in Nagiso — one of them is Kashiwaya.",
      "He now runs \u201CYui-an,\u201D an iconic kominka hostel that has become a symbol of Nagiso.",
    ],
  },
  {
    name: "Yasuhiro Fukuta",
    role: "Master",
    body: [
      "The current operator of Kashiwaya.",
      "After visiting Nagiso many times from Nagoya, he began a dual-base life and apprenticed under Hiroshi Kumagai while working two jobs.",
      "Inspired by a year living in West Virginia, USA, his mission is to recreate that deep \u201Cdive into the local\u201D experience here in Nagiso.",
    ],
  },
] as const;

/** Lodgify 予約ボックス。
 *  同一 id="lodgify-book-now-box" を1ページに2個置くと2個目が描画されない
 *  ため、各部屋を別々の iframe（＝別ページ）に入れて公式コードをそのまま
 *  実行させる。高さは固定（JSなし）。 */
function buildLodgifyDoc(rentalId: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; background: transparent; font-family: "Outfit", Arial, sans-serif; }
  body { padding-bottom: 30px; }
  :root {
    --ldg-bnb-background: #ffffff;
    --ldg-bnb-border-radius: 0.42em;
    --ldg-bnb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1);
    --ldg-bnb-padding: 14px;
    --ldg-bnb-input-background: #ffffff;
    --ldg-bnb-button-border-radius: 3.58em;
    --ldg-bnb-color-primary: #fac600;
    --ldg-bnb-color-primary-lighter: #fde380;
    --ldg-bnb-color-primary-darker: #7d6300;
    --ldg-bnb-color-primary-contrast: #333333;
    --ldg-component-calendar-cell-selection-bg-color: #fac600;
    --ldg-component-calendar-cell-selection-color: #333333;
    --ldg-component-calendar-cell-selected-bg-color: #fde380;
    --ldg-component-calendar-cell-selected-color: #333333;
    --ldg-bnb-font-family: inherit;
  }
  #lodgify-book-now-box { width: 100%; }
</style>
</head>
<body>
<div
  id="lodgify-book-now-box"
  data-rental-id="${rentalId}"
  data-website-id="633228"
  data-slug="yasuo"
  data-language-code="en"
  data-new-tab="true"
  data-version="stable"
  data-has-guests-breakdown
  data-check-in-label='Check-in'
  data-check-out-label='Check-out'
  data-guests-label='Guests'
  data-guests-singular-label='{{NumberOfGuests}} guest'
  data-guests-plural-label='{{NumberOfGuests}} guests'
  data-location-input-label='Location'
  data-total-price-label='Total price:'
  data-select-dates-to-see-price-label='Select dates to see total price'
  data-minimum-price-per-night-first-label='From'
  data-minimum-price-per-night-second-label='per night'
  data-book-button-label='Book Now'
  data-guests-breakdown-label='Guests'
  data-adults-label='{"one":"adult","other":"adults"}'
  data-adults-description='Ages {minAge} or above'
  data-children-label='{"one":"child","other":"children"}'
  data-children-description='Ages {minAge}-{maxAge}'
  data-children-not-allowed-label='Not suitable for children'
  data-infants-label='{"one":"infant","other":"infants"}'
  data-infants-description='Under {maxAge}'
  data-infants-not-allowed-label='Not suitable for infants'
  data-pets-label='{"one":"pet","other":"pets"}'
  data-pets-not-allowed-label='Not allowed'
  data-done-label='Done'
></div>
<script src="https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js" defer></script>
</body>
</html>`;
}

function LodgifyBox({ rentalId }: { rentalId: string }) {
  return (
    <iframe
      title={"Booking " + rentalId}
      srcDoc={buildLodgifyDoc(rentalId)}
      scrolling="no"
      style={{
        display: "block",
        width: 320,
        maxWidth: "100%",
        margin: "1rem auto 0",
        height: 430, // 固定。上にボックス、下はカレンダーが開くスペース
        border: "none",
        background: "transparent",
      }}
    />
  );
}

export default function Page() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ============ NAV ============ */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#top" className="brand">
          Kashiwaya <em>Inn</em>
        </a>
        <div className="nav-links">
          <a href="#book">Book</a>
          <a href="#concept">Concept</a>
          <a href="#house">House</a>
          <a href="#bike">Bikes</a>
          <a href="#people">People</a>
        </div>
        <a href="#book" className="nav-book">
          Book <ArrowRight size={14} />
        </a>
      </nav>

      {/* ============ FLOATING BOOK ============ */}
      <a href="#book" className="float-book">
        <BedDouble size={16} /> Book a Stay
      </a>

      {/* ============ HERO ============ */}
      <header className="hero" id="top">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url('${HERO_IMG}')` }}
        />
        <div className="hero-inner">
          <span className="eyebrow">Nagiso · Kiso Valley · Mitsuno-juku</span>
          <h1>
            Dive into the local, <em>join into the history.</em>
          </h1>
          <p className="hero-lede">
            A 140-year-old kominka in the 41st post town on the Nakasendo —
            built in the style of a samurai inn, still home to the people who
            live here. Stay where the road has run for centuries.
          </p>
          <div className="hero-ctas">
            <a href="#book" className="btn-primary">
              Book your stay <ArrowRight size={16} />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Instagram size={15} /> Instagram
            </a>
            <a href={GOOGLE_MAP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <MapPin size={15} /> Find us
            </a>
          </div>
        </div>
      </header>

      {/* ============ MARQUEE ============ */}
      <div className="marquee">
        <div className="marquee-inner">
          <span>
            Built for samurai &nbsp;·&nbsp; 1885 &nbsp;·&nbsp; Mitsuno-juku, the
            41st post town &nbsp;·&nbsp; A kominka still lived in
            &nbsp;·&nbsp; Dive into the local &nbsp;·&nbsp;
          </span>
          <span aria-hidden="true">
            Built for samurai &nbsp;·&nbsp; 1885 &nbsp;·&nbsp; Mitsuno-juku, the
            41st post town &nbsp;·&nbsp; A kominka still lived in
            &nbsp;·&nbsp; Dive into the local &nbsp;·&nbsp;
          </span>
        </div>
      </div>

      {/* ============ BOOK DIRECT (Lodgify widget) ============ */}
      <section className="book-direct" id="book">
        <div className="book-direct-inner">
          <span className="eyebrow-dark">Book direct</span>
          <h2>
            Stay with us, <em>no middleman.</em>
          </h2>
          <p className="book-direct-lede">
            Two rooms in one kominka — pick the one that suits you. Same
            calendar, same rates, paid straight to the house.
          </p>

          <div className="room-grid">
            {/* ===== Room 1: Japanese-Style Room (1F) ===== */}
            <div className="room-card">
              <div className="room-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gallery/1fchess.jpg" alt="Japanese-Style Room — 1st historic floor" />
              </div>
              <div className="room-body">
                <h3>Japanese-Style Room</h3>
                <div className="room-sub">1st historic floor</div>
                <LodgifyBox rentalId="793793" />
              </div>
            </div>

            {/* ===== Room 2: Superior Family Room (2F) ===== */}
            <div className="room-card">
              <div className="room-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/gallery/2ndfloor.JPG" alt="Superior Family Room — 2nd modern floor" />
              </div>
              <div className="room-body">
                <h3>Superior Family Room</h3>
                <div className="room-sub">2nd modern floor</div>
                <LodgifyBox rentalId="793801" />
              </div>
            </div>
          </div>

          <p className="book-direct-foot">
            Questions? Message us on{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp →
            </a>
          </p>
        </div>
      </section>

      {/* ============ CONCEPT ============ */}
      <section id="concept">
        <div className="section-head">
          <span className="eyebrow-dark">The idea</span>
          <h2>
            Not just a place to sleep. <em>A way to enter the village.</em>
          </h2>
          <p>
            Most travellers pass through Tsumago and Magome and never see what
            happens after the buses leave. Kashiwaya is for the ones who stay —
            who eat what the family eats, drink what the locals drink, and
            sleep in a house that has watched the road for 140 years.
          </p>
        </div>
      </section>

      {/* ============ HOUSE (chapter 1) ============ */}
      <section className="chapter" id="house">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HOUSE_IMG} alt="The 140-year-old kominka of Kashiwaya" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">Chapter 01 · The House</span>
          <h3>
            Built in 1885 in the <em>samurai inn</em> style.
          </h3>
          <p>
            Kashiwaya sits in Mitsuno-juku — the 41st post town on the
            Nakasendo, right after Magome and Tsumago. The house was built in
            the same form as the honjin, the official inns where samurai
            travellers stayed when this road carried them between Edo and
            Kyoto.
          </p>
          <p>
            Fires through the centuries took many of the old houses, but a few
            kominka remain, still lived in. Kashiwaya is one of them. We&apos;re
            15 minutes on foot from Nagiso Station.
          </p>
          <div className="note">
            Mitsuno-juku · 三留野宿 · the 41st post town on the Nakasendo
          </div>
        </div>
      </section>

      {/* ============ BIKE (chapter 2) ============ */}
      <section className="chapter reverse" id="bike">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BIKE_IMG} alt="Fat-tire e-bikes parked at Kashiwaya" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">Chapter 02 · The Bikes</span>
          <h3>
            Free e-bikes for guests, <em>16:00 — 09:00.</em>
          </h3>
          <p>
            Our house fat-tire e-bikes are free for guests to use in the
            evenings and mornings. Roll over to the konbini, find a restaurant
            in the valley, ride to the nearby temples and shrines, or out to
            Momosuke Bridge before breakfast.
          </p>
          <div className="note">
            <Bike
              size={14}
              style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.4rem" }}
            />
            Two fat-tire e-bikes · helmet and lock included · just ring the bell
            or message us on WhatsApp before you ride.
          </div>
        </div>
      </section>

      {/* ============ FOOD (chapter 3) ============ */}
      <section className="chapter">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOOD_IMG} alt="Local kitchen, seasonal meal" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">Chapter 03 · The Food</span>
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

      {/* ============ DRINK (chapter 4) ============ */}
      <section className="chapter reverse">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DRINK_IMG} alt="Kashiwaya-exclusive craft beer" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">Chapter 04 · The Drink</span>
          <h3>
            Three craft beers, <em>brewed only for us.</em>
          </h3>
          <p>
            A local brewer makes three beers exclusively for Kashiwaya — you
            won&apos;t find them anywhere else. Alongside them, a small
            selection of local sake and wine, hand-picked by the master.
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

      {/* ============ ONSEN (chapter 5) ============ */}
      <section className="chapter" id="stay">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ONSEN_IMG} alt="Natural hot spring nearby" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">Chapter 05 · The Onsen</span>
          <h3>
            A natural hot spring, <em>fifteen minutes away.</em>
          </h3>
          <p>
            We&apos;ll drive you to and from a real local onsen, about 15
            minutes from the house. Mineral-rich water, the kind people in the
            valley have soaked in for generations. Free shuttle for guests, by
            request.
          </p>
          <p>
            Once your booking is confirmed, we&apos;ll send you a short form
            by DM. Tell us whether you&apos;d like the onsen shuttle and any
            other small things — meals, arrival time, anything we should know
            — and we&apos;ll plan the stay around you.
          </p>
          <div className="note">
            <Bath
              size={14}
              style={{ display: "inline", verticalAlign: "-2px", marginRight: "0.4rem" }}
            />
            Shuttle available daily, except Wednesdays (onsen closed).
          </div>
        </div>
      </section>

      {/* ============ ACTIVITIES CTA → ebike LP ============ */}
      <section className="activities-cta full">
        <div className="activities-cta-inner">
          <div className="activities-cta-text">
            <span className="eyebrow-light">During the day</span>
            <h3>
              Looking for an <em>activity?</em>
            </h3>
            <p>
              The master also runs guided e-bike tours and rentals during the
              day — the routes only the people who grew up here know. If you
              want something before check-in or after check-out, ask through
              the site below.
            </p>
            <a href={EBIKE_LP_URL} target="_blank" rel="noopener noreferrer" className="cta-btn">
              See Beyond Nakasendo Cycling <ArrowRight size={16} />
            </a>
          </div>
          <div className="activities-cta-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GORGE_IMG} alt="The Kiso valley off the main road" />
          </div>
        </div>
      </section>

      {/* ============ PEOPLE ============ */}
      <section className="people" id="people">
        <div className="people-inner">
          <div className="section-head">
            <span className="eyebrow-dark">The people</span>
            <h2>
              The hands <em>behind the house.</em>
            </h2>
            <p>
              Four people, one house — keeping it lived-in across four
              generations.
            </p>
          </div>
          <div className="people-grid">
            {PEOPLE.map((p) => (
              <div key={p.name} className="person">
                <div className="person-role">{p.role}</div>
                <h4>{p.name}</h4>
                {p.body.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="faq" id="faq">
        <div className="section-head">
          <span className="eyebrow-dark">Practicalities</span>
          <h2>
            A few <em>good things to know.</em>
          </h2>
        </div>
        <details className="faq-item">
          <summary>How do I get there?</summary>
          <p>
            Nagiso Station on the JR Chuo line, then 15 minutes on foot to
            Kashiwaya in Mitsuno-juku (Nagiso 4181). We can also pick you up
            from the station — just tell us in advance.
          </p>
        </details>
        <details className="faq-item">
          <summary>Is the onsen shuttle really free?</summary>
          <p>
            Yes, free for guests, by request. About 15 minutes by car each way.
            The onsen itself is closed on Wednesdays.
          </p>
        </details>
        <details className="faq-item">
          <summary>I have a dietary restriction (vegan, gluten-free, etc.).</summary>
          <p>
            Tell us when you book on our site, or send us a WhatsApp message.
            We cook around your needs — wagyu through to vegan and
            gluten-free.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can I just use the e-bike during my stay?</summary>
          <p>
            If you&apos;re staying with us, yes — free, between 16:00 and 09:00.
            Ring the bell at the desk or message us on WhatsApp before you
            ride.
          </p>
        </details>
        <details className="faq-item">
          <summary>What about during the day?</summary>
          <p>
            During the day the bikes are used for guided tours and rentals by
            Beyond Nakasendo Cycling. If you want a guided ride before
            check-in or after check-out, book through their site.
          </p>
        </details>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <div className="ft-brand">Kashiwaya Inn</div>
            <p>
              A 140-year-old kominka in Mitsuno-juku, the 41st post town on
              the Nakasendo. Nagiso 4181, Kiso, Nagano.
            </p>
            <p>15 minutes&apos; walk from Nagiso Station (JR Chuo line).</p>
          </div>
          <div>
            <h5>Book &amp; ask</h5>
            <a href="#book">
              Check availability &amp; book
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              WhatsApp · +81 90-3839-2354
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={GOOGLE_MAP_URL} target="_blank" rel="noopener noreferrer">
              Google Maps
            </a>
          </div>
          <div>
            <h5>During the day</h5>
            <a href={EBIKE_LP_URL} target="_blank" rel="noopener noreferrer">
              Beyond Nakasendo Cycling →
            </a>
            <p style={{ marginTop: "0.4rem" }}>
              Guided e-bike rides and rentals, run by the master of the house.
            </p>
          </div>
        </div>
        <div className="ft-bottom">
          © Kashiwaya Inn · Mitsuno-juku, Nagiso, Kiso Valley.
        </div>
      </footer>
    </>
  );
}
