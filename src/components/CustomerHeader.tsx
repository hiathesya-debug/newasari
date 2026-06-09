import { Link, useRouterState } from "@tanstack/react-router";
import { Search, User, LogOut } from "lucide-react";
import { useAuth, signOut } from "@/lib/auth";
import { useState, useRef, useEffect } from "react";
import logoImg from "@/assets/icon/logo.png";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Our Product", to: "/products" },
  { label: "Reviews", to: "/reviews" },
  { label: "Terms and Condition", to: "/terms" },
  { label: "About Us", to: "/about" },
] satisfies { label: string; to: string }[];

export function CustomerHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = user?.name?.charAt(0).toUpperCase() ?? "U";
  return (
    <header className="w-full bg-[var(--asari-off-white)] border-b border-[var(--asari-blush-light)]">
      <div className="relative flex items-center justify-center px-6 py-6">
        <Link to="/">
          <img
            src={logoImg}
            alt="Asari Bouquet & Flower"
            className="h-16 w-auto object-contain"
          />
        </Link>
        <div className="absolute right-6 flex items-center gap-4">
          <button aria-label="Search" className="text-[var(--asari-charcoal)] hover:text-[var(--asari-gold)]">
            <Search className="h-5 w-5" />
          </button>
          {user && user.role === "customer" ? (
            <div className="relative" ref={ref}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="h-8 w-8 rounded-full bg-[var(--asari-peach)] text-[var(--asari-charcoal)] flex items-center justify-center text-xs font-medium"
             >
                {initials}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-[var(--asari-blush-light)] rounded shadow-sm py-1 z-20">
                  <Link to="/account" className="block px-3 py-2 text-sm hover:bg-[var(--asari-peach)]/20">My Account</Link>
                  <button
                    onClick={async () => { await signOut(); setOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 inline-flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-[var(--asari-charcoal)] hover:text-[var(--asari-gold)] text-xs uppercase tracking-widest inline-flex items-center gap-1">
              <User className="h-4 w-4" /> Sign In
            </Link>
          )}
        </div>
      </div>
      <nav className="flex justify-center gap-8 pb-4 text-sm flex-wrap">
        {NAV.map((n) => {
          const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
             to={n.to as any}
              className={`font-display uppercase tracking-widest transition-colors ${
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