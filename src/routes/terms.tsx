import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Asari Bouquet & Flower" },
      { name: "description", content: "Syarat dan ketentuan pemesanan di Asari Bouquet & Flower." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <CustomerLayout>
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="font-display text-5xl text-center mb-10">Terms &amp; Conditions</h1>
        <div className="space-y-6 text-sm text-[var(--asari-charcoal)] leading-relaxed">
          <Section title="Pemesanan">
            Semua pesanan dilakukan melalui WhatsApp (+62 878-6391-2739) atau Instagram DM
            (@asari.bouquetflowerbdg). Mohon mengisi format pemesanan yang kami sediakan agar
            pesanan dapat diproses dengan cepat.
          </Section>
          <Section title="Pembayaran">
            Pembayaran dapat dilakukan via Transfer Bank, QRIS, atau COD. Pesanan diproses
            setelah pembayaran dikonfirmasi.
          </Section>
          <Section title="Pengambilan & Pengiriman">
            Pesanan dapat diambil langsung di toko (Antapani, Bandung) atau diantar dengan
            biaya tambahan sesuai jarak. Jadwal pengambilan / pengiriman ditentukan saat
            pemesanan.
          </Section>
          <Section title="Refund & Pembatalan">
            Pembatalan paling lambat H-1 sebelum tanggal pengambilan. Bunga yang sudah
            dirangkai tidak dapat di-refund.
          </Section>
          <Section title="Paper Bag">
            Tersedia paper bag dengan biaya tambahan Rp 2.000 per buah.
          </Section>
        </div>
      </div>
    </CustomerLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-xl text-[var(--asari-gold)] mb-2">{title}</h3>
      <p>{children}</p>
    </div>
  );
}
