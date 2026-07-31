import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Deliberately kept minimal. A wildcard Disallow was tried here to hide
    // Next.js RSC .txt payloads (5 "duplicate page" reports in Search
    // Console), but that is a trivial gain and robots.txt is the single
    // riskiest file to experiment with while traffic is already at zero.
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
