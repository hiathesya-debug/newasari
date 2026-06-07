import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ORDERS, OrderStatus } from "@/lib/mockData";
import { formatRp } from "@/lib/format";
import { Plus, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/admin/orders/")({
  head: () => ({ meta: [{ title: "Orders — Asari Admin" }] }),
  component: OrdersPage,
});

const STATUSES: (OrderStatus | "Semua")[] = ["Semua", "Pending", "Dikonfirmasi", "Diproses", "Siap", "Selesai", "Dibatalkan"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-[var(--asari-gold)] text-white",
  Dikonfirmasi: "bg-blue-500 text-white",
  Diproses: "bg-orange-500 text-white",
  Siap: "bg-teal-500 text-white",
  Selesai: "bg-green-600 text-white",
  Dibatalkan: "bg-red-600 text-white",
};

function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "Semua">("Semua");
  const list = filter === "Semua" ? ORDERS : ORDERS.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl">Orders</h1>
        <Link
          to="/admin/orders/new"
          className="bg-[var(--asari-gold)] text-white text-xs uppercase tracking-widest px-4 py-2 rounded inline-flex items-center gap-2 hover:bg-[var(--asari-gold-light)]"
        >
          <Plus className="h-4 w-4" /> Tambah Pesanan
        </Link>
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-full ${
              filter === s
                ? "bg-[var(--asari-charcoal)] text-white"
                : "border border-[var(--asari-charcoal)]/30 hover:border-[var(--asari-gold)]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--asari-champagne)]/40 text-left">
            <tr>
              <Th>No. Pesanan</Th><Th>Nama</Th><Th>WA</Th><Th>Produk</Th><Th>Total</Th>
              <Th>Sumber</Th><Th>Pickup</Th><Th>Metode</Th><Th>Status</Th><Th>Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-t border-[var(--asari-blush-light)] hover:bg-[var(--asari-peach)]/10">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.customerName}</td>
                <td className="p-3">
                  <a href={`https://wa.me/${o.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-[var(--asari-gold)] hover:underline">
                    {o.whatsapp}
                  </a>
                </td>
                <td className="p-3">{o.productName} <span className="text-[var(--asari-charcoal)]/60">x{o.quantity}</span></td>
                <td className="p-3 whitespace-nowrap">{formatRp(o.total)}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${o.source === "WA" ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-700"}`}>
                    {o.source}
                  </span>
                </td>
                <td className="p-3 text-xs">{o.pickupDate}<br/><span className="text-[var(--asari-charcoal)]/60">{o.pickupTime}</span></td>
                <td className="p-3 text-xs">{o.method}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                </td>
                <td className="p-3">
                  <Link to="/admin/orders/$id" params={{ id: o.id }} className="text-[var(--asari-gold)] text-xs hover:underline inline-flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" /> Lihat
                  </Link>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={10} className="p-8 text-center text-[var(--asari-charcoal)]/60">Tidak ada pesanan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="p-3 text-xs uppercase tracking-wider font-medium whitespace-nowrap">{children}</th>;
}
