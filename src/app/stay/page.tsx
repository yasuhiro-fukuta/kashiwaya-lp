import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BedDouble } from "lucide-react";
import LodgifyBox from "@/components/LodgifyBox";
import PhotoGallery from "@/components/PhotoGallery";
import CouponBanner from "@/components/CouponBanner";
import ChatWidget from "@/components/ChatWidget";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { MARUSHO_SITE_URL, WHATSAPP_URL_EN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Stay — Rooms & Whole-House Rental",
  description:
    "Two rooms in a 140-year-old kominka — one group per floor — or the whole house to yourselves on select dates. Book direct and save 15% with code KISO15.",
  alternates: {
    canonical: "/stay",
    languages: { en: "/stay", ja: "/ja/stay", "x-default": "/stay" },
  },
};

const HOUSE_IMG = "/gallery/1stfloor.JPG";

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
      "He now runs “Yui-an,” an iconic kominka hostel that has become a symbol of Nagiso.",
    ],
  },
  {
    name: "Yasuhiro Fukuta",
    role: "Master",
    body: [
      "The current operator of Kashiwaya.",
      "After visiting Nagiso many times from Nagoya, he began a dual-base life and apprenticed under Hiroshi Kumagai while working two jobs.",
      "Inspired by a year living in West Virginia, USA, his mission is to recreate that deep “dive into the local” experience here in Nagiso.",
    ],
  },
] as const;

export default function StayPage() {
  return (
    <>
      <SiteNav lang="en" solid />

      <a href="#book" className="float-book">
        <BedDouble size={16} /> Book a Stay
      </a>

      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">Stay</span>
          <h2>
            One floor to yourselves — <em>or the whole house.</em>
          </h2>
        </div>
      </div>

      {/* ============ BOOK DIRECT ============ */}
      <section className="book-direct" id="book">
        <div className="book-direct-inner">
          <span className="eyebrow-dark">Book direct</span>
          <h2>
            No middleman, <em>just us.</em>
          </h2>
          <p className="book-direct-lede">
            Book direct, skip the platforms — and deal with real people, not a
            front desk. We host you ourselves, from the first message to the
            last morning. Two rooms in one kominka — and on select dates,
            the whole house to yourselves.
          </p>

          <CouponBanner lang="en" />

          <div className="room-grid">
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
                <ul className="room-feats">
                  <li>80 m&sup2; &middot; the whole historic floor for your group</li>
                  <li>Tatami rooms &middot; courtyard-facing &middot; futon bedding</li>
                  <li>Private toilet &middot; washer-dryer &middot; board games</li>
                </ul>
                <LodgifyBox rentalId="793793" />
              </div>
            </div>

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
                <ul className="room-feats">
                  <li>60 m&sup2; &middot; up to 3 adults &middot; 4 futons</li>
                  <li>Balcony &amp; mountain view &middot; private toilet on 1F &middot; stairs only</li>
                </ul>
                <LodgifyBox rentalId="793801" />
              </div>
            </div>

            <div className="room-card">
              <div className="room-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/gallery/tour/common-exterior.jpg"
                  alt="Whole-house rental — the entire 140-year-old kominka"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="room-body">
                <h3>The Whole House</h3>
                <div className="room-sub">Vacation house rental &middot; both floors</div>
                <ul className="room-feats">
                  <li>The entire 140-year-old kominka, for one group</li>
                  <li>Both floors (140 m&sup2;) &middot; garden &amp; kitchen all to yourselves</li>
                  <li>Offered on select dates only &mdash; about one night a week</li>
                  <li>Unmanned stay &mdash; self check-in via key box</li>
                  <li>
                    Kashiwaya&apos;s dinner isn&apos;t available &mdash;
                    local shop{" "}
                    <a
                      href={MARUSHO_SITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Marusho delivers dinner
                    </a>{" "}
                    to the house instead; the ochazuke breakfast set can
                    still be ordered
                  </li>
                </ul>
                <LodgifyBox rentalId="850548" />
              </div>
            </div>
          </div>

          <p className="meal-lead">
            On whole-house dates the individual rooms are closed (and vice
            versa), so the calendars never overlap &mdash; if your date shows
            no availability on one listing, check the other.
          </p>

          <p className="meal-lead">
            Booking direct? You can add dinner and breakfast right at
            checkout &mdash; see the <Link href="/dining">Dining page</Link>{" "}
            for the menu.
          </p>

          <p className="book-direct-foot">
            Questions? Message us on{" "}
            <a href={WHATSAPP_URL_EN} target="_blank" rel="noopener noreferrer">
              WhatsApp →
            </a>
          </p>
        </div>
      </section>

      {/* ============ HONEST NOTES ============ */}
      <section className="honest" id="honest">
        <div className="section-head">
          <span className="eyebrow-dark">Before you book</span>
          <h2>
            An honest note. <em>This is a 140-year-old house, not a hotel.</em>
          </h2>
          <p>
            Kashiwaya is wonderful for the right guest — and wrong for some.
            Please read these four points before you book.
          </p>
        </div>
        <div className="honest-card">
          <ul className="meal-note">
            <li>
              <strong>The kitchen, sink and shower room are shared</strong>{" "}
              when booking by the room — with at most one other group, since
              each floor sleeps a single group. Toilets are private. There is
              no bathtub; a day-use natural hot spring is ~15 min away by car.
            </li>
            <li>
              <strong>The 2nd-floor room&apos;s toilet is on the 1st
              floor</strong> — including at night, that means taking the
              stairs. The toilet itself is private, and you never pass
              through another guest&apos;s area.
            </li>
            <li>
              <strong>The stairs are original — steep and narrow.</strong>{" "}
              If stairs are hard for you, choose the 1st-floor room.
            </li>
            <li>
              <strong>Insulation and soundproofing have the limits of a
              140-year-old wooden house.</strong> Summer is covered by
              air-conditioning; winter relies on kerosene stoves and
              electric blankets, and mornings can be cold. You may hear the
              house creak and your neighbours live — which is why the house
              goes quiet after 21:00.
            </li>
          </ul>
          <p className="honest-foot">
            If none of this puts you off, you&apos;ll likely love it here —
            the hearth-side evenings, the quiet post-town mornings, and a
            house that has sheltered travellers since 1885.
          </p>
        </div>
      </section>

      {/* ============ HOUSE ============ */}
      <section className="chapter" id="house">
        <div className="chapter-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HOUSE_IMG} alt="The 140-year-old kominka of Kashiwaya" loading="lazy" decoding="async" />
        </div>
        <div className="chapter-text">
          <span className="chapter-num">The House</span>
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

      {/* ============ GALLERY ============ */}
      <section className="gallery" id="gallery">
        <div className="section-head">
          <span className="eyebrow-dark">Gallery</span>
          <h2>
            Walk the house, <em>room by room.</em>
          </h2>
        </div>
        <PhotoGallery lang="en" />
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

      {/* ============ POINTER TO FAQ ============ */}
      <section className="entries" style={{ paddingTop: 0 }}>
        <p className="entries-foot">
          Cancellation: prepayments are 100% refundable up to 7 days before
          arrival, non-refundable after. For facilities, house rules, access
          and every other practical question —{" "}
          <Link href="/faq">
            see FAQ, facilities &amp; access <ArrowRight size={13} style={{ display: "inline", verticalAlign: "-2px" }} />
          </Link>
        </p>
      </section>

      <SiteFooter lang="en" />
      <ChatWidget />
    </>
  );
}
