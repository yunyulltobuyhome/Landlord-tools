import { SITE_URL } from "@/lib/site";

export function toolJsonLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `${SITE_URL}${path}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (runs in browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}
