import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-4xl md:text-5xl text-center text-[var(--asari-charcoal)] mb-10">
      {children}
    </h2>
  );
}

export function ViewAllButton({ to }: { to: string }) {
  return (
    <div className="flex justify-center mt-10">
      <Link
        to={to}
        className="border border-[var(--asari-gold)] text-[var(--asari-gold)] text-xs uppercase tracking-[0.25em] px-6 py-3 hover:bg-[var(--asari-gold)] hover:text-white transition-colors"
      >
        View All Products
      </Link>
    </div>
  );
}

export function Divider() {
  return (
    <div className="max-w-7xl mx-auto my-16 px-6">
      <div className="h-px bg-[var(--asari-blush-light)]" />
    </div>
  );
}
