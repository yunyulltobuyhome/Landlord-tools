import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-bold tracking-tight">
            Landlord Tools
          </span>
          <span className="hidden font-sans text-xs uppercase tracking-widest text-ink/40 sm:inline">
            deposit &amp; move-out
          </span>
        </Link>
        <nav className="hidden items-center gap-6 font-sans text-sm font-medium text-ink/70 md:flex">
          <Link href="/calculator" className="transition-colors hover:text-moss">
            Deposit Calculator
          </Link>
          <Link href="/deduction-letter" className="transition-colors hover:text-moss">
            Deduction Letter
          </Link>
          <Link href="/tools" className="transition-colors hover:text-moss">
            All Tools
          </Link>
          <Link href="/state" className="transition-colors hover:text-moss">
            State Laws
          </Link>
        </nav>
        <nav className="flex items-center gap-4 font-sans text-sm font-medium text-ink/70 md:hidden">
          <Link href="/tools" className="transition-colors hover:text-moss">
            Tools
          </Link>
          <Link href="/state" className="transition-colors hover:text-moss">
            States
          </Link>
        </nav>
      </div>
    </header>
  );
}
