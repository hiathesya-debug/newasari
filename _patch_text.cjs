const fs   = require("fs");
const path = require("path");

const file = path.join(process.cwd(), "src/routes/admin.website.tsx");
let src = fs.readFileSync(file, "utf8");

// ── 1. Add DEFAULT_TERMS constant before WebsiteCMS function ─────────────────
const DEFAULT_TERMS = `
/* ── Default Terms content (used when no DB value exists yet) ── */
const DEFAULT_TERMS_DATA = [
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
      { id: "Kerusakan yang terjadi selama proses pengiriman oleh pihak ketiga (kurir) di luar tanggung jawab Asari Bouquet & Flower.", en: "Any damage that occurs during the delivery process by third parties (couriers) is beyond the responsibility of Asari Bouquet & Flower." },
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

type TermsItem = { id: string; en: string };
type TermsSection = { title: string; items: TermsItem[] };

`;

src = src.replace(
  "/* ─── Main ── */\nfunction WebsiteCMS()",
  DEFAULT_TERMS + "/* ─── Main ── */\nfunction WebsiteCMS()"
);

// ── 2. Add new state variables after aboutFile state ──────────────────────────
const NEW_STATE = `
  const [aboutPara1, setAboutPara1] = useState("");
  const [aboutPara2, setAboutPara2] = useState("");
  const [termsData, setTermsData]   = useState<TermsSection[]>(DEFAULT_TERMS_DATA);`;

src = src.replace(
  "  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);",
  "  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);" + NEW_STATE
);

// ── 3. Update loadSettings useEffect to also load text content ────────────────
src = src.replace(
  "      setMapsUrl(s.footer_maps_url ?? \"\");\r\n      setHeadlineText(s.hero_headline ?? \"\");\r\n    });",
  `      setMapsUrl(s.footer_maps_url ?? "");
      setHeadlineText(s.hero_headline ?? "");
      setAboutPara1(s.about_para1 ?? "");
      setAboutPara2(s.about_para2 ?? "");
      if (s.terms_content) {
        try { setTermsData(JSON.parse(s.terms_content)); } catch {}
      }
    });`
);

// ── 4. Add new save functions before toggle() ─────────────────────────────────
const NEW_SAVE = `
  async function saveAboutText() {
    setSavingKey("aboutText", true);
    try {
      await Promise.all([
        saveSetting("about_para1", aboutPara1),
        saveSetting("about_para2", aboutPara2),
      ]);
      toast("About Us text updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("aboutText", false);
  }

  async function saveTermsText() {
    setSavingKey("termsText", true);
    try {
      await saveSetting("terms_content", JSON.stringify(termsData));
      toast("Terms & Conditions text updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("termsText", false);
  }

  function updateTermsItem(si: number, ii: number, field: "id" | "en", val: string) {
    setTermsData((prev) => prev.map((s, sx) =>
      sx !== si ? s : {
        ...s,
        items: s.items.map((item, ix) => ix !== ii ? item : { ...item, [field]: val }),
      }
    ));
  }

  function addTermsItem(si: number) {
    setTermsData((prev) => prev.map((s, sx) =>
      sx !== si ? s : { ...s, items: [...s.items, { id: "", en: "" }] }
    ));
  }

  function removeTermsItem(si: number, ii: number) {
    setTermsData((prev) => prev.map((s, sx) =>
      sx !== si ? s : { ...s, items: s.items.filter((_, ix) => ix !== ii) }
    ));
  }

  function updateTermsSectionTitle(si: number, val: string) {
    setTermsData((prev) => prev.map((s, sx) => sx !== si ? s : { ...s, title: val }));
  }

`;

src = src.replace(
  "  const toggle = (k: string) => setOpen",
  NEW_SAVE + "  const toggle = (k: string) => setOpen"
);

// ── 5. Add new text-editing accordion sections before <Toasts /> ─────────────
const NEW_SECTIONS = `
        {/* TEXT — About Us */}
        <Accordion title="Teks Halaman About Us" open={open === "aboutText"} onToggle={() => toggle("aboutText")}
          summary="Edit deskripsi dan kontak di halaman About Us">
          {owner ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">
                  Paragraf 1 <span className="normal-case text-[var(--asari-charcoal)]/40">— deskripsi singkat toko</span>
                </label>
                <textarea value={aboutPara1}
                  onChange={(e) => setAboutPara1(e.target.value)} rows={3}
                  placeholder="Asari Bouquet & Flower adalah florist rumahan..."
                  className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)] resize-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">
                  Paragraf 2 <span className="normal-case text-[var(--asari-charcoal)]/40">— info kontak</span>
                </label>
                <textarea value={aboutPara2}
                  onChange={(e) => setAboutPara2(e.target.value)} rows={2}
                  placeholder="Hubungi kami di WhatsApp..."
                  className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)] resize-none" />
              </div>
              <SaveBtn label="Save About Us Text" saving={!!saving.aboutText} onClick={saveAboutText} />
            </div>
          ) : (
            <div className="space-y-4">
              <ReadOnlyField label="Paragraf 1" value={aboutPara1} />
              <ReadOnlyField label="Paragraf 2" value={aboutPara2} />
            </div>
          )}
        </Accordion>

        {/* TEXT — Terms & Conditions */}
        <Accordion title="Teks Halaman Terms & Conditions" open={open === "termsText"} onToggle={() => toggle("termsText")}
          summary="Edit isi Order Rules, Payment, Delivery, Refund">
          {owner ? (
            <div className="space-y-6">
              {termsData.map((section, si) => (
                <div key={si} className="border border-[var(--asari-blush-light)] rounded-lg p-4 space-y-3">
                  {/* Section title */}
                  <input value={section.title}
                    onChange={(e) => updateTermsSectionTitle(si, e.target.value)}
                    className="w-full font-display text-lg border-b border-[var(--asari-gold)]/30 pb-1 focus:outline-none focus:border-[var(--asari-gold)] bg-transparent"
                    placeholder="Section title" />

                  {/* Items */}
                  {section.items.map((item, ii) => (
                    <div key={ii} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[var(--asari-charcoal)]/50 mb-1">Indonesia</label>
                        <textarea value={item.id} rows={3}
                          onChange={(e) => updateTermsItem(si, ii, "id", e.target.value)}
                          className="w-full border border-[var(--asari-blush-light)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--asari-gold)] resize-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[var(--asari-charcoal)]/50 mb-1">English</label>
                        <textarea value={item.en} rows={3}
                          onChange={(e) => updateTermsItem(si, ii, "en", e.target.value)}
                          className="w-full border border-[var(--asari-blush-light)] rounded px-2 py-1.5 text-xs italic focus:outline-none focus:border-[var(--asari-gold)] resize-none" />
                      </div>
                      <button onClick={() => removeTermsItem(si, ii)}
                        className="mt-5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Remove item">✕</button>
                    </div>
                  ))}

                  <button onClick={() => addTermsItem(si)}
                    className="text-xs text-[var(--asari-gold)] border border-[var(--asari-gold)]/40 px-3 py-1.5 rounded hover:bg-[var(--asari-champagne)]/30 transition-colors">
                    + Tambah poin
                  </button>
                </div>
              ))}
              <SaveBtn label="Save Terms & Conditions" saving={!!saving.termsText} onClick={saveTermsText} />
            </div>
          ) : (
            <p className="text-sm text-[var(--asari-charcoal)]/50 italic">
              Hanya Owner yang dapat mengedit teks Terms & Conditions.
            </p>
          )}
        </Accordion>

`;

src = src.replace(
  "      <Toasts list={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />",
  NEW_SECTIONS + "      <Toasts list={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />"
);

fs.writeFileSync(file, src, "utf8");
console.log("OK admin.website.tsx patched with About Us and Terms text editors");
