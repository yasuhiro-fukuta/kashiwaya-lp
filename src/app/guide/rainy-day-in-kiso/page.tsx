import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rainy Days in the Kiso: what to do when the trail is wet",
  description:
    "It rains in the Kiso Valley — and the valley is still good. Narai-juku by train, calligraphy at the inn, cafes and onsen: a rainy-day plan from Kashiwaya Inn, Nagiso.",
  alternates: { canonical: "/guide/rainy-day-in-kiso" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Rainy Days in the Kiso: what to do when the trail is wet",
  about: "Rainy-day alternatives to Nakasendo hiking in the Kiso Valley",
  author: { "@type": "Organization", name: "Kashiwaya Inn" },
  publisher: { "@type": "Organization", name: "Kashiwaya Inn" },
  mainEntityOfPage: "https://kashiwaya-inn.com/guide/rainy-day-in-kiso",
};

export default function Page() {
  return (
    <main className="article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="article-back">
        ← Kashiwaya Inn
      </Link>
      <span className="article-eyebrow">Guide · Weather plans</span>
      <h1>Rainy days in the Kiso</h1>
      <p>
        You planned to walk the Magome Pass, and the forecast has other ideas.
        Don&apos;t force it — a wet forest path is lovely for the first ten
        minutes and a chore after that. The valley has good rainy-day answers,
        and most of them start at Nagiso Station, fifteen minutes from our
        door.
      </p>

      <h2>Plan A: Narai-juku by train</h2>
      <p>
        Ride the JR Chuo line north for about an hour and you arrive in{" "}
        <strong>Narai-juku</strong> — a post town bigger than Magome or
        Tsumago, with a kilometre-long street of Edo-period buildings, and a
        far better wet-weather ratio: cafes, craft shops, sake tasting and
        lacquerware galleries you can hop between while the rain does its
        thing. Where Tsumago is a walk, Narai is a wander — which is exactly
        what you want under an umbrella.
      </p>

      <h2>Plan B: stay in and pick up a brush</h2>
      <p>
        The master has started running <strong>shodo (Japanese calligraphy)
        sessions at Kashiwaya</strong> — ink, brush, paper, and an hour of the
        kind of concentration that rain outside actually improves. Sessions
        depend on the day&apos;s schedule, so ask us and we&apos;ll see what
        we can do.
      </p>

      <h2>Plan C: hot water</h2>
      <p>
        A natural day-trip onsen sits a short drive up the valley (closed
        Wednesdays). We can arrange a taxi, or drive you ourselves when
        we&apos;re free — there are few better uses of a rainy afternoon than
        an outdoor bath in it.
      </p>

      <h2>And the cafes</h2>
      <p>
        Within a walk of the station you&apos;ll find a modern cafe with good
        English support, a soba place overlooking the Kiso River, and a
        log-cabin coffee house by Momosuke Bridge whose katsu curry has a
        local following. Ask us for the day&apos;s opening hours — this is
        deep countryside, and schedules are personal things here.
      </p>

      <div className="article-note">
        Trains and buses in the valley are cash-only; keep ¥1,000 notes on
        hand. And if the rain lifts by afternoon, the JR Railroad Trail is a
        flat, quick-drying ride on our e-bikes.
      </div>

      <Link href="/#book" className="article-cta">
        Stay at Kashiwaya →
      </Link>
    </main>
  );
}
