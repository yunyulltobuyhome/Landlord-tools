import type { MetadataRoute } from "next";
import { statesData } from "@/lib/states-data";
import { deductionsData } from "@/lib/deductions-data";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/move-out-packet`,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    { url: `${SITE_URL}/calculator`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE_URL}/security-deposit-interest-calculator`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/deduction-letter`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/prorated-rent-calculator`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/late-fee-calculator`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/move-in-checklist`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/rent-receipt-generator`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/rent-ledger`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/rent-split-calculator`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/security-deposit-demand-letter`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${SITE_URL}/tools`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/state`, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${SITE_URL}/can-a-landlord-charge-for`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/cookies`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const stateRoutes: MetadataRoute.Sitemap = statesData.map((s) => ({
    url: `${SITE_URL}/state/${s.slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const deductionRoutes: MetadataRoute.Sitemap = deductionsData.map((d) => ({
    url: `${SITE_URL}/can-a-landlord-charge-for/${d.slug}`,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  // Stamp every entry with a lastmod so crawlers get a freshness signal.
  return [...staticRoutes, ...stateRoutes, ...deductionRoutes].map((r) => ({
    ...r,
    lastModified,
  }));
}
