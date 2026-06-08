import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { OrderStatus } from "@/lib/mockData";
import { formatRp } from "@/lib/format";
import { getOrder, updateOrder, DbOrder, DbOrderStatus } from "@/lib/ordersDb";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders/$id")({
  head: () => ({ meta: [{ title: "Detail Pesanan — Asari Admin" }] }),
  component: OrderDetail,
});

const FLOW: OrderStatus[] = ["Pending", "Dikonfirmasi", "Diproses", "Siap", "Selesai"];

function OrderDetail() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<DbOrderStatus>("Pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const currentIdx = FLOW.indexOf(status as OrderStatus);

  useEffect(() => {
    setLoading(true);
    getOrder(id).then((o) => {
      if (o) {
        setOrder(o);
        setStatus(o.status);
        setNotes(o.notes ?? "");
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpdateStatus = async () => {
    setSaving(true);
    const result = await updateOrder(id, { status, notes: notes || null });
    setSaving(false);
    if (result.ok) {
      toast.success("Status pesanan diperbarui!");
    } else {
      toast.error("Gagal memperbarui: " + result.error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--asari-gold)] h-8 w-8" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Link to="/admin/orders" className="text-sm text-[var(--asari-gold)] inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <p className="text-center text-[var(--asari-charcoal)]/60 py-12">Pesanan tidak ditemukan.</p>
      </div>
    );
  }

  const buildNotif = () => {
    const lines = [
      `Halo Kak ${order.customer_name}! 🌸 Update pesanan Anda:`,
      `Produk: ${order.product_name} x${order.quantity}`,
      `Status: ${status}`,
    ];
    if (order.method === "Diantar") {
      lines.push(`Estimasi pengiriman: ${order.pickup_date} pukul ${order.pickup_time}`);
    } else {
      lines.push(`Pesanan siap diambil pada: ${order.pickup_date} pukul ${order.pickup_time}`);
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
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DbOrderStatus)}
              className="border rounded px-3 py-2 text-sm"
            >
              {[...FLOW, "Dibatalkan" as DbOrderStatus].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          {/* FIX: tambah onClick + disabled state saat saving */}
          <button
            onClick={handleUpdateStatus}
            disabled={saving}
            className="bg-[var(--asari-gold)] text-white text-xs uppercase tracking-widest px-4 py-2 rounded disabled:opacity-60 inline-flex items-center gap-2"
          >
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            Perbarui Status
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
          <h3 className="font-display text-xl mb-4">Pelanggan</h3>
          <Row label="Nama" value={order.customer_name} />
          <Row label="WhatsApp" value={
            <a href={`https://wa.me/${order.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-[var(--asari-gold)] underline">
              {order.whatsapp}
            </a>
          } />
          <Row label="Sumber" value={order.source} />
        </div>
        <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
          <h3 className="font-display text-xl mb-4">Pesanan</h3>
          <Row label="Produk" value={`${order.product_name} × ${order.quantity}`} />
          <Row label="Paper Bag" value={`${order.paper_bag} × Rp 2.000`} />
          <Row label="Metode" value={order.method} />
          {order.address && <Row label="Alamat" value={order.address} />}
          <Row label="Tanggal" value={order.pickup_date} />
          <Row label="Jam" value={order.pickup_time} />
          <div className="h-px bg-[var(--asari-blush-light)] my-3" />
          <div className="flex justify-between font-display text-2xl">
            <span>Total</span>
            <span className="text-[var(--asari-gold)]">{formatRp(order.total)}</span>
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
        <div className="mt-3 text-right">
          <button
            onClick={handleUpdateStatus}
            disabled={saving}
            className="bg-[var(--asari-gold)] text-white text-xs uppercase tracking-widest px-4 py-2 rounded disabled:opacity-60 inline-flex items-center gap-2"
          >
            {saving && <Loader2 className="h-3 w-3 animate-spin" />}
            Simpan Catatan
          </button>
        </div>
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