import type { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data: what stays in your browser, what cookies or analytics are used, and your choices.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
        Legal
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-2 font-sans text-sm text-ink/50">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-8 space-y-6 font-sans text-sm leading-relaxed text-ink/80">
        <section>
          <h2 className="font-serif text-xl font-bold text-ink">What this site is</h2>
          <p className="mt-2">
            {SITE_NAME} provides free calculators and document generators for
            landlords. This policy explains what information is collected
            when you use the site and what choices you have.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Data you enter into the calculators
          </h2>
          <p className="mt-2">
            Amounts, dates, tenant names, and any other details you type into
            the Security Deposit Calculator or the document generators are
            processed entirely in your browser. That data is never sent to
            our servers, stored in a database, or shared with any third
            party — it exists only on your device for as long as the page
            stays open. Generated PDFs are created locally in your browser
            and download straight to your device.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Cookies and analytics
          </h2>
          <p className="mt-2">
            We may use privacy-focused analytics (such as aggregate page-view
            counts) and advertising services to keep this site free.
            Analytics and advertising providers may use cookies or similar
            technologies to measure traffic and serve ads. We show a consent
            banner and honor your choice before setting any non-essential
            (analytics or advertising) cookies. You can change your choice at
            any time through the &quot;Cookie settings&quot; link in the
            footer, or block and delete cookies in your browser settings. Our
            dedicated{" "}
            <a href="/cookies" className="underline hover:text-moss">
              Cookie Policy
            </a>{" "}
            explains each category.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Advertising and Google AdSense
          </h2>
          <p className="mt-2">
            If this site displays ads, it does so through Google AdSense.
            Third-party vendors, including Google, use cookies to serve ads
            based on your prior visits to this and other websites. Google&apos;s
            use of advertising cookies enables it and its partners to serve
            ads to you based on your visits to this and/or other sites on the
            internet.
          </p>
          <p className="mt-2">
            You can opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              className="underline hover:text-moss"
            >
              Google Ad Settings
            </a>
            . You can also opt out of some third-party vendors&apos; use of
            cookies for personalized advertising at{" "}
            <a
              href="https://www.aboutads.info/choices/"
              className="underline hover:text-moss"
            >
              aboutads.info
            </a>
            . For visitors in the EEA, UK, and Switzerland, we request
            consent before advertising cookies are set, as required by
            Google&apos;s EU user consent policy.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Server logs
          </h2>
          <p className="mt-2">
            Like most websites, our hosting provider may automatically log
            basic technical information (such as IP address, browser type,
            and pages requested) for security and performance monitoring.
            These logs are not used to identify individual visitors.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Your choices
          </h2>
          <p className="mt-2">
            Because calculator inputs never leave your browser, there is
            nothing to request, export, or delete from our side. To limit
            analytics or ad cookies, use your browser&apos;s privacy
            settings or a content blocker.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">
            Changes to this policy
          </h2>
          <p className="mt-2">
            We may update this policy as the site adds features. Material
            changes will be reflected by updating the date at the top of
            this page.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold text-ink">Contact</h2>
          <p className="mt-2">
            Questions about this policy can be sent to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-moss">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
