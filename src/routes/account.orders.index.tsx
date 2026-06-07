import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listMyOrders, DbOrder, DbOrderStatus } from "@/lib/ordersDb";
import { formatRp } from "@/lib/format";

export const Route = createFileRoute("/account/orders/")({
  head: () => ({ meta: [{ title: "My Orders — Asari" }] }),
  component: MyOrders,
});

const STATUS_COLORS: Record<DbOrderStatus, string> = {
  Pending: "bg-[var(--asari-gold)] text-white",
  Dikonfirmasi: "bg-blue-500 text-white",
  Diproses: "bg-orange-500 text-white",
  Siap: "bg-teal-500 text-white",
  Selesai: "bg-green-600 text-white",
  Dibatalkan: "bg-red-600 text-white",
};

function MyOrders() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyOrders().then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2 className="font-display text-2xl mb-4">Riwayat Pesanan</h2>
      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--asari-champagne)]/40 text-left">
            <tr>
              <Th>No. Pesanan</Th><Th>Produk</Th><Th>Total</Th><Th>Pickup</Th><Th>Metode</Th><Th>Status</Th><Th>{" "}</Th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="p-8 text-center text-[var(--asari-charcoal)]/60">Memuat...</td></tr>
            )}
            {!loading && orders.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-[var(--asari-charcoal)]/60">
                Belum ada pesanan tersimpan untuk nomor WhatsApp Anda.
              </td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-[var(--asari-blush-light)] hover:bg-[var(--asari-peach)]/10">
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3">{o.product_name} <span className="text-[var(--asari-charcoal)]/60">x{o.quantity}</span></td>
                <td className="p-3 whitespace-nowrap">{formatRp(o.total)}</td>
                <td className="p-3 text-xs">{o.pickup_date}<br/><span className="text-[var(--asari-charcoal)]/60">{o.pickup_time}</span></td>
                <td className="p-3 text-xs">{o.method}</td>
                <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                <td className="p-3">
                  <Link to="/account/orders/$id" params={{ id: o.id }} className="text-[var(--asari-gold)] text-xs hover:underline">
                    Detail →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="p-3 text-xs uppercase tracking-wider font-medium whitespace-nowrap">{children}</th>;
}
