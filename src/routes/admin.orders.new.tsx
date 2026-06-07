import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { parseOrderMessage, ParsedOrder, ORDER_TEMPLATE } from "@/lib/parseOrder";
import { PRODUCTS } from "@/lib/mockData";
import { formatRp } from "@/lib/format";

export const Route = createFileRoute("/admin/orders/new")({
  head: () => ({ meta: [{ title: "Tambah Pesanan — Asari Admin" }] }),
  component: NewOrderPage,
});

type Form = ParsedOrder & { paymentMethod: string; status: string };

const EMPTY: Form = {
  productName: "", quantity: 1, request: "", cardMessage: "", paperBag: 0,
  customerName: "", whatsapp: "", pickupDate: "", pickupTime: "",
  method: "Ambil di Store", address: "",
  paymentMethod: "Transfer Bank", status: "Pending",
};

const PAPER_BAG_PRICE = 2000;

function NewOrderPage() {
  const navigate = useNavigate();
  const [raw, setRaw] = useState("");
  const [form, setForm] = useState<Form>(EMPTY);
  const [highlights, setHighlights] = useState<Set<string>>(new Set());
  const [parseStatus, setParseStatus] = useState<"idle" | "ok" | "fail">("idle");

  const handleParse = () => {
    const parsed = parseOrderMessage(raw);
    const filled: Form = {
      ...EMPTY,
      ...Object.fromEntries(Object.entries(parsed).filter(([, v]) => v !== null && v !== "")) as Partial<Form>,
      paymentMethod: form.paymentMethod,
      status: form.status,
    };
    setForm(filled);
    const populated = Object.entries(parsed).filter(([, v]) => v !== null).map(([k]) => k);
    if (populated.length === 0) {
      setParseStatus("fail");
      setHighlights(new Set());
    } else {
      setParseStatus("ok");
      setHighlights(new Set(populated));
      setTimeout(() => setHighlights(new Set()), 1800);
    }
  };

  const product = PRODUCTS.find(
    (p) => p.name.toLowerCase() === (form.productName ?? "").toLowerCase(),
  );
  const productNotFound = !!form.productName && !product;
  const total = (product ? product.price : 0) * (form.quantity ?? 0) + (form.paperBag ?? 0) * PAPER_BAG_PRICE;

  const update = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const hl = (k: string) => highlights.has(k) ? "ring-2 ring-green-400" : "";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productNotFound) return;
    // Mock save
    navigate({ to: "/admin/orders" });
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <Link to="/admin/orders" className="text-sm text-[var(--asari-gold)] inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <h1 className="font-display text-4xl">Tambah Pesanan</h1>
      <div className="h-px bg-[var(--asari-gold)]" />

      {/* Paste WA message */}
      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
        <h2 className="font-display text-xl mb-1">Tempel Pesan WhatsApp</h2>
        <p className="text-xs text-[var(--asari-coral)] mb-3">Sistem akan mengisi form otomatis dari pesan pelanggan.</p>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={8}
          placeholder="Tempel isi pesan pesanan dari WhatsApp di sini..."
          className="w-full border border-[var(--asari-blush-light)] rounded p-3 text-sm font-mono focus:outline-none focus:border-[var(--asari-gold)]"
        />
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <button
            type="button"
            onClick={handleParse}
            className="bg-[var(--asari-gold)] text-white px-5 py-2 rounded uppercase text-xs tracking-widest inline-flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" /> Proses Pesan →
          </button>
          <button
            type="button"
            onClick={() => setRaw(ORDER_TEMPLATE.replace("{PRODUCT}", ""))}
            className="text-xs text-[var(--asari-charcoal)]/70 underline"
          >
            Tempel contoh template
          </button>
          {parseStatus === "ok" && <span className="text-xs text-green-700">✓ Form berhasil diisi.</span>}
          {parseStatus === "fail" && (
            <span className="text-xs text-amber-700">
              Format pesan tidak dikenali. Silakan isi form secara manual.
            </span>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-4 bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
          <h3 className="font-display text-xl">Detail Pesanan</h3>

          <Field label="Nama Produk">
            <select
              value={form.productName ?? ""}
              onChange={(e) => update("productName", e.target.value)}
              className={`input ${hl("productName")} ${productNotFound ? "border-amber-500" : ""}`}
            >
              <option value="">— Pilih Produk —</option>
              {PRODUCTS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              {productNotFound && <option value={form.productName ?? ""}>{form.productName} (tidak ditemukan)</option>}
            </select>
            {productNotFound && <p className="text-xs text-amber-600 mt-1">Produk tidak ditemukan di database. Pilih ulang.</p>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Jumlah">
              <input type="number" min={1} value={form.quantity ?? 1} onChange={(e) => update("quantity", Number(e.target.value))} className={`input ${hl("quantity")}`} />
            </Field>
            <Field label="Jumlah Paper Bag">
              <input type="number" min={0} value={form.paperBag ?? 0} onChange={(e) => update("paperBag", Number(e.target.value))} className={`input ${hl("paperBag")}`} />
            </Field>
          </div>

          <Field label="Request / Catatan Khusus">
            <input value={form.request ?? ""} onChange={(e) => update("request", e.target.value)} className={`input ${hl("request")}`} />
          </Field>
          <Field label="Isi Kartu Ucapan">
            <input value={form.cardMessage ?? ""} onChange={(e) => update("cardMessage", e.target.value)} placeholder="Tidak ada" className={`input ${hl("cardMessage")}`} />
          </Field>

          <h3 className="font-display text-xl pt-4">Informasi Pemesan</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama Pemesan">
              <input value={form.customerName ?? ""} onChange={(e) => update("customerName", e.target.value)} className={`input ${hl("customerName")}`} required />
            </Field>
            <Field label="No. WhatsApp">
              <input value={form.whatsapp ?? ""} onChange={(e) => update("whatsapp", e.target.value)} placeholder="+628..." className={`input ${hl("whatsapp")}`} required />
            </Field>
          </div>

          <h3 className="font-display text-xl pt-4">Jadwal &amp; Pengiriman</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tanggal Pengambilan">
              <input value={form.pickupDate ?? ""} onChange={(e) => update("pickupDate", e.target.value)} placeholder="Sabtu, 30 Mei 2026" className={`input ${hl("pickupDate")}`} />
            </Field>
            <Field label="Jam Pengambilan">
              <input value={form.pickupTime ?? ""} onChange={(e) => update("pickupTime", e.target.value)} placeholder="12:30" className={`input ${hl("pickupTime")}`} />
            </Field>
          </div>
          <Field label="Metode Penyerahan">
            <div className="flex gap-3">
              {(["Ambil di Store", "Diantar"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => update("method", m)}
                  className={`flex-1 py-2 rounded text-sm ${form.method === m ? "bg-[var(--asari-gold)] text-white" : "border"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>
          {form.method === "Diantar" && (
            <Field label="Alamat Pengiriman">
              <textarea value={form.address ?? ""} onChange={(e) => update("address", e.target.value)} rows={2} className={`input ${hl("address")}`} required />
            </Field>
          )}

          <h3 className="font-display text-xl pt-4">Pembayaran &amp; Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Metode Pembayaran">
              <select value={form.paymentMethod} onChange={(e) => update("paymentMethod", e.target.value)} className="input">
                <option>Transfer Bank</option><option>QRIS</option><option>COD</option>
              </select>
            </Field>
            <Field label="Status Awal">
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="input">
                <option>Pending</option><option>Dikonfirmasi</option>
              </select>
            </Field>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6 h-fit sticky top-4">
          <h3 className="font-display text-xl mb-4">Ringkasan</h3>
          <div className="space-y-2 text-sm">
            <Row label="Produk" value={form.productName || "—"} />
            <Row label="Harga satuan" value={product ? formatRp(product.price) : "—"} />
            <Row label="Jumlah" value={String(form.quantity ?? 0)} />
            <Row label="Subtotal" value={product ? formatRp(product.price * (form.quantity ?? 0)) : "—"} />
            <Row label={`Paper bag (×${form.paperBag ?? 0})`} value={formatRp((form.paperBag ?? 0) * PAPER_BAG_PRICE)} />
            <div className="h-px bg-[var(--asari-blush-light)] my-2" />
            <div className="flex justify-between font-display text-xl">
              <span>Total</span><span className="text-[var(--asari-gold)]">{formatRp(total)}</span>
            </div>
          </div>
          <button type="submit" className="mt-6 w-full bg-[var(--asari-gold)] text-white py-3 rounded uppercase text-xs tracking-widest hover:bg-[var(--asari-gold-light)]">
            Simpan Pesanan
          </button>
        </div>
      </form>

      <style>{`.input{width:100%;border:1px solid var(--asari-blush-light);border-radius:6px;padding:0.5rem 0.75rem;font-size:14px;background:white;outline:none;transition:all 0.2s}.input:focus{border-color:var(--asari-gold)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-[var(--asari-charcoal)]/70">{label}</span><span className="font-medium text-right">{value}</span></div>;
}
