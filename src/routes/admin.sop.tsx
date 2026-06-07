import { createFileRoute } from "@tanstack/react-router";
import { ORDER_TEMPLATE } from "@/lib/parseOrder";

export const Route = createFileRoute("/admin/sop")({
  head: () => ({ meta: [{ title: "Standard Operating Procedure — Asari" }] }),
  component: SOPPage,
});

function SOPPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="font-display text-4xl">Standard Operating Procedure</h1>
      <p className="text-sm text-[var(--asari-charcoal)]/70">
        Panduan operasional untuk tim Asari Bouquet &amp; Flower.
      </p>
      <div className="h-px bg-[var(--asari-gold)]" />

      <Sop title="1. Cara Menerima Pesanan via WhatsApp">
        <p>Pelanggan akan mengirim pesan menggunakan template format pemesanan resmi:</p>
        <pre className="bg-[var(--asari-champagne)]/30 rounded p-4 text-xs whitespace-pre-wrap font-mono mt-2">
          {ORDER_TEMPLATE.replace("{PRODUCT}", "")}
        </pre>
        <p className="mt-2">Pastikan pelanggan mengisi seluruh kolom yang bertanda <em>cetak tebal</em>.</p>
      </Sop>

      <Sop title="2. Cara Input Pesanan ke Sistem">
        <ol className="list-decimal pl-5 space-y-1">
          <li>Buka halaman <strong>Orders → Tambah Pesanan</strong>.</li>
          <li>Copy seluruh pesan WhatsApp dari pelanggan.</li>
          <li>Tempel di kolom <em>Tempel Pesan WhatsApp</em>.</li>
          <li>Klik <em>Proses Pesan →</em>. Form akan terisi otomatis.</li>
          <li>Periksa kembali setiap kolom — terutama nama produk, tanggal, dan alamat.</li>
          <li>Pilih metode pembayaran dan simpan pesanan.</li>
        </ol>
      </Sop>

      <Sop title="3. Alur Status Pesanan">
        <div className="flex flex-wrap gap-2 items-center text-sm">
          {["Pending", "Dikonfirmasi", "Diproses", "Siap", "Selesai"].map((s, i, a) => (
            <span key={s} className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[var(--asari-champagne)]/50 rounded">{s}</span>
              {i < a.length - 1 && <span>→</span>}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs">Atau: <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded">Dibatalkan</span> jika pesanan dibatalkan pelanggan.</p>
      </Sop>

      <Sop title="4. Ketentuan Pengiriman">
        <ul className="list-disc pl-5 space-y-1">
          <li>Area pengiriman: dalam kota Bandung.</li>
          <li>Biaya antar disesuaikan jarak (Rp 15.000 – Rp 50.000).</li>
          <li>Minimum order untuk delivery: Rp 100.000.</li>
        </ul>
      </Sop>

      <Sop title="5. Ketentuan Pembayaran">
        <ul className="list-disc pl-5 space-y-1">
          <li>Transfer Bank (BCA / Mandiri) — pesanan diproses setelah bukti transfer diterima.</li>
          <li>QRIS — instan, langsung diproses.</li>
          <li>COD — hanya untuk metode <em>Ambil di Store</em>.</li>
        </ul>
      </Sop>

      <Sop title="6. Panduan Handling Bunga">
        <ul className="list-disc pl-5 space-y-1">
          <li>Simpan bunga di tempat sejuk, hindari sinar matahari langsung.</li>
          <li>Ganti air vase setiap 2 hari sekali.</li>
          <li>Potong batang miring sebelum di-arrange untuk daya serap maksimal.</li>
        </ul>
      </Sop>

      <Sop title="7. FAQ Internal">
        <p><strong>Q: Pelanggan request bunga di luar katalog?</strong><br/>A: Tawarkan opsi Custom Order — minta brief warna, tema, dan budget.</p>
        <p className="mt-2"><strong>Q: Stok habis tapi pelanggan tetap order?</strong><br/>A: Tawarkan produk serupa atau jadwalkan ulang sesuai ketersediaan.</p>
      </Sop>
    </div>
  );
}

function Sop({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
      <h2 className="font-display text-2xl mb-3 text-[var(--asari-gold)]">{title}</h2>
      <div className="text-sm text-[var(--asari-charcoal)] space-y-2 leading-relaxed">{children}</div>
    </section>
  );
}
