import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { EBIKE_LP_URL, WHATSAPP_URL_EN } from "@/lib/site";

export const metadata: Metadata = {
  title: "Explore — Tsumago, Magome & the Kiso Valley",
  description:
    "Walk the Nakasendo between Tsumago and Magome, swim emerald gorges, and ride e-bikes with the master — everything within reach of Kashiwaya's front door.",
  alternates: {
    canonical: "/explore",
    languages: { en: "/explore", ja: "/ja/explore", "x-default": "/explore" },
  },
};

const GORGE_IMG = "/gallery/kakizore.JPG";

const GUIDES = [
  {
    href: "/guide/tsumago-magome-day-walk",
    img: "/gallery/tour/common-engawa-v.jpg",
    title: "Tsumago–Magome day walk",
    body: "The classic Nakasendo walk over the Magome Pass — how to do it from Kashiwaya, luggage-free.",
  },
  {
    href: "/guide/rainy-day-in-kiso",
    img: "/gallery/tour/1f-incense.jpg",
    title: "Rainy days in the Kiso",
    body: "What to do when the valley turns misty — museums, onsen, and the quiet pleasures of a kominka.",
  },
  {
    href: "/guide/kiso-valley-ebike-day",
    img: "/gallery/kakizore.JPG",
    title: "Gorges & rivers by e-bike",
    body: "Kakizore green, Atera blue — the emerald gorges locals keep to themselves, one ride away.",
  },
] as const;

export default function ExplorePage() {
  return (
    <>
      <SiteNav lang="en" solid />

      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">Explore</span>
          <h2>
            The valley, <em>from our front door.</em>
          </h2>
          <p>
            Kashiwaya sits between the post towns of Tsumago (4 km) and
            Magome (13 km), with the emerald waters of the Atera Valley and
            Kakizore Gorge about 10 km away. Walk the old road in the
            morning, swim a gorge in the afternoon, and be back for dinner
            by the hearth.
          </p>
        </div>
      </div>

      {/* ============ GUIDES ============ */}
      <section className="entries">
        <div className="section-head">
          <span className="eyebrow-dark">Guides</span>
          <h2>
            Three ways <em>into the valley.</em>
          </h2>
        </div>
        <div className="entry-grid">
          {GUIDES.map((g) => (
            <Link key={g.href} href={g.href} className="entry-card">
              <div className="entry-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt={g.title} loading="lazy" decoding="async" />
              </div>
              <div className="entry-body">
                <h3>{g.title}</h3>
                <p>{g.body}</p>
                <span className="entry-more">
                  Read the guide <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ ACTIVITIES CTA → ebike LP ============ */}
      <section className="activities-cta full">
        <div className="activities-cta-inner">
          <div className="activities-cta-text">
            <span className="eyebrow-light">Tours, e-bikes &amp; luggage</span>
            <h3>
              Ready for an <em>adventure?</em>
            </h3>
            <p>
              The master also runs Beyond Nakasendo Cycling: guided e-bike
              tours, self-guided rentals, and a luggage shuttle so you can
              walk or ride the valley hands-free. Routes, prices and
              booking all live on their site.
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

      <section className="entries" style={{ paddingTop: 0 }}>
        <p className="entries-foot">
          Not sure what fits your dates? Message us on{" "}
          <a href={WHATSAPP_URL_EN} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{" "}
          and we&apos;ll plan it with you — or check{" "}
          <Link href="/faq">FAQ, facilities &amp; access</Link>.
        </p>
      </section>

      <SiteFooter lang="en" />
      <ChatWidget />
    </>
  );
}
