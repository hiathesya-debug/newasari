import { createFileRoute } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/CustomerLayout";
import sizeGuideImg from "@/assets/bouquet-size-guide.png";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Asari Bouquet & Flower" },
      { name: "description", content: "Syarat dan ketentuan pemesanan di Asari Bouquet & Flower." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const termsData = [
    {
      title: "Order Rules",
      items: [
        { id: "Pemesanan disarankan dilakukan minimal H-2 sebelum hari pengiriman.", en: "Please place your orders at least two days in advance (D-2)." },
        { id: "Pemesanan dadakan hanya dilayani untuk bunga yang tersedia (ready stock).", en: "Last-minute orders are only accepted for ready-stock flowers." },
        { id: "Custom order disarankan dipesan jauh hari sebelumnya.", en: "We highly recommend placing custom orders well in advance." },
        { id: "Pemesanan hanya diproses melalui Instagram DM atau WhatsApp.", en: "Orders are exclusively processed via Instagram Direct Message (DM) or WhatsApp." },
        { id: "Kami berbasis di Antapani, Bandung dan beroperasi secara online (tanpa toko fisik).", en: "We are based in Antapani, Bandung and operate exclusively online (no physical storefront)." }
      ]
    },
    {
      title: "Payment",
      items: [
        { id: "Pesanan akan diproses setelah Full Payment atau DP diterima.", en: "Orders will be processed upon receipt of full payment or a down payment (DP)." },
        { id: "Pembayaran wajib melalui transfer bank.", en: "We strictly accept payments via bank transfer." },
        { id: "Mohon kirimkan bukti transfer melalui chat untuk verifikasi.", en: "Please send proof of payment via chat to verify your transaction." },
        { id: "DP minimal 50% berlaku untuk pembelian di atas Rp100.000.", en: "A minimum 50% DP applies to purchases of IDR 100,000 and above." }
      ]
    },
    {
      title: "Pickup & Delivery",
      items: [
        { id: "Harap hubungi admin segera melalui chat untuk perubahan jadwal pengambilan.", en: "Please notify our admin immediately via chat for schedule changes." },
        { id: "Pengambilan buket tidak bisa dilakukan lebih awal dari jadwal tanpa konfirmasi.", en: "Bouquets cannot be collected earlier than the scheduled time without confirmation." },
        { id: "Bisa melakukan self-pickup atau menggunakan kurir pribadi.", en: "You may opt for self-pickup or arrange your own courier service." },
        { id: "Pengiriman luar kota tidak tersedia karena sifat bunga yang mudah rusak.", en: "Out-of-town shipping is not available due to the delicate nature of fresh flowers." }
      ]
    },
    {
      title: "Disclaimer",
      items: [
        { id: "Pesanan yang sudah dibayar tidak dapat dibatalkan atau di-refund.", en: "All sales are final. Purchased items cannot be returned or refunded." },
        { id: "Karena dirangkai tangan, hasil akhir mungkin berbeda dari foto referensi.", en: "Because our arrangements are handcrafted, the final result may vary from reference photos." },
        { id: "Jika bunga tertentu kosong, kami akan mengganti dengan bunga senilai.", en: "If a specific flower is unavailable, we will substitute it with a similar flower of equal value." },
        { id: "Bunga segar bertahan ± 3-4 hari jika dirawat dengan baik.", en: "Our flowers typically stay fresh for ± 3-4 days with proper care." },
        { id: "Revisi desain setelah selesai akan dikenakan biaya tambahan 25%.", en: "Design revisions requested after completion may incur a 25% surcharge." }
      ]
    }
  ];

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-6 py-20 min-h-[70vh]">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-[var(--asari-charcoal)] mb-4">Terms & Conditions</h1>
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--asari-charcoal)]/60">Harap dibaca dengan saksama sebelum memesan</p>
        </div>

        <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden mb-12 shadow-sm border border-[var(--asari-blush-light)] bg-white">
          <img src={sizeGuideImg} alt="Bouquet Size Guide" className="w-full h-auto object-contain" />
        </div>

        <div className="flex flex-col gap-8">
          {termsData.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-[var(--asari-blush-light)] p-8 md:p-10 shadow-sm">
              <h2 className="font-display text-3xl text-[var(--asari-gold)] mb-6 pb-4 border-b border-[var(--asari-blush-light)]">{section.title}</h2>
              <ul className="space-y-6">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[var(--asari-gold)] mt-1.5">•</span>
                    <div className="flex flex-col">
                      <span className="text-[17px] font-medium text-[var(--asari-charcoal)]/80 leading-relaxed">{item.id}</span>
                      <span className="text-[15px] italic text-[var(--asari-charcoal)]/50 leading-relaxed mt-1">{item.en}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}