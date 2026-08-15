import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gorges & Rivers by E-bike: the other side of the Kiso Valley",
  description:
    "Kakizore Gorge, the Atera Valley and quiet paved roads — a self-guided e-bike day from Kashiwaya Inn in Nagiso, with rentals, gear lending and station drop-off.",
  alternates: { canonical: "/guide/kiso-valley-ebike-day" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Gorges & Rivers by E-bike: the other side of the Kiso Valley",
  about:
    "Self-guided e-bike routes to Kakizore Gorge and the Atera Valley from Nagiso",
  author: { "@type": "Organization", name: "Kashiwaya Inn" },
  publisher: { "@type": "Organization", name: "Kashiwaya Inn" },
  mainEntityOfPage: "https://kashiwaya-inn.com/guide/kiso-valley-ebike-day",
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
      <span className="article-eyebrow">Guide · E-bike days</span>
      <h1>Gorges &amp; rivers: the other side of the Kiso</h1>
      <p>
        Everyone crosses the Magome Pass. Almost nobody crosses the river. On
        the far bank of the Kiso, a network of quiet paved roads links two of
        the most beautiful places in Nagano — <strong>Kakizore Gorge</strong>,
        whose water runs a green the locals call <em>Kakizore green</em>, and
        the <strong>Atera Valley</strong>, famous for its impossibly clear{" "}
        <em>Atera blue</em>. In summer, when the Nakasendo trails bake, this is
        the ride we send our guests on.
      </p>

      <h2>The route</h2>
      <p>
        From Kashiwaya you cross Momosuke Bridge — one of Japan&apos;s longest
        wooden bridges, built from local hinoki cypress — and follow
        low-traffic roads along the far bank. Swim or wade at the gorges, climb
        to the Koiji Pass viewpoint if your legs ask for more, and finish with
        a soak at a small onsen or coffee at one of the two good cafes near
        Nojiri Station. The e-bike flattens the climbs; if a road goes up, the
        motor goes with you.
      </p>

      <div className="article-note">
        Three riding rules we ask of everyone: keep left (use the sidewalk if
        the road feels unsafe, dismounting to pass pedestrians); walk your
        bike across wooden bridges — for your safety and the bridge&apos;s;
        and follow our navigation routes, which are designed to avoid private
        roads and keep you on safe, high-value riding.
      </div>

      <h2>Rentals and gear</h2>
      <p>
        E-bike rental (10:00 — 15:00) is ¥4,000 per bike per day through
        Beyond Nakasendo Cycling. Riders get our route navigation, and we lend out
        rash guards, life jackets and bear bells for the gorges. One-way is
        fine too — you can drop the bike at Nagiso or Nojiri Station and hop
        on the train.
      </p>

      <h2>Want it guided — or bigger?</h2>
      <p>
        The master runs guided rides through{" "}
        <a
          href="https://kiso-ebike-lp.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline"
        >
          Beyond Nakasendo Cycling
        </a>
        , including a full-valley descent: 50 km from the top of the Kiso road
        down to Nagiso, gently downhill almost the whole way. If you can ride
        10 km on a normal bike, you can finish it — and we&apos;d argue
        it&apos;s the most comfortable 50 km in the world.
      </p>

      <Link href="/#book" className="article-cta">
        Stay at Kashiwaya →
      </Link>
    </main>
  );
}
