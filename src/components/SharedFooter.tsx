import { Instagram } from "lucide-react";

export function SharedFooter() {
  return (
    <footer className="bg-[var(--asari-brown)] text-[var(--asari-off-white)] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex flex-col leading-none">
            <span className="font-display italic text-4xl text-[var(--asari-off-white)]">
              Asari
            </span>
            <span className="text-[10px] tracking-[0.3em] uppercase mt-1 text-[var(--asari-champagne)]">
              bouquet &amp; flower
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-[var(--asari-champagne)] max-w-xs">
            Florist rumahan di Antapani, Bandung. Setiap rangkaian kami kerjakan
            dengan tangan, dari hati, untuk momen istimewamu.
          </p>
        </div>
        <div>
          <h4 className="font-display text-xl mb-4 text-[var(--asari-off-white)]">
            Category
          </h4>
          <ul className="space-y-2 text-sm text-[var(--asari-champagne)]">
            <li>Freshest Series</li>
            <li>Fresh Bouquet</li>
            <li>Hand Bouquet</li>
            <li>Flower Vase</li>
            <li>Custom Order</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl mb-4 text-[var(--asari-off-white)]">
            Contact Us
          </h4>
          <ul className="space-y-2 text-sm text-[var(--asari-champagne)]">
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4" /> @asari.bouquetflowerbdg
            </li>
            <li>TikTok: @asari.bouquetflowerbdg</li>
            <li>WA: +62 878-6391-2739</li>
            <li>Antapani, Bandung</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--asari-champagne)]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 text-xs text-[var(--asari-champagne)]/80 text-center">
          © {new Date().getFullYear()} Asari Bouquet &amp; Flower. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
