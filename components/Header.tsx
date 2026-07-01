import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight">
            Landlord Tools
          </span>
          <span className="hidden font-sans text-xs uppercase tracking-widest text-moss sm:inline">
            deposit &amp; move-out
          </span>
        </Link>
        <nav className="flex items-center gap-4 font-sans text-sm font-medium sm:gap-6">
          <Link href="/calculator" className="hover:text-clay">
            Calculator
          </Link>
          <Link href="/deduction-letter" className="hover:text-clay">
            Deduction Letter
          </Link>
          <Link href="/state" className="hover:text-clay">
            State Laws
          </Link>
        </nav>
      </div>
    </header>
  );
}
