import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tsumago–Magome Day Walk: the Nakasendo from Kashiwaya",
  description:
    "How to walk the Magome Pass between Tsumago and Magome as a day trip from Kashiwaya Inn in Nagiso — buses, luggage storage, difficulty, bears, and timing.",
  alternates: { canonical: "/guide/tsumago-magome-day-walk" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Tsumago–Magome Day Walk: the Nakasendo from Kashiwaya",
  about: "Walking the Magome Pass on the Nakasendo trail from Nagiso",
  author: { "@type": "Organization", name: "Kashiwaya Inn" },
  publisher: { "@type": "Organization", name: "Kashiwaya Inn" },
  mainEntityOfPage: "https://kashiwaya-inn.com/guide/tsumago-magome-day-walk",
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
      <span className="article-eyebrow">Guide · The Nakasendo</span>
      <h1>The Tsumago–Magome day walk, done right</h1>
      <p>
        The stretch of the old Nakasendo between Magome and Tsumago — over the
        Magome Pass — is the most famous walk in the Kiso Valley, and it makes
        a perfect day trip from Kashiwaya. Here is the plan we recommend to our
        guests, refined over many seasons of seeing people come back happy (or
        occasionally footsore and wiser).
      </p>

      <h2>The shape of the day</h2>
      <ol>
        <li>
          Walk or ride to <strong>Nagiso Station</strong> (15 minutes on foot
          from Kashiwaya).
        </li>
        <li>
          Leave anything you don&apos;t need at a cafe near the station that
          offers luggage storage, and catch the{" "}
          <strong>mid-morning bus to Magome</strong> (around 10 a.m.; if
          that&apos;s too late for your schedule, we can arrange a taxi —
          just ask).
        </li>
        <li>
          Spend a couple of hours in <strong>Magome</strong> — the steep,
          stone-paved post town with big views over the valley.
        </li>
        <li>
          Walk the <strong>Magome Pass to Tsumago</strong>: about 8 km,
          two to three hours at a relaxed pace, mostly forest path, tea house
          at the top.
        </li>
        <li>
          Explore <strong>Tsumago</strong> — the best-preserved post town on
          the whole Nakasendo — then take the bus back to Nagiso Station and
          pick up your bag.
        </li>
      </ol>

      <div className="article-note">
        Buses are cash-only and can&apos;t change anything larger than a
        ¥1,000 note. Timetables change by season and year — check the current
        one with us the evening before, and we&apos;ll help you plan the
        connections.
      </div>

      <h2>How hard is it?</h2>
      <p>
        Easy. The pass is a well-kept path with a gentle grade — sneakers are
        fine, sandals aren&apos;t. In winter, icy patches appear; strap-on
        spikes make it comfortable, and we rent them at the inn.
      </p>

      <h2>What about bears?</h2>
      <p>
        Asian black bears live in these mountains, but fixed bells line the
        Magome Pass trail and there have been no sightings on it for about a
        decade. Bears want nothing to do with you and almost always leave
        first. If you&apos;d like extra peace of mind, we rent bear bells and
        bear spray.
      </p>

      <h2>Luggage, solved</h2>
      <p>
        Moving on after your walk? Between Magome and Tsumago there&apos;s a
        no-reservation luggage shuttle, and between Nagiso and Nojiri stations
        we run one ourselves. For the wider Kiso area, NLTS and Walk Lite
        forward bags with advance booking. Ask us and we&apos;ll set it up.
      </p>

      <h2>Make it a loop from Kashiwaya</h2>
      <p>
        Staying two nights gives you the walk without the clock-watching: do
        the pass on your middle day, then roll home to a nabe dinner and a
        Kashiwaya-exclusive craft beer. The next morning, a stroll out to
        Momosuke Bridge before the day warms up is the nicest send-off.
      </p>
      <Link href="/#book" className="article-cta">
        Stay at Kashiwaya →
      </Link>
    </main>
  );
}
