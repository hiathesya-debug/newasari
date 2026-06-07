import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { getOrder, DbOrder, DbOrderStatus } from "@/lib/ordersDb";
import { formatRp } from "@/lib/format";

export const Route = createFileRoute("/account/orders/$id")({
  head: () => ({ meta: [{ title: "Order Detail — Asari" }] }),
  component: AccountOrderDetail,
});

const FLOW: DbOrderStatus[] = ["Pending", "Dikonfirmasi", "Diproses", "Siap", "Selesai"];

function AccountOrderDetail() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then((o) => {
      setOrder(o);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="text-sm">Memuat...</p>;
  if (!order) throw notFound();

  const currentIdx = FLOW.indexOf(order.status);

  return (
    <div className="space-y-6">
      <Link to="/account/orders" className="text-sm text-[var(--asari-gold)] inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <h2 className="font-display text-3xl">{order.id}</h2>

      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
        <h3 className="font-display text-xl mb-4">Status Pesanan</h3>
        {order.status === "Dibatalkan" ? (
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
      </div>

      {order.customer_note && (
        <div className="bg-[var(--asari-champagne)]/30 border border-[var(--asari-gold)]/40 rounded-lg p-5">
          <h3 className="font-display text-lg mb-1">Catatan dari Asari</h3>
          <p className="text-sm whitespace-pre-wrap">{order.customer_note}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6">
          <h3 className="font-display text-xl mb-4">Detail Pesanan</h3>
          <Row label="Produk" value={`${order.product_name} × ${order.quantity}`} />
          <Row label="Paper Bag" value={`${order.paper_bag} × Rp 2.000`} />
          <Row label="Metode" value={order.method} />
          {order.address && <Row label="Alamat" value={order.address} />}
          <Row label="Tanggal" value={order.pickup_date} />
          <Row label="Jam" value={order.pickup_time} />
          <div className="h-px bg-[var(--asari-blush-light)] my-3" />
          <div className="flex justify-between font-display text-2xl">
            <span>Total</span><span className="text-[var(--asari-gold)]">{formatRp(order.total)}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6 h-fit">
          <h3 className="font-display text-xl mb-3">Butuh bantuan?</h3>
          <p className="text-sm mb-4 text-[var(--asari-charcoal)]/80">
            Hubungi kami via WhatsApp untuk pertanyaan tentang pesanan ini.
          </p>
          <a
            href={`https://wa.me/6281234567890?text=${encodeURIComponent(`Halo Asari, saya ingin bertanya tentang pesanan ${order.id}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded text-xs uppercase tracking-widest"
          >
            <MessageCircle className="h-4 w-4" /> Contact Us via WhatsApp
          </a>
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
