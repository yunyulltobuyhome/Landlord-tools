import Link from "next/link";
import { statesData } from "@/lib/states-data";
import CookieSettingsLink from "@/components/CookieSettingsLink";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sand">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-4">
          <div>
            <p className="font-serif text-lg font-bold">Landlord Tools</p>
            <p className="mt-2 max-w-xs font-sans text-sm text-ink/70">
              Free calculators and document generators for independent
              landlords handling move-out and security deposits.
            </p>
          </div>
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Tools
            </p>
            <ul className="mt-2 space-y-1 font-sans text-sm">
              <li>
                <Link href="/calculator" className="transition-colors hover:text-moss">
                  Security Deposit Calculator
                </Link>
              </li>
              <li>
                <Link href="/deduction-letter" className="transition-colors hover:text-moss">
                  Itemized Deduction Letter
                </Link>
              </li>
              <li>
                <Link href="/move-in-checklist" className="transition-colors hover:text-moss">
                  Move-In / Move-Out Checklist
                </Link>
              </li>
              <li>
                <Link href="/prorated-rent-calculator" className="transition-colors hover:text-moss">
                  Prorated Rent Calculator
                </Link>
              </li>
              <li>
                <Link href="/late-fee-calculator" className="transition-colors hover:text-moss">
                  Late Rent Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/rent-receipt-generator" className="transition-colors hover:text-moss">
                  Rent Receipt Generator
                </Link>
              </li>
              <li>
                <Link href="/state" className="transition-colors hover:text-moss">
                  State-by-State Deposit Laws
                </Link>
              </li>
              <li>
                <Link
                  href="/can-a-landlord-charge-for"
                  className="transition-colors hover:text-moss"
                >
                  Wear &amp; Tear vs. Damage
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Popular states
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-sans text-sm">
              {statesData
                .filter((s) =>
                  [
                    "california",
                    "new-york",
                    "texas",
                    "florida",
                    "massachusetts",
                    "illinois",
                  ].includes(s.slug)
                )
                .map((s) => (
                  <li key={s.slug}>
                    <Link href={`/state/${s.slug}`} className="transition-colors hover:text-moss">
                      {s.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-moss">
              Site
            </p>
            <ul className="mt-2 space-y-1 font-sans text-sm">
              <li>
                <Link href="/about" className="transition-colors hover:text-moss">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-moss">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-moss">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="transition-colors hover:text-moss">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-moss">
                  Terms of Service
                </Link>
              </li>
              <li>
                <CookieSettingsLink className="transition-colors hover:text-moss" />
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-ink/10 pt-5 font-sans text-xs text-ink/50">
          <p>
            Landlord Tools provides general information and self-help
            document templates, not legal advice. Deposit laws change and
            local (city or county) ordinances can add stricter rules than
            the state summaries shown here — confirm current requirements
            with your state statute or a local attorney before relying on
            any calculation.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Landlord Tools. All rights reserved.
            {" · "}
            <Link href="/privacy" className="underline hover:text-moss">
              Privacy
            </Link>
            {" · "}
            <Link href="/terms" className="underline hover:text-moss">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
