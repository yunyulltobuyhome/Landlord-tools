import type { MetadataRoute } from "next";
import { statesData } from "@/lib/states-data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/calculator`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE_URL}/deduction-letter`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${SITE_URL}/state`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const stateRoutes: MetadataRoute.Sitemap = statesData.map((s) => ({
    url: `${SITE_URL}/state/${s.slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...stateRoutes];
}
