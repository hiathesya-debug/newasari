import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MessageCircle, Printer } from "lucide-react";
import { ORDERS, OrderStatus } from "@/lib/mockData";
import { formatRp } from "@/lib/format";

export const Route = createFileRoute("/admin/orders/$id")({
  head: () => ({ meta: [{ title: "Detail Pesanan — Asari Admin" }] }),
  component: OrderDetail,
});

const FLOW: OrderStatus[] = ["Pending", "Dikonfirmasi", "Diproses", "Siap", "Selesai"];

function OrderDetail() {
  const { id } = Route.useParams();
  const order = ORDERS.find((o) => o.id === id);
  if (!order) throw notFound();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [notes, setNotes] = useState(order.notes ?? "");
  const currentIdx = FLOW.indexOf(status);

  const buildNotif = () => {
    const lines = [
      `Halo Kak ${order.customerName}! 🌸 Update pesanan Anda:`,
      `Produk: ${order.productName} x${order.quantity}`,
      `Status: ${status}`,
    ];
    if (order.method === "Diantar") {
      lines.push(`Estimasi pengiriman: ${order.pickupDate} pukul ${order.pickupTime}`);
    } else {
      lines.push(`Pesanan siap diambil pada: ${order.pickupDate} pukul ${order.pickupTime}`);
    }
    lines.push("Terima kasih sudah memesan di Asari Bouquet & Flower! 💐");
    return `https://wa.me/${order.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <Link to="/admin/orders" className="text-sm text-[var(--asari-gold)] inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <div className="flex flex-wrap justify-between items-end gap-3">
        <h1 className="font-display text-4xl">{order.id}</h1>
        <div className="flex gap-2">
          <a
            href={buildNotif()}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] text-white px-4 py-2 rounded text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" /> Kirim Notif WA
          </a>
          <button
            onClick={() => window.print()}
            className="border border-[var(--asari-gold)] text-[var(--asari-gold)] px-4 py-2 rounded text-xs uppercase tracking-widest inline-flex items-center gap-2"
          >
            <Printer className="h-4 w-4" /> Cetak
          </button>
        </div>
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      {/* Status Timeline */}
      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
        <h3 className="font-display text-xl mb-4">Status Pesanan</h3>
        {status === "Dibatalkan" ? (
          <span className="inline-block px-3 py-1.5 bg-red-600 text-white rounded text-xs">Dibatalkan</span>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {FLOW.map((s, i) => (
              <div key={s} className="flex items-center gap-2 shrink-0">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${i <= currentIdx ? "bg-[var(--asari-gold)] text-white" : "bg-[var(--asari-blush-light)] text-[var(--asari-charcoal)]/60"}`}>
                  {i + 1}
                </div>
                <span className={`text-xs ${i <= currentIdx ? "font-medium" : "text-[var(--asari-charcoal)]/60"}`}>{s}</span>
                {i < FLOW.length - 1 && <div className={`w-8 h-px ${i < currentIdx ? "bg-[var(--asari-gold)]" : "bg-[var(--asari-blush-light)]"}`} />}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-2 items-end">
          <label className="text-xs">
            <div className="uppercase tracking-widest mb-1">Update Status</div>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="border rounded px-3 py-2 text-sm">
              {[...FLOW, "Dibatalkan" as OrderStatus].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <button className="bg-[var(--asari-gold)] text-white text-xs uppercase tracking-widest px-4 py-2 rounded">
            Perbarui Status
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
          <h3 className="font-display text-xl mb-4">Pelanggan</h3>
          <Row label="Nama" value={order.customerName} />
          <Row label="WhatsApp" value={
            <a href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-[var(--asari-gold)] underline">
              {order.whatsapp}
            </a>
          } />
          <Row label="Sumber" value={order.source} />
        </div>
        <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
          <h3 className="font-display text-xl mb-4">Pesanan</h3>
          <Row label="Produk" value={`${order.productName} × ${order.quantity}`} />
          <Row label="Paper Bag" value={`${order.paperBag} × Rp 2.000`} />
          <Row label="Metode" value={order.method} />
          {order.address && <Row label="Alamat" value={order.address} />}
          <Row label="Tanggal" value={order.pickupDate} />
          <Row label="Jam" value={order.pickupTime} />
          <div className="h-px bg-[var(--asari-blush-light)] my-3" />
          <div className="flex justify-between font-display text-2xl">
            <span>Total</span><span className="text-[var(--asari-gold)]">{formatRp(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
        <h3 className="font-display text-xl mb-2">Catatan Internal</h3>
        <p className="text-xs text-[var(--asari-charcoal)]/60 mb-3">Tidak terlihat oleh pelanggan.</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full border border-[var(--asari-blush-light)] rounded p-3 text-sm focus:outline-none focus:border-[var(--asari-gold)]"
          placeholder="Tulis catatan internal di sini..."
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-[var(--asari-charcoal)]/70">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
