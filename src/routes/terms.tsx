import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/CustomerLayout";
import { supabase } from "@/integrations/supabase/client";
import sizeGuideImg from "@/assets/bouquet size guide.png";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms & Conditions — Asari Bouquet & Flower" }],
  }),
  component: TermsPage,
});

type TermsItem    = { id: string; en: string };
type TermsSection = { title: string; items: TermsItem[] };

const DEFAULT_TERMS: TermsSection[] = [
  {
    title: "Order Rules",
    items: [
      { id: "Pemesanan disarankan dilakukan H-3 hingga H-7 sebelum hari pengiriman.", en: "We highly recommend placing your orders 3 to 7 days prior to the delivery date." },
      { id: "Pemesanan dadakan (H-1 / hari H) dapat dilayani apabila slot dan bunga masih tersedia.", en: "Last-minute orders (1 day before or on the day) can be accommodated if delivery slots and flowers are still available." },
      { id: "Setiap rangkaian bunga bersifat unik dan buatan tangan. Hasil akhir mungkin memiliki sedikit perbedaan dengan foto referensi tergantung ketersediaan dan bentuk alami bunga.", en: "Each floral arrangement is unique and handcrafted. The final result may have slight differences from the reference photo depending on the availability and natural shape of the flowers." },
      { id: "Custom order dapat didiskusikan terlebih dahulu dengan admin mengenai ketersediaan bunga dan budget.", en: "Custom orders can be discussed in advance with our admin regarding flower availability and your budget." },
    ],
  },
  {
    title: "Payment",
    items: [
      { id: "Pesanan baru akan diproses dan slot diamankan (secured) setelah Full Payment diterima.", en: "Orders will only be processed and delivery slots secured after Full Payment is received." },
      { id: "Pembayaran dapat dilakukan melalui Transfer Bank (BCA) atau QRIS.", en: "Payments can be made via Bank Transfer (BCA) or QRIS." },
      { id: "Mohon mengirimkan bukti transfer setelah melakukan pembayaran agar pesanan dapat segera dikonfirmasi.", en: "Please send the transfer receipt after making your payment so the order can be confirmed immediately." },
      { id: "Harga yang tertera belum termasuk ongkos kirim (untuk opsi pengiriman).", en: "The listed prices do not include delivery fees (for the delivery option)." },
    ],
  },
  {
    title: "Delivery & Pick Up",
    items: [
      { id: "Pengiriman dilakukan menggunakan kurir instan (Gojek/Grab) dari Antapani, Bandung.", en: "Delivery is carried out using instant couriers (Gojek/Grab) from Antapani, Bandung." },
      { id: "Kerusakan yang terjadi selama proses pengiriman oleh pihak ketiga (kurir) di luar tanggung jawab Asari Bouquet & Flower. Namun, kami akan memastikan packaging seaman mungkin.", en: "Any damage that occurs during the delivery process by third parties (couriers) is beyond the responsibility of Asari Bouquet & Flower. However, we will ensure the packaging is as secure as possible." },
      { id: "Self pick-up dapat dilakukan dengan mengkonfirmasi jam pengambilan kepada admin terlebih dahulu.", en: "Self pick-up can be arranged by confirming the pick-up time with our admin in advance." },
      { id: "Mohon pastikan alamat lengkap dan nomor penerima aktif saat pengiriman.", en: "Please ensure you provide the complete address and an active receiver's phone number for delivery." },
    ],
  },
  {
    title: "Refund & Cancellation",
    items: [
      { id: "Pesanan yang sudah dibayar (confirmed) tidak dapat dibatalkan atau di-refund.", en: "Orders that have been paid (confirmed) cannot be canceled or refunded." },
      { id: "Perubahan tanggal pengiriman atau detail pesanan maksimal dilakukan H-2 (tergantung ketersediaan slot).", en: "Changes to the delivery date or order details can be made up to 2 days before the delivery date (subject to slot availability)." },
      { id: "Jika terjadi kelangkaan bunga mendadak dari supplier, kami akan menginformasikan kepada customer untuk opsi penggantian bunga senilai dengan persetujuan customer.", en: "In the event of a sudden flower shortage from our supplier, we will inform the customer to offer replacement options of equal value, subject to the customer's approval." },
    ],
  },
];

function TermsPage() {
  const [heroImage,   setHeroImage]   = useState<string>(sizeGuideImg);
  const [termsData,   setTermsData]   = useState<TermsSection[]>(DEFAULT_TERMS);

  useEffect(() => {
    (supabase as any)
      .from("site_settings")
      .select("key,value")
      .in("key", ["terms_hero_image", "terms_content"])
      .then(({ data }: { data: { key: string; value: string }[] | null }) => {
        (data ?? []).forEach((row) => {
          if (row.key === "terms_hero_image" && row.value) setHeroImage(row.value);
          if (row.key === "terms_content") {
            try { setTermsData(JSON.parse(row.value)); } catch {}
          }
        });
      });
  }, []);

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-6 py-20 min-h-[70vh]">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-[var(--asari-charcoal)] mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-[var(--asari-charcoal)]/60">
            Harap dibaca dengan saksama sebelum memesan
          </p>
        </div>

        {/* Hero photo (admin-uploaded, falls back to bouquet size guide) */}
        <div className="w-full rounded-xl overflow-hidden mb-12 shadow-sm border border-[var(--asari-blush-light)] bg-white">
          <img src={heroImage} alt="Bouquet Size Guide" className="w-full h-auto object-contain" />
        </div>

        {/* Terms content (admin-editable) */}
        <div className="flex flex-col gap-8">
          {termsData.map((section, idx) => (
            <div key={idx}
              className="bg-white rounded-xl border border-[var(--asari-blush-light)] p-8 md:p-10 shadow-sm">
              <h2 className="font-display text-3xl text-[var(--asari-gold)] mb-6 pb-4 border-b border-[var(--asari-blush-light)]">
                {section.title}
              </h2>
              <ul className="space-y-6">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[var(--asari-gold)] mt-1.5">•</span>
                    <div className="flex flex-col">
                      <span className="text-[17px] font-medium text-[var(--asari-charcoal)]/80 leading-relaxed">
                        {item.id}
                      </span>
                      <span className="text-[15px] italic text-[var(--asari-charcoal)]/50 leading-relaxed mt-1">
                        {item.en}
                      </span>
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
