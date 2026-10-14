import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import LegacyHash from "@/components/LegacyHash";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { GOOGLE_MAP_URL, WHATSAPP_URL_EN } from "@/lib/site";

/** トップページ。ハネムーン・カップル向けに絞り、詳細は
 *  /stay /dining /explore /faq の各ページへ誘導する。
 *  画像は 2026-12 のプロ撮影後に差し替え予定のプレースホルダ。 */
const HERO_IMG = "/gallery/entrance.JPG";

const ENTRIES = [
  {
    href: "/stay",
    img: "/gallery/1fchess.jpg",
    title: "Stay",
    body: "Two rooms, one group per floor — or the whole kominka to yourselves. Direct bookings save 15% with code KISO15.",
    more: "Rooms & booking",
  },
  {
    href: "/dining",
    img: "/gallery/somen.jpg",
    title: "Dine",
    body: "Nabe dinners and ochazuke breakfasts by the chef next door — and craft beer brewed only for this house.",
    more: "Menu & how to order",
  },
  {
    href: "/explore",
    img: "/gallery/kakizore.JPG",
    title: "Explore",
    body: "Tsumago and Magome, emerald gorges, e-bike rides with the master — everything within reach of the front door.",
    more: "The valley & guides",
  },
] as const;

const TOP_GALLERY = [
  "/gallery/tour/common-engawa-v.jpg",
  "/gallery/tour/1f-dining.jpg",
  "/gallery/tour/common-garden.jpg",
  "/gallery/tour/1f-lamp-v.jpg",
] as const;

export default function Page() {
  return (
    <>
      <LegacyHash lang="en" />
      <SiteNav lang="en" />

      {/* ============ HERO ============ */}
      <header className="hero" id="top">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url('${HERO_IMG}')` }}
        />
        <div className="hero-inner">
          <span className="eyebrow">Nagiso · Kiso Valley · Nakasendo</span>
          <h1>
            Dive into the local, <em>join into the history.</em>
          </h1>
          <p className="hero-lede">
            A 140-year-old samurai-style inn in a quiet post town on the
            Nakasendo. One floor — or the whole house — entirely yours:
            dinner by the hearth, beer brewed only for this house, and the
            old road to yourself in the morning, before anyone else wakes.
          </p>
          <div className="hero-ctas">
            <Link href="/stay" className="btn-primary">
              Book your stay <ArrowRight size={16} />
            </Link>
            <a
              href={WHATSAPP_URL_EN}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <MessageCircle size={15} /> WhatsApp
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

      {/* ============ CONCEPT (short) ============ */}
      <section id="concept">
        <div className="section-head">
          <span className="eyebrow-dark">The idea</span>
          <h2>
            Not just a place to sleep. <em>A way to enter the village.</em>
          </h2>
          <p>
            Most travellers pass through Tsumago and Magome and never see
            what happens after the buses leave. Kashiwaya is for the ones
            who stay — an evening by the hearth over a nabe dinner, a beer
            brewed only for this house, and a street that has carried
            travellers for 140 years, quiet again by nine.
          </p>
        </div>
      </section>

      {/* ============ ENTRANCES ============ */}
      <section className="entries">
        <div className="entry-grid">
          {ENTRIES.map((e) => (
            <Link key={e.href} href={e.href} className="entry-card">
              <div className="entry-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.img} alt={e.title} loading="lazy" decoding="async" />
              </div>
              <div className="entry-body">
                <h3>{e.title}</h3>
                <p>{e.body}</p>
                <span className="entry-more">
                  {e.more} <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="entries-foot">
          Practical questions? <Link href="/faq">FAQ, facilities &amp; access →</Link>
        </p>
      </section>

      {/* ============ GALLERY STRIP ============ */}
      <section className="gallery">
        <div className="top-gallery">
          {TOP_GALLERY.map((src) => (
            <Link key={src} href="/stay#gallery">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Inside Kashiwaya" loading="lazy" decoding="async" />
            </Link>
          ))}
        </div>
        <p className="top-access">
          Nagiso 3993, Kiso Valley, Nagano — 15 minutes on foot from JR
          Nagiso Station ·{" "}
          <a href={GOOGLE_MAP_URL} target="_blank" rel="noopener noreferrer">
            open the map
          </a>
        </p>
      </section>

      <SiteFooter lang="en" />
      <ChatWidget />
    </>
  );
}
