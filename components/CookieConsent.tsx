"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ADSENSE_CLIENT } from "@/lib/site";

const STORAGE_KEY = "lt-cookie-consent";
type Choice = "accepted" | "rejected";

function loadAdSense() {
  if (!ADSENSE_CLIENT) return;
  if (document.getElementById("adsbygoogle-js")) return;
  const s = document.createElement("script");
  s.id = "adsbygoogle-js";
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  s.crossOrigin = "anonymous";
  document.head.appendChild(s);
}

export default function CookieConsent() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: Choice | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY) as Choice | null;
    } catch {
      stored = null;
    }
    setChoice(stored);
    setReady(true);
    if (stored === "accepted") loadAdSense();

    // Let a "Cookie settings" link anywhere on the page reopen the banner.
    const reopen = () => setChoice(null);
    window.addEventListener("lt:open-consent", reopen);
    return () => window.removeEventListener("lt:open-consent", reopen);
  }, []);

  function decide(next: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
    setChoice(next);
    if (next === "accepted") loadAdSense();
  }

  // Don't render until we know the stored choice (avoids a flash), and
  // hide entirely once the visitor has made a decision.
  if (!ready || choice) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-5 shadow-card sm:flex sm:items-center sm:gap-6">
        <p className="font-sans text-sm text-ink/70">
          We use cookies to keep the site running and, if you allow it, to
          measure traffic and show ads that help keep these tools free. See
          our{" "}
          <Link href="/cookies" className="underline hover:text-moss">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-moss">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-lg border border-line px-4 py-2 font-sans text-sm font-semibold text-ink/70 transition-colors hover:border-ink/40"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-lg bg-ink px-4 py-2 font-sans text-sm font-semibold text-white transition-colors hover:bg-ink/90"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
