import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Our Product", to: "/products" },
  { label: "Terms and Condition", to: "/terms" },
  { label: "About Us", to: "/about" },
] as const;

export function CustomerHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="w-full bg-[var(--asari-off-white)] border-b border-[var(--asari-blush-light)]">
      <div className="relative flex items-center justify-center px-6 py-6">
        <Link to="/" className="flex flex-col items-center leading-none">
          <span className="font-display italic text-4xl text-[var(--asari-gold)] tracking-tight">
            Asari
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--asari-charcoal)] mt-1">
            bouquet &amp; flower
          </span>
        </Link>
        <button
          aria-label="Search"
          className="absolute right-6 text-[var(--asari-charcoal)] hover:text-[var(--asari-gold)] transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex justify-center gap-10 pb-4 text-sm">
        {NAV.map((n) => {
          const active =
            n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`uppercase tracking-widest transition-colors ${
                active
                  ? "text-[var(--asari-gold)] border-b-2 border-[var(--asari-gold)] pb-1"
                  : "text-[var(--asari-charcoal)] hover:text-[var(--asari-gold)]"
              }`}
            >
              {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
