import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/website")({
  head: () => ({ meta: [{ title: "Management Website — Asari Admin" }] }),
  component: WebsiteCMS,
});

const SECTIONS = [
  { key: "hero", title: "Hero", fields: ["Headline text", "Background image URL"] },
  { key: "products", title: "Produk Unggulan", fields: ["Categories on homepage", "Display order"] },
  { key: "about", title: "Tentang Kami", fields: ["Paragraph 1", "Paragraph 2"] },
  { key: "footer", title: "Footer", fields: ["Operating hours", "Address", "Contact links"] },
  { key: "seo", title: "SEO", fields: ["Meta title", "Meta description"] },
];

function WebsiteCMS() {
  const [open, setOpen] = useState<string | null>("hero");
  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="font-display text-4xl">Management Website</h1>
      <p className="text-sm text-[var(--asari-charcoal)]/70">
        Edit konten halaman utama tanpa menyentuh kode. Perubahan langsung terlihat di situs pelanggan.
      </p>
      <div className="h-px bg-[var(--asari-gold)]" />

      <div className="space-y-3">
        {SECTIONS.map((s) => {
          const expanded = open === s.key;
          return (
            <div key={s.key} className="bg-white rounded-lg border border-[var(--asari-blush-light)]">
              <button
                onClick={() => setOpen(expanded ? null : s.key)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-display text-xl">{s.title}</span>
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
              {expanded && (
                <div className="px-5 pb-5 space-y-3">
                  {s.fields.map((f) => (
                    <label key={f} className="block">
                      <span className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]">{f}</span>
                      <input className="mt-1 w-full border border-[var(--asari-blush-light)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)]" placeholder={`Edit ${f.toLowerCase()}...`} />
                    </label>
                  ))}
                  <button className="bg-[var(--asari-gold)] text-white px-5 py-2 rounded uppercase text-xs tracking-widest">
                    Simpan
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
