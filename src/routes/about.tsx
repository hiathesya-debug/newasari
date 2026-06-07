import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Asari Bouquet & Flower" },
      { name: "description", content: "Tentang Asari Bouquet & Flower — florist rumahan di Antapani, Bandung." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="font-display text-5xl text-center text-[var(--asari-gold)] mb-10">
          About Us
        </h1>
        <div className="space-y-6 text-[var(--asari-charcoal)] leading-relaxed">
          <p>
            Asari Bouquet &amp; Flower adalah florist rumahan yang berbasis di Antapani, Bandung.
            Setiap rangkaian kami dibuat dengan tangan, menggunakan bunga segar pilihan, dan
            dikemas dengan penuh perhatian.
          </p>
          <p>
            Kami percaya bahwa bunga bukan sekadar hadiah — bunga adalah cara terindah untuk
            mengantarkan perasaan. Mulai dari hand bouquet sederhana hingga rangkaian custom
            untuk pernikahan, kami siap menemani momen spesial Anda.
          </p>
          <p>
            Pesan langsung melalui WhatsApp atau Instagram. Terima kasih telah memilih Asari.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
