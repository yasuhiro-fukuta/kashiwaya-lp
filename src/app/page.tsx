'use client';

import { useState } from "react";
import { ArrowRight, Bike, BedDouble, MapPin, Soup, Trees, Waves, Instagram, Mountain, CalendarDays } from "lucide-react";

// 🔧 Replace these with your real links
const BOOKING_URL = "https://www.booking.com/hotel/jp/kashiwaya-inn.en-gb.html"; // English
const INSTAGRAM_URL = "https://www.instagram.com/yourusername";
const GOOGLE_MAP_URL = "https://maps.app.goo.gl/ViXN6oJNxvjQkv2SA?g_st=ac";

// 🔧 Replace with your real images (can be remote URLs). Local placeholders used for now.
const HERO = "https://images.unsplash.com/photo-1564085358404-6f3ef38f0c86?q=80&w=1600&auto=format&fit=crop";
const GALLERY = [
  "https://images.unsplash.com/photo-1523419409543-a7bc72f1c091?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1552642986-ccb41e7059e7?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1562158075-8e0b0f9b78f8?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1485736231969-54e1f4a6ab58?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&auto=format&fit=crop"
];

export default function KashiwayaLanding() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={HERO} alt="Kashiwaya – traditional Japanese house" className="h-[70vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-10 text-white">
          <h1 className="text-4xl md:text-6xl font-semibold drop-shadow leading-tight">
            Kashiwaya Inn — Nagiso, Kiso Valley
          </h1>
          <p className="mt-3 max-w-2xl text-lg md:text-xl opacity-90">
            For three days, feel like a villager in Japan. A century-old inn, the historic Nakasendo, and the slow magic of Nagiso.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={BOOKING_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-white shadow-lg hover:bg-emerald-600 transition">
              <CalendarDays className="h-5 w-5" /> Book on Booking.com <ArrowRight className="h-4 w-4" />
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-white backdrop-blur hover:bg-white/20 transition">
              <Instagram className="h-5 w-5" /> See photos
            </a>
          </div>
        </div>
      </section>

      {/* USP Badges */}
      <section className="mx-auto max-w-6xl px-6 py-10 grid gap-4 md:grid-cols-3">
        <Feature icon={<BedDouble className="h-6 w-6" />} title="100+ year-old house" desc="Meiji-era atmosphere downstairs, warm Japanese-modern upstairs." />
        <Feature icon={<Bike className="h-6 w-6" />} title="E-bikes included" desc="Explore Tsumago, Kakizore Gorge, and hidden paths with ease." />
        <Feature icon={<Soup className="h-6 w-6" />} title="Local dinners" desc="Catering & partner restaurants. Vegan-friendly options available." />
      </section>

      {/* About */}
      <section className="mx-auto max-w-6xl px-6 py-6">
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Why Nagiso?</h2>
            <p className="mt-3 leading-7 text-stone-700">
              Nagiso is the gateway to the 100-km Kiso Valley on the historic Nakasendo trail. Stone-paved post towns, river-side eateries, hidden canyons, and winding rice-field paths connect culture, nature, and daily life.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Badge icon={<Mountain className="h-4 w-4" />}>Kiso Valley</Badge>
              <Badge icon={<Trees className="h-4 w-4" />}>Canyoneering spots</Badge>
              <Badge icon={<Waves className="h-4 w-4" />}>Rivers & waterfalls</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GALLERY.slice(0,6).map((src, i) => (
              <img key={i} src={src} alt="Kashiwaya gallery" className={`aspect-[4/3] object-cover rounded-xl ${i%3===0?"row-span-2 h-full":""}`} />
            ))}
          </div>
        </div>
      </section>

      {/* Stays & Dining */}
      <section className="mx-auto max-w-6xl px-6 py-10 grid gap-6 md:grid-cols-2">
        <Card
          title="Stay"
          desc="Feels like visiting your Japanese grandmother’s house — nostalgic and comfortable. Sleeps up to 4 (futons)."
          bullets={["Meiji-style first floor", "Modern second floor", "Self-serve breakfast"]}
          ctaLabel="Check availability"
          ctaHref={BOOKING_URL}
          icon={<BedDouble className="h-5 w-5" />}
        />
        <Card
          title="Dinner Options"
          desc="Catering sets at the inn and reservation-only partner restaurants nearby. Craft beer available on-site."
          bullets={["Wagyu BBQ set (courtyard)", "Chilled shabu set (indoor)", "Chef’s-choice partner restaurants"]}
          ctaLabel="Ask about dinner"
          ctaOnClick={() => setOpen(true)}
          icon={<Soup className="h-5 w-5" />}
        />
      </section>

      {/* E-bikes & Map */}
      <section className="mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <Bike className="h-6 w-6 text-emerald-600" />
            <div>
              <h3 className="text-xl font-semibold">E‑Bike Rental & Custom Map</h3>
              <p className="mt-2 text-stone-700">Explore famous sights and hidden gems with our electric crossbikes. Start navigation with one tap.</p>
              <div className="mt-4 flex gap-3">
                <a className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-4 py-2 hover:bg-stone-100" href={GOOGLE_MAP_URL} target="_blank" rel="noreferrer">
                  <MapPin className="h-4 w-4" /> Open the map
                </a>
                <a className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-white hover:bg-black" href={BOOKING_URL} target="_blank" rel="noreferrer">
                  Book your stay <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/70">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-stone-600">© {new Date().getFullYear()} Kashiwaya Inn, Nagiso</div>
          <div className="flex items-center gap-3">
            <a className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-3 py-2 hover:bg-stone-100" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-white hover:bg-emerald-600" href={BOOKING_URL} target="_blank" rel="noreferrer">
              Book now
            </a>
          </div>
        </div>
      </footer>

      {/* Simple modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setOpen(false)}>
          <div className="max-w-md w-full rounded-2xl bg-white p-6 shadow-xl" onClick={(e)=>e.stopPropagation()}>
            <h4 className="text-xl font-semibold">Dinner Options</h4>
            <ul className="mt-3 list-disc pl-6 space-y-1 text-stone-700">
              <li>Wagyu BBQ set — ¥10,000 / 2 persons (courtyard, fully prepared)</li>
              <li>Chilled shabu set — ¥8,000 / 2 persons (indoor)</li>
              <li>Partner restaurants (chef’s choice) — ¥4,000 pp + drinks</li>
            </ul>
            <div className="mt-4 text-sm text-stone-600">Vegan options available on request.</div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="rounded-xl border px-4 py-2" onClick={()=>setOpen(false)}>Close</button>
              <a className="rounded-xl bg-stone-900 px-4 py-2 text-white" href={BOOKING_URL} target="_blank" rel="noreferrer">Book</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm flex gap-3 items-start">
      <div className="rounded-xl bg-stone-100 p-2 text-stone-700">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-stone-700 mt-1">{desc}</div>
      </div>
    </div>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-stone-200/70 px-3 py-1 text-xs font-medium text-stone-800">
      {icon}
      {children}
    </span>
  );
}

type CardProps = {
  title: string;
  desc: string;
  bullets?: string[];
  ctaLabel: string;
  ctaHref?: string;
  ctaOnClick?: () => void;
  icon?: React.ReactNode;
};

function Card({ title, desc, bullets, ctaLabel, ctaHref, ctaOnClick, icon }: CardProps) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        {icon && <div className="rounded-xl bg-stone-100 p-2 text-stone-700">{icon}</div>}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );

  return (
    <Wrapper>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-stone-700">{desc}</p>
      {bullets && (
        <ul className="mt-3 list-disc pl-6 space-y-1 text-stone-700">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      <div className="mt-4">
        {ctaHref ? (
          <a
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-white hover:bg-black"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </a>
        ) : (
          <button
            onClick={ctaOnClick}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-white hover:bg-black"
          >
            {ctaLabel} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </Wrapper>
  );
}

