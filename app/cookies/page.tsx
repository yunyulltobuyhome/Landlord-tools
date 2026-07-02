import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import CookieSettingsLink from "@/components/CookieSettingsLink";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${SITE_NAME} uses cookies — essential, analytics, and advertising (including Google AdSense) — and how to control them.`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        Legal
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold">Cookie Policy</h1>
      <p className="mt-2 font-sans text-sm text-ink/50">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="mt-8 space-y-6 font-sans text-sm leading-relaxed text-ink/80">
        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            What cookies are
          </h2>
          <p className="mt-2">
            Cookies are small text files a website stores on your device.
            Some are essential for the site to function; others are optional
            and only used if you agree to them through our consent banner.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            The categories we use
          </h2>
          <ul className="mt-2 space-y-3">
            <li>
              <span className="font-semibold text-ink">Essential.</span> A
              single local setting that remembers your cookie choice so we
              don&apos;t ask again on every page. This is required for the
              consent mechanism to work and is always on.
            </li>
            <li>
              <span className="font-semibold text-ink">Analytics
              (optional).</span> If you accept, we may use privacy-respecting
              analytics to understand aggregate traffic — which pages are
              visited and roughly how many people use each tool. We do not
              use this to identify you personally.
            </li>
            <li>
              <span className="font-semibold text-ink">Advertising
              (optional).</span> If you accept, we may display ads through
              Google AdSense. Google and its partners may set cookies or
              read device identifiers to measure and, where permitted,
              personalize the ads you see. Google&apos;s use of advertising
              cookies is described in{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                className="underline hover:text-moss"
              >
                Google&apos;s advertising policy
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Your calculator inputs are never cookies
          </h2>
          <p className="mt-2">
            To be clear: the amounts, dates, and names you type into the
            calculators and document generators are processed in your
            browser and are never stored in a cookie or sent to us. See our{" "}
            <Link href="/privacy" className="underline hover:text-moss">
              Privacy Policy
            </Link>{" "}
            for the full picture.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Managing your choice
          </h2>
          <p className="mt-2">
            You can change your decision at any time — open{" "}
            <CookieSettingsLink className="underline hover:text-moss" /> to
            bring the consent banner back, or clear cookies and site data in
            your browser settings. Rejecting optional cookies will not stop
            any of the calculators from working.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Opting out of personalized ads
          </h2>
          <p className="mt-2">
            Beyond our banner, you can manage personalized advertising
            across many sites at{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="underline hover:text-moss"
            >
              Google Ad Settings
            </a>{" "}
            and{" "}
            <a
              href="https://www.aboutads.info/choices/"
              className="underline hover:text-moss"
            >
              aboutads.info
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
