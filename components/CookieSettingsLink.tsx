"use client";

export default function CookieSettingsLink({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("lt:open-consent"))}
      className={className}
    >
      Cookie settings
    </button>
  );
}
