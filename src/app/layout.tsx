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
    "Kashiwaya Inn is a 140-year-old kominka guesthouse in Midono-juku, Nagiso — the 41st post town on the Nakasendo trail, near Tsumago and Magome in the Kiso Valley, Nagano. Home-style local dinners, exclusive craft beer, and free fat-tire e-bikes for guests.",
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
  alternates: { canonical: "/" },
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
      "A 140-year-old kominka guesthouse on the Nakasendo trail. Local dinners, exclusive craft beer, free e-bikes for guests.",
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
      address: {
        "@type": "PostalAddress",
        streetAddress: "Nagiso 3993",
        addressLocality: "Nagiso, Kiso District",
        addressRegion: "Nagano",
        addressCountry: "JP",
      },
      hasMap: "https://maps.app.goo.gl/ViXN6oJNxvjQkv2SA",
      sameAs: ["https://www.instagram.com/kashiwaya_nakasendo"],
      amenityFeature: [
        {
          "@type": "LocationFeatureSpecification",
          name: "Free fat-tire e-bikes for guests (16:00 on check-in day to 09:00 on check-out day)",
          value: true,
        },
        {
          "@type": "LocationFeatureSpecification",
          name: "Home-style local dinner and breakfast (reservation required)",
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
            text: "Meals are booked separately from your room through the “Add your meals” link in the booking section. Use the same email and name as your room booking. Meal orders are accepted up to 3 days before your stay.",
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
          name: "Can guests use the e-bikes during their stay?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — free for staying guests from 16:00 on your check-in day until 09:00 on your check-out day. Ring the bell at the desk or message us on WhatsApp before you ride.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use an e-bike during the day?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "During the day the bikes are used for guided tours and rentals by Beyond Nakasendo Cycling. Daytime use is ¥4,000 per bike per day (10:00 — 15:00).",
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
