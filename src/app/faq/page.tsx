import type { Metadata } from "next";
import Link from "next/link";
import ChatWidget from "@/components/ChatWidget";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { WHATSAPP_URL_EN } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ, Facilities & Access",
  description:
    "Facilities, house rules, access map and every practical question about staying at Kashiwaya Inn — check-in, meals, luggage, cancellation and more.",
  alternates: {
    canonical: "/faq",
    languages: { en: "/faq", ja: "/ja/faq", "x-default": "/faq" },
  },
};

export default function FaqPage() {
  return (
    <>
      <SiteNav lang="en" solid />

      <div className="page-head">
        <div className="section-head">
          <span className="eyebrow-dark">Good to know</span>
          <h2>
            The details, <em>at a glance.</em>
          </h2>
        </div>
      </div>

      {/* ============ FACILITIES & RULES ============ */}
      <section className="facilities" id="facilities">
        <div className="quote-grid">
          <div className="quote-card">
            <blockquote>
              &ldquo;I had the whole second floor to myself &mdash; very
              spacious and lovely. The house is old, so I was afraid it
              wasn&apos;t going to be very nice, but it was clean and I was
              really pleasantly surprised.&rdquo;
            </blockquote>
            <cite>Katerina &middot; Japan</cite>
          </div>
          <div className="quote-card">
            <blockquote>
              &ldquo;The house is spectacular &mdash; an actual old Japanese
              house. It is almost magical to walk the rooms, open the
              traditional sliding doors or enjoy a peaceful dinner in the
              dining room.&rdquo;
            </blockquote>
            <cite>Fabrizio &middot; United Kingdom</cite>
          </div>
        </div>
        <p className="quote-source">From guest reviews on Booking.com</p>
        <div className="amenities-grid">
          <div className="amenity-group">
            <h4>The rooms</h4>
            <ul>
              <li>Futon bedding &amp; linens</li>
              <li>Towels, slippers, earplugs &amp; bath amenities</li>
              <li>Air-conditioning &amp; heating</li>
              <li>Hairdryer &amp; fan</li>
              <li>Dining table &amp; wine glasses</li>
              <li>Bedside outlets, clothes rack &amp; drying stand</li>
            </ul>
          </div>
          <div className="amenity-group">
            <h4>Bath &amp; water</h4>
            <ul>
              <li>Private toilet for each room</li>
              <li>Shared shower room</li>
              <li>Shared sink &amp; kitchen</li>
              <li>No bathtub &mdash; a day-trip onsen is a short drive away</li>
            </ul>
          </div>
          <div className="amenity-group">
            <h4>The house</h4>
            <ul>
              <li>Free Wi-Fi throughout</li>
              <li>One group per floor &mdash; just two rooms in the house</li>
              <li>Washer-dryer (1st-floor room)</li>
              <li>Board games &amp; puzzles</li>
              <li>Luggage storage</li>
              <li>Smoke alarms &amp; fire extinguishers in every room</li>
              <li>No smoking indoors</li>
            </ul>
          </div>
          <div className="amenity-group">
            <h4>Outdoors &amp; parking</h4>
            <ul>
              <li>Free private on-site parking (please reserve ahead)</li>
              <li>Garden &amp; terrace</li>
              <li>Balcony &amp; mountain view (2nd floor)</li>
            </ul>
          </div>
          <div className="amenity-group">
            <h4>Activities &amp; services</h4>
            <ul>
              <li>E-bike rentals &amp; guided tours (paid)</li>
              <li>Hiking &amp; cycling from the door</li>
              <li>Calligraphy sessions (schedule permitting)</li>
              <li>Station pick-up &amp; luggage forwarding</li>
              <li>English &amp; Japanese spoken</li>
            </ul>
          </div>
        </div>
        <div className="rules-card">
          <h4>House rules</h4>
          <ul>
            <li>Closed December &mdash; February</li>
            <li>Check-in 16:00 &mdash; 18:00 &middot; check-out by 10:00</li>
            <li>
              Photo ID and the credit card used for booking are required at
              check-in
            </li>
            <li>
              Please let us know your arrival time in advance &mdash;
              self-check-in via key box can also be arranged
            </li>
            <li>
              Children welcome (no age limit) &middot; no cots, and extra
              futons are limited
            </li>
            <li>
              No pets &middot; no parties or events &middot; no smoking
              indoors (the courtyard is fine)
            </li>
            <li>
              Cancellation: 100% of prepayments refunded up to 7 days before
              arrival &middot; non-refundable after
            </li>
            <li>The 2nd-floor room is reached by stairs only</li>
          </ul>
        </div>
      </section>

      {/* ============ LOCATION ============ */}
      <section className="location" id="access">
        <div className="section-head">
          <span className="eyebrow-dark">Where we are</span>
          <h2>
            One quiet street <em>on the old road.</em>
          </h2>
          <p>
            Nagiso 3993 &mdash; Midono-juku, Nagiso, Kiso District, Nagano.
            About 1 km (15 minutes on foot) from JR Nagiso Station.
          </p>
        </div>
        <div className="map-embed">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6487.241362023977!2d137.6134136005096!3d35.61242230192019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601cc792f7fe924b%3A0xa2f12b3f1d333f0d!2zS2FzaGl3YXlhIElubiBOYWdpc28g5p-P5bGL44Kk44Oz!5e0!3m2!1sja!2sjp!4v1787387096800!5m2!1sja!2sjp"
            title="Map — Kashiwaya Inn, Nagiso"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="dist-grid">
          <div className="dist-item">
            <span className="dist-name">JR Nagiso Station</span>
            <span className="dist-km">1 km &middot; 15 min on foot</span>
          </div>
          <div className="dist-item">
            <span className="dist-name">Tsumago-juku</span>
            <span className="dist-km">4 km</span>
          </div>
          <div className="dist-item">
            <span className="dist-name">Magome-juku</span>
            <span className="dist-km">13 km</span>
          </div>
          <div className="dist-item">
            <span className="dist-name">Atera Valley &amp; Kakizore Gorge</span>
            <span className="dist-km">about 10 km</span>
          </div>
          <div className="dist-item">
            <span className="dist-name">Matsumoto Airport</span>
            <span className="dist-km">82 km</span>
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
          <summary>Is there anything to do before I arrive?</summary>
          <p>
            Yes — message us on{" "}
            <a href={WHATSAPP_URL_EN} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            with your arrival time, plus any luggage transport or activities
            you&apos;d like before check-in or after check-out. Meals are
            added at checkout when you book direct — or ordered on WhatsApp
            if you booked via Booking.com.
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
            Booking direct on this site? Simply choose your meals as add-ons
            at checkout when you book your room. For one-night stays
            there&apos;s nothing more to do. Staying multiple nights? Tell us
            on WhatsApp which order you&apos;d like on which date — e.g.
            staying Oct 3–6 and you&apos;d like sukiyaki on the 3rd and
            shabu-shabu on the 5th: add both sets at checkout, then message
            us &quot;Sukiyaki on the 3rd, Shabu-shabu on the 5th&quot;. The
            same goes for breakfast mornings. Booked via Booking.com? Order
            your meals on WhatsApp, with the same name as your room booking.
            Orders are accepted up to 3 days before your stay — see the{" "}
            <Link href="/dining">Dining page</Link> for the menu.
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
          <summary>Can I leave my luggage before check-in or after check-out?</summary>
          <p>
            Yes — place it at the entrance, on the shelf just inside. Please
            note our liability for stored luggage is limited to ¥100,000 per
            person.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can we rent the whole house?</summary>
          <p>
            Yes — on select dates (about one night a week) we list the whole
            kominka for a single group: both floors, garden and kitchen
            included. On those dates the individual rooms are closed, so the
            whole-house calendar only opens on the days it&apos;s available.
            Book it from the <Link href="/stay#book">booking section</Link>{" "}
            like any room. Please note the whole-house stay is unmanned
            (self check-in via key box) and Kashiwaya&apos;s dinner
            isn&apos;t available &mdash; instead, local shop Marusho
            delivers dinner sets to the house (¥1,500–¥3,500, see the{" "}
            <Link href="/dining#marusho">Dining page</Link>). The ochazuke
            breakfast set can still be ordered, and the kitchen is included
            for self-catering.
          </p>
        </details>
        <details className="faq-item">
          <summary>What is the cancellation policy for room bookings?</summary>
          <p>
            Prepayments are 100% refundable if you cancel 7 days before
            arrival or earlier; cancellations after that are non-refundable.
            (Meal orders follow their own policy — free until 4 days before
            your stay, non-refundable from 3 days before.)
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
            Dinner sets come in two sizes (serves 2 / serves 3): chicken hot
            pot ¥6,000 / ¥8,000, pork shabu-shabu or chilled rei-shabu
            ¥8,000 / ¥11,000, wagyu sukiyaki ¥10,000 / ¥14,000, and vegan
            gluten-free hot or chilled pots ¥8,000 / ¥11,000. Travelling
            solo? One set per day can be ordered at half the two-person
            price (not available for wagyu sukiyaki). The ochazuke breakfast set (vegan &amp; gluten-free) is
            ¥1,500 per person.
          </p>
        </details>
        <details className="faq-item">
          <summary>
            I booked on Booking.com with Genius — is breakfast free?
          </summary>
          <p>
            No — some Genius Level 2–3 reservations show a &ldquo;free
            breakfast&rdquo; benefit that Booking.com&apos;s system displays
            without any arrangement with us. Kashiwaya has no
            breakfast-included plans: all meals are optional, paid, and
            reserved in advance. We&apos;re sorry for the confusion this
            causes.
          </p>
        </details>
        <details className="faq-item">
          <summary>Can I just eat out in the evening instead?</summary>
          <p>
            Be careful — restaurants near us don&apos;t keep regular evening
            hours. The safe plan is to reserve dinner at the inn (up to 3
            days ahead) or ask us about same-day meal delivery. We&apos;ll
            gladly check what&apos;s open on your dates.
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
            floor — you won&apos;t pass through any other guest&apos;s area
            to reach it). There&apos;s no bathtub — if you want a proper
            soak, a day-use natural hot spring is about 15 minutes away by
            car (closed Wednesdays). We can arrange a taxi for you.
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
            shuttle. Between Nagiso and Kiso-Fukushima (stops at Nojiri,
            Suhara and Agematsu) we run the Luggage Bus once a day: booking
            required by 21:00 the day before, paid (¥1,500 per zone plus
            ¥1,500 per bag), closed Mondays and December–March. Details and
            booking:{" "}
            <a href="https://nakasendo-ebike.com/luggage-shuttle" target="_blank" rel="noopener noreferrer">
              nakasendo-ebike.com/luggage-shuttle
            </a>
            . For the wider Kiso area (Matsumoto to Nakatsugawa), NLTS and Walk
            Lite offer luggage transfer with advance booking.
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
            Easy — sneakers are fine (sandals aren&apos;t recommended). On
            frosty days in November and March, strap-on spikes for icy
            patches are a good idea; we rent those too.
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

      <SiteFooter lang="en" />
      <ChatWidget />
    </>
  );
}
