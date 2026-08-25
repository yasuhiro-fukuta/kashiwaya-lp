import type { MetadataRoute } from "next";

const BASE = "https://kashiwaya-inn.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${BASE}`, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE}/ja`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/ja/guide/atera-ebike`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/guide/tsumago-magome-day-walk`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/guide/rainy-day-in-kiso`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${BASE}/guide/kiso-valley-ebike-day`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
