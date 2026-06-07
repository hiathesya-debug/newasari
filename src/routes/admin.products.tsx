import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PRODUCTS } from "@/lib/mockData";
import { formatRp } from "@/lib/format";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Management Products — Asari Admin" }] }),
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const [query, setQuery] = useState("");
  const items = PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl">Management Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-[var(--asari-gold)] text-white text-xs uppercase tracking-widest px-4 py-2 rounded inline-flex items-center gap-2 hover:bg-[var(--asari-gold-light)]"
        >
          <Plus className="h-4 w-4" /> Tambah Produk
        </Link>
      </div>
      <div className="h-px bg-[var(--asari-gold)]" />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari produk..."
        className="w-full md:w-80 border border-[var(--asari-blush-light)] rounded px-3 py-2 text-sm focus:outline-none focus:border-[var(--asari-gold)]"
      />

      <div className="bg-white rounded-lg border border-[var(--asari-blush-light)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--asari-champagne)]/40 text-left">
            <tr>
              <Th>Foto</Th><Th>Nama Produk</Th><Th>Kategori</Th><Th>Harga</Th>
              <Th>Stok</Th><Th>Status</Th><Th>Terjual</Th><Th>Aksi</Th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-[var(--asari-blush-light)] hover:bg-[var(--asari-peach)]/10">
                <td className="p-3">
                  <img src={p.image} alt={p.name} className="h-12 w-12 object-cover rounded" />
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-[var(--asari-champagne)]/50 rounded text-xs">{p.category}</span>
                </td>
                <td className="p-3">{formatRp(p.price)}</td>
                <td className={`p-3 ${p.stock <= 5 ? "text-red-600 font-medium" : ""}`}>{p.stock}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.inStock ? "Tersedia" : "Habis"}
                  </span>
                </td>
                <td className="p-3">{p.sold}</td>
                <td className="p-3 space-x-2 text-xs">
                  <Link to="/admin/products/$id/edit" params={{ id: p.id }} className="text-[var(--asari-gold)] hover:underline">Edit</Link>
                  <button className="text-[var(--asari-charcoal)] hover:underline">Duplikat</button>
                  <button className="text-red-600 hover:underline">Arsip</button>
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
  return <th className="p-3 text-xs uppercase tracking-wider font-medium">{children}</th>;
}
