import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Next.js static export emits an RSC payload as <route>.txt beside every
      // <route>.html. Those payloads repeat the page's text but carry no
      // canonical tag, so crawling them produces "duplicate page without a
      // user-selected canonical" in Search Console. Block them — but keep
      // ads.txt crawlable for AdSense (the longer, more specific Allow rule
      // wins over the wildcard Disallow).
      allow: ["/", "/ads.txt"],
      disallow: "/*.txt$",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
