import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://kashiwaya-inn.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Kashiwaya Inn — Nakasendo Guesthouse in Nagiso, Kiso Valley, Japan",
    template: "%s | Kashiwaya Inn",
  },
  description:
    "Kashiwaya Inn is a 140-year-old kominka guesthouse in Midono-juku, Nagiso — the 41st post town on the Nakasendo trail, near Tsumago and Magome in the Kiso Valley, Nagano. Home-style local dinners, exclusive craft beer, and a quiet base for the Nakasendo trail.",
  keywords: [
    "Kashiwaya Inn",
    "Kashiwaya",
    "Nakasendo accommodation",
    "Nagiso hotel",
    "Nagiso guesthouse",
    "Kiso Valley stay",
    "Midono-juku",
    "Tsumago lodging",
    "Magome lodging",
    "kominka stay Japan",
    "Nakasendo trail hotel",
    "Nagano guesthouse",
    "e-bike Kiso Valley",
  ],
  alternates: {
    canonical: "/",
    languages: { en: "/", ja: "/ja", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Kashiwaya Inn",
    title: "Kashiwaya Inn — Nakasendo Guesthouse in Nagiso, Kiso Valley",
    description:
      "A 140-year-old kominka guesthouse in Midono-juku, the 41st post town on the Nakasendo. Stay where samurai once stayed — 15 minutes on foot from Nagiso Station.",
    images: [
      {
        url: "/gallery/entrance.JPG",
        width: 2000,
        height: 1125,
        alt: "Kashiwaya Inn — a 140-year-old kominka in Midono-juku, Nagiso",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashiwaya Inn — Nakasendo Guesthouse in Nagiso, Kiso Valley",
    description:
      "A 140-year-old kominka guesthouse on the Nakasendo trail. Local dinners, exclusive craft beer, 15 minutes on foot from Nagiso Station.",
    images: ["/gallery/entrance.JPG"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BedAndBreakfast",
      "@id": `${SITE_URL}/#inn`,
      name: "Kashiwaya Inn",
      alternateName: "Kashiwaya",
      description:
        "A 140-year-old kominka guesthouse in Midono-juku, the 41st post town on the Nakasendo, in Nagiso, Kiso Valley, Nagano. Built in the style of a samurai inn and still lived in today.",
      url: SITE_URL,
      image: `${SITE_URL}/gallery/entrance.JPG`,
      telephone: "+81-90-3839-2354",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nagiso 3993",
        addressLocality: "Nagiso, Kiso District",
        addressRegion: "Nagano",
        addressCountry: "JP",
      },
      hasMap: "https://maps.app.goo.gl/ViXN6oJNxvjQkv2SA",
      sameAs: ["https://www.instagram.com/kashiwaya_nakasendo"],
      checkinTime: "16:00",
      checkoutTime: "10:00",
      numberOfRooms: 2,
      petsAllowed: false,
      smokingAllowed: false,
      knowsLanguage: ["en", "ja"],
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Free Wi-Fi",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Home-style local dinner and breakfast (reservation required)",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Free pick-up from Nagiso Station, Tsumago and Junikane Station (16:00 — 18:00)",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Washer-dryer (first-floor room)",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Free private on-site parking (reservation required)",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Garden and terrace",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Shared kitchen",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Luggage storage",
          value: true,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I get to Kashiwaya Inn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Take the JR Chuo line to Nagiso Station, then walk 15 minutes to Kashiwaya in Midono-juku (Nagiso 3993). If you need a ride, the manager can help arrange a taxi — just tell us in advance.",
          },
        },
        {
          "@type": "Question",
          name: "Can you accommodate dietary restrictions (vegan, gluten-free, etc.)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — tell us when you book on our site, or send us a WhatsApp message. We cook around your needs, from wagyu through to vegan and gluten-free.",
          },
        },
        {
          "@type": "Question",
          name: "How do I reserve dinner and breakfast?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Meals are booked separately from your room through the pre-arrival form in the Food option section. Use the same email and name as your room booking, and fill in the form once per date for multi-night stays. Orders are accepted up to 3 days before your stay.",
          },
        },
        {
          "@type": "Question",
          name: "Can I cancel a meal order?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cancellation is free with a full refund up to 4 days before your stay. From 3 days before onward, meal orders are non-refundable, as the meals are already being prepared.",
          },
        },
        {
          "@type": "Question",
          name: "Can I rent an e-bike?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — the master runs guided e-bike tours and rentals through Beyond Nakasendo Cycling. Daytime use is ¥4,000 per bike per day (10:00 — 15:00). Book through their site.",
          },
        },
        {
          "@type": "Question",
          name: "What are the check-in and check-out times at Kashiwaya Inn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Check-in is 16:00 — 18:00. Early arrivals can drop luggage and explore; late arrivals should message us on WhatsApp on arrival. Check-out is by 10:00 with no procedure.",
          },
        },
        {
          "@type": "Question",
          name: "Is pick-up from Nagiso Station or Tsumago available?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Nagiso Station, Tsumago and Junikane Station are within the free pick-up area between 16:00 and 18:00, arranged in advance. For departures the inn can call a taxi.",
          },
        },
        {
          "@type": "Question",
          name: "How much are dinner and breakfast at Kashiwaya Inn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Dinner sets serve two people and range from ¥6,000 (chicken hot pot) to ¥10,000 (wagyu BBQ), including shabu-shabu, wagyu sukiyaki and vegan sets. Solo travellers can order one set at half the two-person price. The ochazuke breakfast set (vegan & gluten-free) is ¥3,000.",
          },
        },
        {
          "@type": "Question",
          name: "Is there Wi-Fi at Kashiwaya Inn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — free Wi-Fi throughout the house.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need cash in the Kiso Valley?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kashiwaya takes card payments, but most local restaurants and all local buses and trains are cash-only and can't change notes larger than ¥1,000. Bring ¥1,000 notes. The nearest ATM is at the 7-Eleven, about 20 minutes on foot.",
          },
        },
        {
          "@type": "Question",
          name: "Are the bathrooms shared? Is there a bath?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The shower room, sink and kitchen are shared; toilets are private (the second floor's private toilet is on the first floor, reached without passing through any other guest's area). There is no bathtub; a day-use natural hot spring is about 15 minutes away by car (closed Wednesdays) and the inn can shuttle guests when the schedule allows, or arrange a taxi.",
          },
        },
        {
          "@type": "Question",
          name: "Can I do laundry at Kashiwaya Inn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "First-floor guests have a washer-dryer. Otherwise there is a coin laundry about 15 minutes' walk away.",
          },
        },
        {
          "@type": "Question",
          name: "Can luggage be forwarded to the next stop on the Nakasendo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Between Magome and Tsumago there is a no-reservation luggage shuttle. Between Nagiso and Nojiri stations Kashiwaya runs one — just ask. For the wider Kiso area (Matsumoto to Nakatsugawa), NLTS and Walk Lite offer booked luggage transfer.",
          },
        },
        {
          "@type": "Question",
          name: "Are there bears on the Nakasendo trails?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Asian black bears live in the mountains, but fixed bells along the Magome Pass trail mean no sightings there for about a decade. Bears avoid people; the main risk is surprising a mother with cubs. Bear bells and bear spray are available to rent at the inn.",
          },
        },
        {
          "@type": "Question",
          name: "How hard is the Magome Pass walk?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Easy — sneakers are fine, sandals are not recommended. In winter, strap-on ice spikes are advised and can be rented at the inn.",
          },
        },
        {
          "@type": "Question",
          name: "Is breakfast free with Booking.com Genius at Kashiwaya Inn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Some Genius Level 2-3 reservations display a free-breakfast benefit added by Booking.com's system without any arrangement with the inn. Kashiwaya has no breakfast-included plans; all meals are optional, paid services reserved in advance.",
          },
        },
        {
          "@type": "Question",
          name: "Can luggage be stored before check-in or after check-out?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — luggage can be left at the entrance on the shelf just inside. Liability for stored luggage is limited to ¥100,000 per person.",
          },
        },
        {
          "@type": "Question",
          name: "Can guests eat out in the evening near Kashiwaya Inn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nearby restaurants do not keep regular evening hours, so reserving dinner at the inn (up to 3 days ahead) or same-day meal delivery is recommended.",
          },
        },
        {
          "@type": "Question",
          name: "What are the house rules at Kashiwaya Inn?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No pets, and no smoking inside the wooden house (the courtyard is fine). Photos and videos are welcome. Quiet hours after 21:00, as local residents rise early.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
