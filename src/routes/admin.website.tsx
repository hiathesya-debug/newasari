import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, Upload, Pencil, Copy, Check, ExternalLink, Loader2, MapPin, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, isOwner } from "@/lib/auth";

export const Route = createFileRoute("/admin/website")({
  head: () => ({ meta: [{ title: "Management Website — Asari Admin" }] }),
  component: WebsiteCMS,
});

type ToastMsg = { id: number; message: string; ok: boolean };
type Settings = Record<string, string>;
type TermsItem    = { id: string; en: string };
type TermsSection = { title: string; items: TermsItem[] };

// ── Default terms content ─────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
async function loadSettings(): Promise<Settings> {
  const { data } = await (supabase as any).from("site_settings").select("key,value");
  return Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]));
}
async function saveSetting(key: string, value: string) {
  const { error } = await (supabase as any)
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}
async function uploadFile(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from("site-assets").getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ── View Only Banner ──────────────────────────────────────────────────────────
function ViewOnlyBanner() {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg border-l-[3px] border-[var(--asari-gold)]"
      style={{ backgroundColor: "rgba(242,218,172,0.6)" }}>
      <Eye className="h-4 w-4 text-[var(--asari-gold)] shrink-0 mt-0.5" />
      <p className="text-[13px] text-[var(--asari-charcoal)]">
        <span className="font-semibold">View Only</span> — You do not have permission to edit this page.
        Contact the owner to make changes.
      </p>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toasts({ list, dismiss }: { list: ToastMsg[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {list.map((t) => (
        <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm text-white ${t.ok ? "bg-emerald-600" : "bg-red-600"}`}>
          {t.ok ? <Check className="h-4 w-4 shrink-0" /> : <span>✕</span>}
          {t.message}
          <button onClick={() => dismiss(t.id)} className="ml-2 opacity-70 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}

// ── Copy Button ───────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 text-[var(--asari-charcoal)]/40 hover:text-[var(--asari-gold)]">
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ── Upload Zone ───────────────────────────────────────────────────────────────
function UploadZone({ label, hint, accept, maxMB, aspect, currentUrl, onFile, readOnly }: {
  label: string; hint: string; accept: string; maxMB: number;
  aspect?: string; currentUrl?: string; onFile: (f: File) => void; readOnly?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handle = useCallback((file: File) => {
    if (readOnly) return;
    const types = accept.split(",").map((s) => s.trim().toLowerCase());
    const ext = "." + file.name.split(".").pop()!.toLowerCase();
    if (!types.some((t) => file.type.includes(t.replace(".", "")) || t === ext)) { alert(`Format tidak didukung. Gunakan: ${accept}`); return; }
    if (file.size > maxMB * 1024 * 1024) { alert(`Ukuran maksimal ${maxMB} MB.`); return; }
    setPreview(URL.createObjectURL(file));
    onFile(file);
  }, [onFile, accept, maxMB, readOnly]);

  const displayUrl = preview ?? currentUrl;

  if (readOnly) {
    return (
      <div className={`overflow-hidden rounded-lg border border-[var(--asari-blush-light)] bg-[var(--asari-champagne)]/10 ${aspect ?? "aspect-video"}`}>
        {displayUrl
          ? <img src={displayUrl} alt="preview" className="w-full h-full object-contain" />
          : <div className="w-full h-full flex items-center justify-center text-xs text-[var(--asari-charcoal)]/40">Belum ada gambar</div>
        }
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayUrl && (
        <div className={`relative group overflow-hidden rounded-lg border border-[var(--asari-blush-light)] bg-[var(--asari-champagne)]/20 ${aspect ?? "aspect-video"}`}>
          <img src={displayUrl} alt="preview" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm">
            <Pencil className="h-4 w-4" /> Change
          </div>
        </div>
      )}
      {preview && currentUrl && (
        <div className="grid grid-cols-2 gap-3 text-xs text-center text-[var(--asari-charcoal)]/60">
          <div><img src={currentUrl} alt="current" className="w-full h-24 object-contain rounded border border-[var(--asari-blush-light)] mb-1" />Current</div>
          <div><img src={preview} alt="new" className="w-full h-24 object-contain rounded border-2 border-[var(--asari-gold)] mb-1" />New</div>
        </div>
      )}
      <div onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); }}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${dragging ? "border-[var(--asari-gold)] bg-[var(--asari-champagne)]/40" : "border-[var(--asari-gold)] bg-[var(--asari-champagne)]/20 hover:bg-[var(--asari-champagne)]/30"}`}>
        <Upload className="h-8 w-8 mx-auto text-[var(--asari-gold)] mb-2" />
        <p className="text-sm font-medium text-[var(--asari-charcoal)]">{label}</p>
        <p className="text-xs text-[var(--asari-charcoal)]/60 mt-1">{hint}</p>
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])} />
    </div>
  );
}

// ── Read-only field ───────────────────────────────────────────────────────────
function ReadOnlyField({ label, value, placeholder }: { label: string; value: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">{label}</label>
      <div className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm bg-[var(--asari-champagne)]/10 text-[var(--asari-charcoal)]/60 min-h-[38px]">
        {value || <span className="italic">{placeholder ?? "—"}</span>}
      </div>
    </div>
  );
}

// ── Save Button ───────────────────────────────────────────────────────────────
function SaveBtn({ label, saving, onClick }: { label: string; saving: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={saving}
      className="w-full flex items-center justify-center gap-2 bg-[var(--asari-gold)] hover:bg-[var(--asari-gold-light)] text-white text-sm font-semibold py-3 rounded-lg transition-colors disabled:opacity-60">
      {saving && <Loader2 className="h-4 w-4 animate-spin" />}
      {saving ? "Saving..." : label}
    </button>
  );
}

// ── Accordion ─────────────────────────────────────────────────────────────────
function Accordion({ title, summary, open, onToggle, children }: {
  title: string; summary?: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[var(--asari-blush-light)] overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[var(--asari-champagne)]/10 transition-colors">
        <div>
          <span className="font-display text-2xl text-[var(--asari-charcoal)]">{title}</span>
          {summary && !open && <p className="text-xs text-[var(--asari-charcoal)]/50 mt-0.5">{summary}</p>}
        </div>
        <ChevronDown className={`h-5 w-5 text-[var(--asari-gold)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-6 pt-2 space-y-5 border-t border-[var(--asari-blush-light)]">{children}</div>}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]/60 pt-2">{title}</h3>
      {children}
    </div>
  );
}

// ── Contact Field ─────────────────────────────────────────────────────────────
function ContactField({ label, namePlaceholder, nameValue, onNameChange,
  autoLink, linkValue, onLinkChange, isManual, onToggleManual, warn, readOnly }: {
  label: string; namePlaceholder: string; nameValue: string; onNameChange: (v: string) => void;
  autoLink: string; linkValue: string; onLinkChange: (v: string) => void;
  isManual: boolean; onToggleManual: () => void; warn?: string; readOnly?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest font-semibold text-[var(--asari-charcoal)]">{label}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[var(--asari-charcoal)]/50 mb-1">Tampil ke customer</label>
          {readOnly ? (
            <div className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm bg-[var(--asari-champagne)]/10 text-[var(--asari-charcoal)]/60">
              {nameValue || <span className="italic">—</span>}
            </div>
          ) : (
            <input value={nameValue} onChange={(e) => onNameChange(e.target.value)} placeholder={namePlaceholder}
              className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)]" />
          )}
          {warn && <p className="text-xs text-amber-500 mt-1">{warn}</p>}
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-[var(--asari-charcoal)]/50">Link URL</label>
            {!readOnly && (
              <button onClick={onToggleManual} className="text-[10px] text-[var(--asari-gold)] hover:underline">
                {isManual ? "↺ Auto" : "✎ Edit manual"}
              </button>
            )}
          </div>
          {!readOnly && isManual ? (
            <input value={linkValue} onChange={(e) => onLinkChange(e.target.value)} placeholder="https://..."
              className="w-full border-2 border-[var(--asari-gold)] rounded-lg px-3 py-2 text-sm focus:outline-none" />
          ) : (
            <div className="flex items-center gap-2 border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 bg-[var(--asari-champagne)]/20 min-h-[38px]">
              <span className="flex-1 text-xs text-[var(--asari-charcoal)]/50 truncate">{autoLink || "—"}</span>
              {autoLink && <CopyBtn text={autoLink} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
function WebsiteCMS() {
  const user  = useAuth();
  const owner = isOwner(user);

  const [open, setOpen]     = useState<string>("header");
  const [settings, setSettings] = useState<Settings>({});
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  // Footer / header state
  const [igHandle, setIgHandle]           = useState("");
  const [igManual, setIgManual]           = useState(false);
  const [igLinkOverride, setIgLinkOverride] = useState("");
  const [ttHandle, setTtHandle]           = useState("");
  const [ttManual, setTtManual]           = useState(false);
  const [ttLinkOverride, setTtLinkOverride] = useState("");
  const [waNumber, setWaNumber]           = useState("");
  const [waManual, setWaManual]           = useState(false);
  const [waLinkOverride, setWaLinkOverride] = useState("");
  const [addressText, setAddressText]     = useState("");
  const [mapsUrl, setMapsUrl]             = useState("");
  const [headlineText, setHeadlineText]   = useState("");

  // File uploads
  const [headerFile, setHeaderFile]           = useState<File | null>(null);
  const [bannerFile, setBannerFile]           = useState<File | null>(null);
  const [footerLogoFile, setFooterLogoFile]   = useState<File | null>(null);
  const [termsFile, setTermsFile]             = useState<File | null>(null);
  const [aboutFile, setAboutFile]             = useState<File | null>(null);

  // Text content
  const [aboutPara1, setAboutPara1]   = useState("");
  const [aboutPara2, setAboutPara2]   = useState("");
  const [termsData, setTermsData]     = useState<TermsSection[]>(DEFAULT_TERMS);

  useEffect(() => {
    loadSettings().then((s) => {
      setSettings(s);
      setIgHandle(s.footer_ig_handle ?? "");
      setTtHandle(s.footer_tiktok_handle ?? "");
      setWaNumber(s.footer_wa_number ?? "");
      setAddressText(s.footer_address_text ?? "");
      setMapsUrl(s.footer_maps_url ?? "");
      setHeadlineText(s.hero_headline ?? "");
      setAboutPara1(s.about_para1 ?? "");
      setAboutPara2(s.about_para2 ?? "");
      if (s.terms_content) {
        try { setTermsData(JSON.parse(s.terms_content)); } catch {}
      }
    });
  }, []);

  const toast = (message: string, ok = true) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, ok }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };
  const setSavingKey = (k: string, v: boolean) => setSaving((p) => ({ ...p, [k]: v }));

  const igLink = igManual ? igLinkOverride : `https://instagram.com/${igHandle.replace("@", "")}`;
  const ttLink = ttManual ? ttLinkOverride : `https://tiktok.com/@${ttHandle.replace("@", "")}`;
  const waLink = waManual ? waLinkOverride : `https://wa.me/62${waNumber.replace(/^0/, "").replace(/\D/g, "")}`;

  const waWarn   = waNumber && !/^(08|\+62)\d{8,11}$/.test(waNumber.replace(/[-\s]/g, "")) ? "Nomor tidak valid. Contoh: 0878-6391-2739" : undefined;
  const mapsWarn = mapsUrl  && !/(maps\.google|goo\.gl\/maps|maps\.app\.goo\.gl)/.test(mapsUrl) ? "Bukan link Google Maps — pastikan URL benar." : undefined;

  // ── Save functions ──────────────────────────────────────────────────────────
  async function saveHeader() {
    setSavingKey("header", true);
    try {
      if (headerFile) {
        const url = await uploadFile(headerFile, `header-logo-${Date.now()}.${headerFile.name.split(".").pop()}`);
        await saveSetting("header_logo_url", url);
        setSettings((p) => ({ ...p, header_logo_url: url }));
      }
      toast("Header logo updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("header", false);
  }

  async function saveBanner() {
    setSavingKey("banner", true);
    try {
      if (bannerFile) {
        const url = await uploadFile(bannerFile, `hero-banner-${Date.now()}.${bannerFile.name.split(".").pop()}`);
        await saveSetting("hero_banner_url", url);
        setSettings((p) => ({ ...p, hero_banner_url: url }));
      }
      await saveSetting("hero_headline", headlineText);
      toast("Hero banner updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("banner", false);
  }

  async function saveFooterLogo() {
    setSavingKey("footerLogo", true);
    try {
      if (footerLogoFile) {
        const url = await uploadFile(footerLogoFile, `footer-logo-${Date.now()}.${footerLogoFile.name.split(".").pop()}`);
        await saveSetting("footer_logo_url", url);
        setSettings((p) => ({ ...p, footer_logo_url: url }));
      }
      toast("Footer logo updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("footerLogo", false);
  }

  async function saveContact() {
    setSavingKey("contact", true);
    try {
      await Promise.all([
        saveSetting("footer_ig_handle", igHandle),
        saveSetting("footer_ig_url", igLink),
        saveSetting("footer_tiktok_handle", ttHandle),
        saveSetting("footer_tiktok_url", ttLink),
        saveSetting("footer_wa_number", waNumber),
        saveSetting("footer_wa_url", waLink),
      ]);
      toast("Contact updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("contact", false);
  }

  async function saveAddress() {
    setSavingKey("address", true);
    try {
      await Promise.all([saveSetting("footer_address_text", addressText), saveSetting("footer_maps_url", mapsUrl)]);
      toast("Address updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("address", false);
  }

  async function saveTermsPhoto() {
    setSavingKey("termsPhoto", true);
    try {
      if (termsFile) {
        const url = await uploadFile(termsFile, `terms-photo-${Date.now()}.${termsFile.name.split(".").pop()}`);
        await saveSetting("terms_hero_image", url);
        setSettings((p) => ({ ...p, terms_hero_image: url }));
      }
      toast("Terms photo updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("termsPhoto", false);
  }

  async function saveAboutPhoto() {
    setSavingKey("aboutPhoto", true);
    try {
      if (aboutFile) {
        const url = await uploadFile(aboutFile, `about-photo-${Date.now()}.${aboutFile.name.split(".").pop()}`);
        await saveSetting("about_hero_image", url);
        setSettings((p) => ({ ...p, about_hero_image: url }));
      }
      toast("About photo updated.");
    } catch { toast("Failed to save.", false); }
    setSavingKey("aboutPhoto", false);
  }

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

  // Terms inline editing helpers
  function updateItem(si: number, ii: number, field: "id" | "en", val: string) {
    setTermsData((prev) => prev.map((s, sx) =>
      sx !== si ? s : { ...s, items: s.items.map((item, ix) => ix !== ii ? item : { ...item, [field]: val }) }
    ));
  }
  function addItem(si: number) {
    setTermsData((prev) => prev.map((s, sx) =>
      sx !== si ? s : { ...s, items: [...s.items, { id: "", en: "" }] }
    ));
  }
  function removeItem(si: number, ii: number) {
    setTermsData((prev) => prev.map((s, sx) =>
      sx !== si ? s : { ...s, items: s.items.filter((_, ix) => ix !== ii) }
    ));
  }
  function updateSectionTitle(si: number, val: string) {
    setTermsData((prev) => prev.map((s, sx) => sx !== si ? s : { ...s, title: val }));
  }

  const toggle = (k: string) => setOpen((p) => (p === k ? "" : k));

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-4xl md:text-5xl text-[var(--asari-charcoal)]">Management Website</h1>
        <p className="text-sm text-[var(--asari-charcoal)]/60 mt-2 max-w-xl">
          Edit konten halaman utama tanpa menyentuh kode. Perubahan langsung terlihat di situs pelanggan.
        </p>
        <div className="h-px bg-[var(--asari-gold)] mt-5" />
      </div>

      {!owner && <ViewOnlyBanner />}

      <div className="space-y-3">

        {/* 1 — Header */}
        <Accordion title="Header" open={open === "header"} onToggle={() => toggle("header")}>
          <UploadZone label="Upload New Logo" hint="PNG, SVG, JPG · Max 2 MB · Transparent background recommended"
            accept=".png,.svg,.jpg,.jpeg,image/png,image/svg+xml,image/jpeg" maxMB={2} aspect="aspect-[3/1]"
            currentUrl={settings.header_logo_url} onFile={setHeaderFile} readOnly={!owner} />
          {owner && <SaveBtn label="Save Header" saving={!!saving.header} onClick={saveHeader} />}
        </Accordion>

        {/* 2 — Banner */}
        <Accordion title="Banner Halaman Utama" open={open === "banner"} onToggle={() => toggle("banner")}>
          <UploadZone label="Upload New Banner Photo" hint="JPG, PNG, WEBP · Max 5 MB · Landscape, min 1440×600px"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" maxMB={5} aspect="aspect-[16/5]"
            currentUrl={settings.hero_banner_url} onFile={setBannerFile} readOnly={!owner} />
          {owner ? (
            <>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">
                  Headline Text <span className="normal-case text-[var(--asari-charcoal)]/40">(max 60 karakter)</span>
                </label>
                <input value={headlineText} onChange={(e) => setHeadlineText(e.target.value.slice(0, 60))}
                  placeholder="Asari Bouquet & Flower"
                  className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)]" />
                <p className="text-xs text-[var(--asari-charcoal)]/40 text-right mt-0.5">{headlineText.length}/60</p>
              </div>
              <SaveBtn label="Save Banner" saving={!!saving.banner} onClick={saveBanner} />
            </>
          ) : (
            <ReadOnlyField label="Headline Text" value={headlineText} placeholder="Asari Bouquet & Flower" />
          )}
        </Accordion>

        {/* 3 — Footer */}
        <Accordion title="Footer" open={open === "footer"} onToggle={() => toggle("footer")}>
          <SubSection title="3a — Footer Logo">
            <UploadZone label="Upload Footer Logo" hint="PNG, SVG · Versi putih/terang (background footer adalah gradient)"
              accept=".png,.svg,image/png,image/svg+xml" maxMB={2} aspect="aspect-[3/1]"
              currentUrl={settings.footer_logo_url} onFile={setFooterLogoFile} readOnly={!owner} />
            {owner && <SaveBtn label="Save Footer Logo" saving={!!saving.footerLogo} onClick={saveFooterLogo} />}
          </SubSection>
          <div className="h-px bg-[var(--asari-blush-light)]" />
          <SubSection title="3b — Contact & Direct Links">
            <ContactField label="Instagram" namePlaceholder="@asari.bouquetflowerbdg"
              nameValue={igHandle} onNameChange={setIgHandle}
              autoLink={igHandle ? igLink : ""} linkValue={igLink} onLinkChange={setIgLinkOverride}
              isManual={igManual} onToggleManual={() => { setIgManual((v) => !v); setIgLinkOverride(igLink); }}
              readOnly={!owner} />
            <ContactField label="TikTok" namePlaceholder="@asari.bouquetflowerbdg"
              nameValue={ttHandle} onNameChange={setTtHandle}
              autoLink={ttHandle ? ttLink : ""} linkValue={ttLink} onLinkChange={setTtLinkOverride}
              isManual={ttManual} onToggleManual={() => { setTtManual((v) => !v); setTtLinkOverride(ttLink); }}
              readOnly={!owner} />
            <ContactField label="WhatsApp" namePlaceholder="0878-6391-2739"
              nameValue={waNumber} onNameChange={setWaNumber}
              autoLink={waNumber ? waLink : ""} linkValue={waLink} onLinkChange={setWaLinkOverride}
              isManual={waManual} onToggleManual={() => { setWaManual((v) => !v); setWaLinkOverride(waLink); }}
              warn={!owner ? undefined : waWarn} readOnly={!owner} />
            {owner && <SaveBtn label="Save Contact" saving={!!saving.contact} onClick={saveContact} />}
          </SubSection>
          <div className="h-px bg-[var(--asari-blush-light)]" />
          <SubSection title="3c — Alamat & Google Maps">
            {owner ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">Teks Alamat</label>
                  <textarea value={addressText} onChange={(e) => setAddressText(e.target.value)}
                    placeholder="Antapani, Bandung" rows={3}
                    className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)] resize-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">Google Maps Link</label>
                  <p className="text-xs text-[var(--asari-charcoal)]/50 mb-1.5">Google Maps → cari toko → klik <em>Share</em> → copy link.</p>
                  <input value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..."
                    className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)]" />
                  {mapsWarn && <p className="text-xs text-amber-500 mt-1">{mapsWarn}</p>}
                  {mapsUrl && !mapsWarn && (
                    <a href={mapsUrl} target="_blank" rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--asari-gold)] hover:underline">
                      <MapPin className="h-3.5 w-3.5" /> Lihat di Maps <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <ReadOnlyField label="Teks Alamat" value={addressText} placeholder="Antapani, Bandung" />
                <div>
                  <ReadOnlyField label="Google Maps Link" value={mapsUrl} placeholder="—" />
                  {mapsUrl && (
                    <a href={mapsUrl} target="_blank" rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--asari-gold)] hover:underline">
                      <MapPin className="h-3.5 w-3.5" /> Lihat di Maps <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}
            {owner && <SaveBtn label="Save Address" saving={!!saving.address} onClick={saveAddress} />}
          </SubSection>
        </Accordion>

        {/* 4 — Terms & Conditions foto */}
        <Accordion title="Foto — Terms & Conditions" open={open === "termsPhoto"} onToggle={() => toggle("termsPhoto")}
          summary="Ganti foto/infografis di bagian atas halaman Terms">
          <UploadZone label="Upload Foto Terms & Conditions"
            hint="JPG, PNG, WEBP · Max 5 MB · Landscape, default: Bouquet Size Guide"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" maxMB={5}
            currentUrl={settings.terms_hero_image} onFile={setTermsFile} readOnly={!owner} />
          {owner && <SaveBtn label="Save Terms Photo" saving={!!saving.termsPhoto} onClick={saveTermsPhoto} />}
        </Accordion>

        {/* 5 — Teks Terms & Conditions */}
        <Accordion title="Teks — Terms & Conditions" open={open === "termsText"} onToggle={() => toggle("termsText")}
          summary="Edit Order Rules, Payment, Delivery, Refund">
          {owner ? (
            <div className="space-y-5">
              {termsData.map((section, si) => (
                <div key={si} className="border border-[var(--asari-blush-light)] rounded-lg p-4 space-y-3">
                  <input value={section.title} onChange={(e) => updateSectionTitle(si, e.target.value)}
                    className="w-full font-display text-xl border-b border-[var(--asari-gold)]/30 pb-1 bg-transparent focus:outline-none focus:border-[var(--asari-gold)]"
                    placeholder="Section title" />
                  {section.items.map((item, ii) => (
                    <div key={ii} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-start">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[var(--asari-charcoal)]/50 mb-1">🇮🇩 Indonesia</label>
                        <textarea value={item.id} rows={3} onChange={(e) => updateItem(si, ii, "id", e.target.value)}
                          className="w-full border border-[var(--asari-blush-light)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--asari-gold)] resize-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[var(--asari-charcoal)]/50 mb-1">🇬🇧 English</label>
                        <textarea value={item.en} rows={3} onChange={(e) => updateItem(si, ii, "en", e.target.value)}
                          className="w-full border border-[var(--asari-blush-light)] rounded px-2 py-1.5 text-xs italic focus:outline-none focus:border-[var(--asari-gold)] resize-none" />
                      </div>
                      <button onClick={() => removeItem(si, ii)} title="Hapus poin"
                        className="mt-5 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded text-sm">✕</button>
                    </div>
                  ))}
                  <button onClick={() => addItem(si)}
                    className="text-xs text-[var(--asari-gold)] border border-[var(--asari-gold)]/40 px-3 py-1.5 rounded hover:bg-[var(--asari-champagne)]/30 transition-colors">
                    + Tambah poin
                  </button>
                </div>
              ))}
              <SaveBtn label="Save Terms & Conditions" saving={!!saving.termsText} onClick={saveTermsText} />
            </div>
          ) : (
            <p className="text-sm text-[var(--asari-charcoal)]/50 italic">Hanya Owner yang dapat mengedit teks ini.</p>
          )}
        </Accordion>

        {/* 6 — About Us foto */}
        <Accordion title="Foto — About Us" open={open === "aboutPhoto"} onToggle={() => toggle("aboutPhoto")}
          summary="Upload foto hero halaman About Us">
          <UploadZone label="Upload Foto About Us"
            hint="JPG, PNG, WEBP · Max 5 MB · Landscape, min 1200×500px"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" maxMB={5} aspect="aspect-[16/5]"
            currentUrl={settings.about_hero_image} onFile={setAboutFile} readOnly={!owner} />
          {owner && <SaveBtn label="Save About Us Photo" saving={!!saving.aboutPhoto} onClick={saveAboutPhoto} />}
        </Accordion>

        {/* 7 — About Us teks */}
        <Accordion title="Teks — About Us" open={open === "aboutText"} onToggle={() => toggle("aboutText")}
          summary="Edit deskripsi toko dan info kontak">
          {owner ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">
                  Paragraf 1 <span className="normal-case text-[var(--asari-charcoal)]/40">— deskripsi singkat toko</span>
                </label>
                <textarea value={aboutPara1} onChange={(e) => setAboutPara1(e.target.value)} rows={3}
                  placeholder="Asari Bouquet & Flower adalah florist rumahan..."
                  className="w-full border border-[var(--asari-blush-light)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)] resize-none" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[var(--asari-charcoal)] mb-1">
                  Paragraf 2 <span className="normal-case text-[var(--asari-charcoal)]/40">— info kontak</span>
                </label>
                <textarea value={aboutPara2} onChange={(e) => setAboutPara2(e.target.value)} rows={2}
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

      </div>

      <Toasts list={toasts} dismiss={(id) => setToasts((p) => p.filter((t) => t.id !== id))} />
    </div>
  );
}
