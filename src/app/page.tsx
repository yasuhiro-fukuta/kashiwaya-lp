"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  Instagram,
  MapPin,
  UtensilsCrossed,
  Beer,
} from "lucide-react";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import LodgifyBox from "@/components/LodgifyBox";

/** =================== CUSTOMIZE ZONE =====================
 *  Update links and image filenames here. All gallery files
 *  live under /public/gallery/ (case sensitive on Vercel).
 *  ======================================================== */
const INSTAGRAM_URL = "https://www.instagram.com/kashiwaya_nakasendo";
const GOOGLE_MAP_URL = "https://maps.app.goo.gl/ViXN6oJNxvjQkv2SA?g_st=ac";
const EBIKE_LP_URL = "https://kiso-ebike-lp.vercel.app/";
const WHATSAPP_URL =
  "https://wa.me/819038392354?text=Hello%20Kashiwaya%2C%20I%27d%20like%20to%20ask%20about%20a%20stay.";
const MEAL_ORDER_URL = "https://kashiwaya-inn.square.site/s/shop";
const MEAL_FORM_URL = "https://forms.gle/7fK7JEcQ9yMG2wFu9";

const HERO_IMG = "/gallery/entrance.JPG";
const HOUSE_IMG = "/gallery/1stfloor.JPG";
const FOOD_IMG = "/gallery/somen.jpg";
const DRINK_IMG = "/gallery/beer.jpg";
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
          <a href="#people">People</a>
          <Link href="/ja">日本語</Link>
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
          <span className="eyebrow">Nagiso · Kiso Valley · Midono-juku</span>
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
            Built for samurai &nbsp;·&nbsp; 1885 &nbsp;·&nbsp; Midono-juku, the
            41st post town &nbsp;·&nbsp; A kominka still lived in
            &nbsp;·&nbsp; Dive into the local &nbsp;·&nbsp;
          </span>
          <span aria-hidden="true">
            Built for samurai &nbsp;·&nbsp; 1885 &nbsp;·&nbsp; Midono-juku, the
            41st post town &nbsp;·&nbsp; A kominka still lived in
            &nbsp;·&nbsp; Dive into the local &nbsp;·&nbsp;
          </span>
        </div>
      </div>

      {/* ============ BOOK DIRECT (Lodgify rooms + Square meals) ============ */}
      <section className="book-direct" id="book">
        <div className="book-direct-inner">
          <span className="eyebrow-dark">Book direct</span>
          <h2>
            No middleman, <em>just us.</em>
          </h2>
          <p className="book-direct-lede">
            Book direct, skip the platforms — and deal with real people, not a
            front desk. We host you ourselves, from the first message to the
            last morning. Two rooms in one kominka; pick the one that suits you.
          </p>

          {/* ----- Step 1 · the room ----- */}
          <div className="book-step">
            <span className="step-num">1</span> Book your room
          </div>

          <div className="room-grid">
            {/* ===== Room 1: Japanese-Style Room (1F) ===== */}
            <div className="room-card">
              <div className="room-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gallery/1fchess.jpg"
                  alt="Japanese-Style Room — 1st historic floor"
                  loading="lazy"
                  decoding="async"
                />
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
                <img
                  src="/gallery/2ndfloor.JPG"
                  alt="Superior Family Room — 2nd modern floor"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="room-body">
                <h3>Superior Family Room</h3>
                <div className="room-sub">2nd modern floor</div>
                <LodgifyBox rentalId="793801" />
              </div>
            </div>
          </div>

          {/* ----- bridge note → meals ----- */}
          <p className="meal-lead">
            Staying with us? Reserve your meals in step 2 below — and please keep
            your room booking confirmation number handy, you&apos;ll need it when
            you order.
          </p>

          {/* ----- Step 2 · the meals (Square) ----- */}
          <div className="book-step">
            <span className="step-num">2</span> Add your meals
          </div>

          <div className="meal-order">
            <div className="meal-order-head">
              <UtensilsCrossed size={22} className="meal-icon" />
              <h3>Dinner &amp; breakfast</h3>
              <p>
                Rooms and meals are booked separately. Once your room is set
                above, reserve your meals here — a traditional nabe for dinner,
                ochazuke for breakfast, cooked around any dietary needs.
              </p>
            </div>

            <a
              href={MEAL_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="meal-cta"
            >
              Reserve meals <ArrowRight size={16} />
            </a>

            <ul className="meal-note">
              <li>
                Please order at least <strong>3 days before your stay</strong>.
              </li>
              <li>
                Use the <strong>same email address and name</strong> you used
                for your room booking.
              </li>
              <li>
                For multi-night stays, please place a{" "}
                <strong>separate order for each night</strong>.
              </li>
            </ul>
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
          <img src={HOUSE_IMG} alt="The 140-year-old kominka of Kashiwaya" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">Chapter 01 · The House</span>
          <h3>
            Built in 1885 in the <em>samurai inn</em> style.
          </h3>
          <p>
            Kashiwaya sits in Midono-juku — the 41st post town on the
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
            Midono-juku · 三留野宿 · the 41st post town on the Nakasendo
          </div>
        </div>
      </section>

      {/* ============ FOOD (chapter 2) ============ */}
      <section className="chapter reverse">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FOOD_IMG} alt="Local kitchen, seasonal meal" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">Chapter 02 · The Food</span>
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

      {/* ============ DRINK (chapter 3) ============ */}
      <section className="chapter">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={DRINK_IMG} alt="Kashiwaya-exclusive craft beer" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">Chapter 03 · The Drink</span>
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
            <img src={GORGE_IMG} alt="The Kiso valley off the main road" loading="lazy" decoding="async" />
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
            Kashiwaya in Midono-juku (Nagiso 3993). If you need a ride, the
            manager will help you arrange a taxi — just tell us in advance.
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
          <summary>How do I reserve dinner and breakfast?</summary>
          <p>
            Meals are booked separately from your room, through the &ldquo;Add
            your meals&rdquo; link in the booking section. Use the same email
            and name as your room booking, and add your room booking date(s) and
            any dietary restrictions in the notes field when you order. Meal
            orders are accepted up to 3 days before your stay, so please reserve
            in advance.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can I cancel a meal order?</summary>
          <p>
            Yes — cancellation is free with a full refund up to 4 days before
            your stay. From 3 days before onward, meal orders are
            non-refundable, as the meals are already being prepared. To cancel,
            please message us on WhatsApp.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can I rent an e-bike?</summary>
          <p>
            Yes — the master runs guided e-bike tours and rentals through
            Beyond Nakasendo Cycling. Daytime use is ¥4,000 per bike per day
            (10:00 — 15:00). Book through their site.
          </p>
        </details>
        <details className="faq-item">
          <summary>What are the check-in and check-out times?</summary>
          <p>
            Check-in is 16:00 — 18:00. Arriving early? You can drop your
            luggage and explore, and we&apos;ll do the house tour and formal
            check-in after 16:00. Arriving late? Message us on WhatsApp when
            you reach the entrance — the host lives just across the street.
            Check-out is by 10:00, with no procedure: leave whenever
            you&apos;re ready.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can you pick me up from Nagiso Station or Tsumago?</summary>
          <p>
            Yes — Nagiso Station, Tsumago and Junikane Station are within our
            free pick-up area between 16:00 and 18:00. Just ask in advance.
            For departures we can call a taxi for you on the day.
          </p>
        </details>
        <details className="faq-item">
          <summary>How much are dinner and breakfast?</summary>
          <p>
            Dinner sets serve two people and range from ¥6,000 (chicken hot
            pot) to ¥10,000 (wagyu BBQ), with shabu-shabu, wagyu sukiyaki and
            vegan sets in between. Travelling solo? One set per day can be
            ordered at half the two-person price. The ochazuke breakfast set
            (vegan &amp; gluten-free) is ¥3,000.
          </p>
        </details>
        <details className="faq-item">
          <summary>Is there Wi-Fi?</summary>
          <p>Yes — free Wi-Fi throughout the house.</p>
        </details>
        <details className="faq-item">
          <summary>Do I need cash?</summary>
          <p>
            Kashiwaya itself takes card payments for meals and drinks, but
            most local restaurants — and all local buses and trains — are
            cash-only, and can&apos;t change notes larger than ¥1,000. Bring a
            stack of ¥1,000 notes. The nearest ATM is at the 7-Eleven, about
            20 minutes on foot.
          </p>
        </details>
        <details className="faq-item">
          <summary>Are the bathrooms shared? Is there a bath?</summary>
          <p>
            The shower room, sink and kitchen are shared; toilets are private
            (the private toilet for second-floor guests is on the first
            floor). There&apos;s no bathtub — if you want a proper soak, a
            natural day-trip onsen is a short drive away and we can arrange a
            taxi, or drive you ourselves when we&apos;re free.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can I do laundry?</summary>
          <p>
            First-floor guests have a washer-dryer to use. Otherwise
            there&apos;s a coin laundry about 15 minutes&apos; walk away.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can you forward my luggage to my next stop?</summary>
          <p>
            Between Magome and Tsumago there&apos;s a no-reservation luggage
            shuttle. Between Nagiso and Nojiri stations we run one ourselves —
            just ask. For the wider Kiso area (Matsumoto to Nakatsugawa), NLTS
            and Walk Lite offer luggage transfer with advance booking.
          </p>
        </details>
        <details className="faq-item">
          <summary>Are there bears on the trails?</summary>
          <p>
            Asian black bears do live in these mountains, but fixed bells
            along the Magome Pass trail mean no sightings there for about a
            decade. Bears avoid people and almost always run first; the only
            real risk is surprising a mother with cubs. If you&apos;re
            worried, we rent bear bells and bear spray.
          </p>
        </details>
        <details className="faq-item">
          <summary>How hard is the Magome Pass walk?</summary>
          <p>
            Easy — sneakers are fine (sandals aren&apos;t recommended). In
            winter, strap-on spikes for icy patches are a good idea; we rent
            those too.
          </p>
        </details>
        <details className="faq-item">
          <summary>House rules — smoking, pets, quiet hours?</summary>
          <p>
            No pets, and no smoking inside the wooden house — the courtyard
            is fine. Photos and videos are all OK (sharing them motivates
            us!). Local residents rise early, so please keep quiet after
            21:00.
          </p>
        </details>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div>
            <div className="ft-brand">Kashiwaya Inn</div>
            <p>
              A 140-year-old kominka in Midono-juku, the 41st post town on
              the Nakasendo. Nagiso 3993, Kiso, Nagano.
            </p>
            <p>15 minutes&apos; walk from Nagiso Station (JR Chuo line).</p>
          </div>
          <div>
            <h5>Book &amp; ask</h5>
            <a href="#book">
              Check availability &amp; book
            </a>
            <a href={MEAL_ORDER_URL} target="_blank" rel="noopener noreferrer">
              Reserve meals
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
            <h5 style={{ marginTop: "1.2rem" }}>Guides</h5>
            <Link href="/guide/tsumago-magome-day-walk">
              Tsumago–Magome day walk
            </Link>
            <Link href="/guide/rainy-day-in-kiso">Rainy days in the Kiso</Link>
            <Link href="/guide/kiso-valley-ebike-day">
              Gorges &amp; rivers by e-bike
            </Link>
            <p style={{ marginTop: "1.2rem" }}>
              <Link href="/ja">日本語ページはこちら →</Link>
            </p>
          </div>
        </div>
        <div className="ft-bottom">
          © Kashiwaya Inn · Midono-juku, Nagiso, Kiso Valley.
        </div>
      </footer>
      <ChatWidget />
    </>
  );
}
