"use client";

import type { ReactNode } from "react";
import {
  ArrowRight,
  Bike,
  BedDouble,
  CalendarDays,
  Instagram,
  Mountain,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Links
// -----------------------------------------------------------------------------
const BOOKING_URL = "https://www.booking.com/hotel/jp/kashiwaya-inn.en-gb.html";
const INSTAGRAM_URL = "https://www.instagram.com/kashiwaya_nakasendo";
const GOOGLE_MAP_URL = "https://maps.app.goo.gl/ViXN6oJNxvjQkv2SA?g_st=ac";

// -----------------------------------------------------------------------------
// Images (public/gallery)
// NOTE: Vercel/Linux is case-sensitive. Must match filenames exactly.
// -----------------------------------------------------------------------------
const HERO = {
  desktop: "/gallery/light.JPG",
  alt: "Kashiwaya Inn — warm light",
};

type ChapterImage = { desktop: string; mobile?: string; alt: string };

const IMAGES: Record<string, ChapterImage[]> = {
  concept: [
    { desktop: "/gallery/tsumago.jpg", alt: "Tsumago-juku, a post town on the Nakasendo" },
    { desktop: "/gallery/kakizore.JPG", alt: "Kakizore Gorge and river scenery" },
  ],
  house: [
    { desktop: "/gallery/1fchess.jpg", mobile: "/gallery/1fchessV.jpg", alt: "Tatami living space on the first floor" },
    { desktop: "/gallery/2fdining.jpg", alt: "Dining space on the second floor" },
  ],
  food: [
    { desktop: "/gallery/garden.jpg", alt: "Garden at Kashiwaya" },
    { desktop: "/gallery/somen.jpg", alt: "Local caterer, seasonal table" },
  ],
  drink: [
    { desktop: "/gallery/beer.jpg", alt: "Limited craft beer: Kiso Kaido Beer" },
    { desktop: "/gallery/wine.JPG", alt: "Sake, Wine and Plum wine are also available" },
  ],
  activities: [
    { desktop: "/gallery/ebike3.jpg", alt: "Cycle guide & local routes" },
    { desktop: "/gallery/dosojin.jpg", alt: "Dosojin, guardian deities of the road" },
  ],
};


// -----------------------------------------------------------------------------
// People (EN) — rendered from this array (no hard-coded cards)
// -----------------------------------------------------------------------------
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
      "He inherited the partnership with Shu Ichikawa and relocated to Nagiso in 2025 to relaunch Kashiwaya.",
      "Inspired by a year living in West Virginia, USA, his mission is to recreate that deep “dive into the local” experience here in Nagiso.",
    ],
  },
] as const;

// -----------------------------------------------------------------------------
// UI helpers
// -----------------------------------------------------------------------------
type ResponsiveImageProps = {
  desktop: string;
  mobile?: string;
  alt: string;
  className?: string;
};

function ResponsiveImage({ desktop, mobile, alt, className }: ResponsiveImageProps) {
  const imgClass = className ?? "h-full w-full object-cover";

  // If a dedicated mobile asset exists, serve it only on small screens.
  if (mobile) {
    return (
      <picture className="block">
        <source srcSet={mobile} media="(max-width: 768px)" />
        <img src={desktop} alt={alt} loading="lazy" className={imgClass} />
      </picture>
    );
  }

  return <img src={desktop} alt={alt} loading="lazy" className={imgClass} />;
}


function Pill({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
      <span className="opacity-90">{icon}</span>
      {children}
    </span>
  );
}

function CTAButton({
  href,
  icon,
  children,
  variant = "primary",
}: {
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : "bg-white/15 text-white hover:bg-white/25 border border-white/30 backdrop-blur";
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles}`}>
      {icon}
      {children}
      <ArrowRight className="h-4 w-4" />
    </a>
  );
}

function PersonCard({
  name,
  role,
  body,
}: {
  name: string;
  role: string;
  body: string[];
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-stone-900">{name}</div>
          <div className="mt-1 text-xs font-medium text-stone-500">{role}</div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-stone-100" />
      </div>

      <div className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------
export default function Page() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="#top" className="text-sm font-semibold tracking-tight">
            Kashiwaya
          </a>

          <nav className="hidden gap-5 text-xs font-medium text-stone-600 md:flex">
            <a className="hover:text-stone-900" href="#concept">
              Concept
            </a>
            <a className="hover:text-stone-900" href="#house">
              House
            </a>
            <a className="hover:text-stone-900" href="#food">
              Food
            </a>
            <a className="hover:text-stone-900" href="#drink">
              Drink
            </a>
            <a className="hover:text-stone-900" href="#activities">
              Activities
            </a>
            <a className="hover:text-stone-900" href="#people">
              People
            </a>
          </nav>

          <a
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white hover:bg-stone-800"
            href={BOOKING_URL}
            target="_blank"
            rel="noreferrer"
          >
            <CalendarDays className="h-4 w-4" />
            Book
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative">
        <div className="relative h-[520px] w-full overflow-hidden md:h-[640px]">
          <ResponsiveImage
            desktop={HERO.desktop}
            alt={HERO.alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/30 to-black/60" />

          <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-10">
            <div className="flex flex-wrap gap-2">
              <Pill icon={<Mountain className="h-4 w-4" />}>Nagiso / Kiso Valley</Pill>
              <Pill icon={<BedDouble className="h-4 w-4" />}>Kominka stay</Pill>
              <Pill icon={<Bike className="h-4 w-4" />}>Cycle activities</Pill>
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Kashiwaya Inn — Dive into the local
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 md:text-base">
              Feel like your life is gently “sliding” into Nagiso — as if you were born in this
              village, just taking a long, slow vacation.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <CTAButton href={BOOKING_URL} icon={<CalendarDays className="h-4 w-4" />}>
                Book on Booking.com
              </CTAButton>
              <CTAButton
                href={INSTAGRAM_URL}
                icon={<Instagram className="h-4 w-4" />}
                variant="secondary"
              >
                Instagram
              </CTAButton>
              <CTAButton
                href={GOOGLE_MAP_URL}
                icon={<ArrowRight className="h-4 w-4" />}
                variant="secondary"
              >
                Open Map
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* What is */}
      <section className="border-t border-stone-200 bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                What is Kashiwaya?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700 md:text-base">
                Kashiwaya is not a “tourist facility” first. It’s a small base to experience the
                deep local — the everyday rhythm of Nagiso, the old houses and warm light,
                neighbors’ food, and the quiet confidence of the Kiso valley.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-700 md:text-base">
                Below are five chapters that explain what your stay feels like.
              </p>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
                <div className="text-xs font-semibold tracking-widest text-stone-500">CHAPTERS</div>
                <ol className="mt-4 space-y-2 text-sm text-stone-700">
                  <li>1. Concept — Dive into the local</li>
                  <li>2. House — 140-year-old kominka</li>
                  <li>3. Food — Local caterer</li>
                  <li>4. Drink — Kiso Kaido Beer</li>
                  <li>5. Activities — Cycle guide</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Chapter 1 */}
          <div id="concept" className="mt-12 grid gap-8 md:grid-cols-12 scroll-mt-24">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-stone-500">
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1">CHAPTER</span>
                <span className="rounded-full bg-stone-900 px-3 py-1 text-white">1</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Concept</h3>
              <div className="mt-2 text-3xl font-semibold tracking-tight">Dive into the local</div>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                The goal is simple: a stay that feels like you’re borrowing a local life. Not a
                checklist of “must-see” spots — more like waking up slowly, making tea, walking
                the old road, and letting the village set your pace.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-stone-600">
                <li>• One group / one house feel (quiet and private)</li>
                <li>• Long-stay friendly — slow is the point</li>
                <li>• A base for Nakasendo, Tsumago & the Kiso valley</li>
              </ul>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-4 md:grid-cols-2">
                {IMAGES.concept.map((img) => (
                  <div key={img.desktop} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <ResponsiveImage desktop={img.desktop} mobile={img.mobile} alt={img.alt} className="h-[260px] w-full object-cover" />
                    <div className="p-4 text-xs text-stone-600">{img.alt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter 2 */}
          <div id="house" className="mt-12 grid gap-8 md:grid-cols-12 scroll-mt-24">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-stone-500">
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1">CHAPTER</span>
                <span className="rounded-full bg-stone-900 px-3 py-1 text-white">2</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">House</h3>
              <div className="mt-2 text-3xl font-semibold tracking-tight">A renovated 140-year-old home</div>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                Kashiwaya is a kominka with time in its wood. Renovated carefully, it keeps the
                atmosphere of an old home while adding only what’s necessary for a comfortable stay.
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-4 md:grid-cols-2">
                {IMAGES.house.map((img) => (
                  <div key={img.desktop} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <ResponsiveImage desktop={img.desktop} mobile={img.mobile} alt={img.alt} className="h-[260px] w-full object-cover" />
                    <div className="p-4 text-xs text-stone-600">{img.alt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter 3 */}
          <div id="food" className="mt-12 grid gap-8 md:grid-cols-12 scroll-mt-24">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-stone-500">
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1">CHAPTER</span>
                <span className="rounded-full bg-stone-900 px-3 py-1 text-white">3</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Food</h3>
              <div className="mt-2 text-3xl font-semibold tracking-tight">Local caterer, seasonal table</div>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                Dinner can be arranged with local partners — food that belongs to this area,
                made for real life, not for show.
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-4 md:grid-cols-2">
                {IMAGES.food.map((img) => (
                  <div key={img.desktop} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <ResponsiveImage desktop={img.desktop} mobile={img.mobile} alt={img.alt} className="h-[260px] w-full object-cover" />
                    <div className="p-4 text-xs text-stone-600">{img.alt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter 4 */}
          <div id="drink" className="mt-12 grid gap-8 md:grid-cols-12 scroll-mt-24">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-stone-500">
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1">CHAPTER</span>
                <span className="rounded-full bg-stone-900 px-3 py-1 text-white">4</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Drink</h3>
              <div className="mt-2 text-3xl font-semibold tracking-tight">Limited craft beer: Kiso Kaido Beer</div>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                A quiet drink fits this house. Kiso Kaido Beer is made only for Kashiwaya — a small
                taste of the old road and the people connected to it.
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-4 md:grid-cols-2">
                {IMAGES.drink.map((img) => (
                  <div key={img.desktop} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <ResponsiveImage desktop={img.desktop} mobile={img.mobile} alt={img.alt} className="h-[260px] w-full object-cover" />
                    <div className="p-4 text-xs text-stone-600">{img.alt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chapter 5 */}
          <div id="activities" className="mt-12 grid gap-8 md:grid-cols-12 scroll-mt-24">
            <div className="md:col-span-4">
              <div className="flex items-center gap-3 text-xs font-semibold tracking-widest text-stone-500">
                <span className="rounded-full border border-stone-200 bg-white px-3 py-1">CHAPTER</span>
                <span className="rounded-full bg-stone-900 px-3 py-1 text-white">5</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Activities</h3>
              <div className="mt-2 text-3xl font-semibold tracking-tight">Cycle guide & local routes</div>
              <p className="mt-4 text-sm leading-7 text-stone-700">
                Explore at village speed. With local routes and guidance, the valley opens up in a way
                cars never can.
              </p>
            </div>

            <div className="md:col-span-8">
              <div className="grid gap-4 md:grid-cols-2">
                {IMAGES.activities.map((img) => (
                  <div key={img.desktop} className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                    <ResponsiveImage desktop={img.desktop} mobile={img.mobile} alt={img.alt} className="h-[260px] w-full object-cover" />
                    <div className="p-4 text-xs text-stone-600">{img.alt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* People */}
          <section id="people" className="mt-16 scroll-mt-24 border-t border-stone-200 bg-white/60">
            <div className="mx-auto max-w-6xl py-16">
              <div className="grid gap-8 md:grid-cols-12">
                <div className="md:col-span-5">
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-900 md:text-3xl">
                    Kashiwaya is supported by
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-stone-700 md:text-base">
                    This place exists because people kept caring for it — across generations,
                    renovations, and restarts.
                  </p>
                </div>

                <div className="md:col-span-7">
                  <div className="grid gap-4 md:grid-cols-2">
                    {PEOPLE.map((p) => (
                      <PersonCard key={p.name} name={p.name} role={p.role} body={[...p.body]} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-16 border-t border-stone-200 pt-8 text-xs text-stone-500">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>© {new Date().getFullYear()} Kashiwaya Inn</div>
              <div className="flex gap-4">
                <a className="hover:text-stone-800" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a className="hover:text-stone-800" href={BOOKING_URL} target="_blank" rel="noreferrer">
                  Booking
                </a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
