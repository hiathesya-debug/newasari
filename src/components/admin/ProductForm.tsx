import { useState } from "react";
import { CATEGORIES, Category, Product } from "@/lib/mockData";

export function ProductForm({
  initial,
  onSubmit,
}: {
  initial?: Product;
  onSubmit: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "Freshest Series");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [stock, setStock] = useState(initial?.stock ?? 0);
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<"Active" | "Draft">(initial?.status ?? "Active");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save — in real app, persist to DB
    onSubmit();
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg border border-[var(--asari-blush-light)] p-6 grid gap-4 md:grid-cols-2">
      <Field label="Nama Produk" className="md:col-span-2">
        <input value={name} onChange={(e) => setName(e.target.value)} required className="input" />
      </Field>
      <Field label="Kategori">
        <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className="input">
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          <option value="Custom Order">Custom Order</option>
        </select>
      </Field>
      <Field label="Status">
        <select value={status} onChange={(e) => setStatus(e.target.value as "Active" | "Draft")} className="input">
          <option>Active</option>
          <option>Draft</option>
        </select>
      </Field>
      <Field label="Harga (Rp)">
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="input" />
      </Field>
      <Field label="Stok">
        <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="input" />
      </Field>
      <Field label="Deskripsi" className="md:col-span-2">
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input" />
      </Field>
      <Field label="Foto Produk" className="md:col-span-2">
        <div className="border-2 border-dashed border-[var(--asari-blush-light)] rounded p-6 text-center text-sm text-[var(--asari-charcoal)]/60">
          Drag &amp; drop foto, atau klik untuk upload (mock — belum tersambung backend)
        </div>
      </Field>
      <Field label="Status Stok" className="md:col-span-2">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setInStock(true)}
            className={`flex-1 py-2 rounded text-sm ${inStock ? "bg-[var(--asari-gold)] text-white" : "border"}`}
          >
            Tersedia
          </button>
          <button
            type="button"
            onClick={() => setInStock(false)}
            className={`flex-1 py-2 rounded text-sm ${!inStock ? "bg-[var(--asari-coral)] text-white" : "border"}`}
          >
            Habis
          </button>
        </div>
      </Field>
      <div className="md:col-span-2 flex justify-end gap-2">
        <button type="submit" className="bg-[var(--asari-gold)] text-white px-6 py-2 rounded uppercase text-xs tracking-widest">
          Simpan
        </button>
      </div>

      <style>{`.input{width:100%;border:1px solid var(--asari-blush-light);border-radius:6px;padding:0.5rem 0.75rem;font-size:14px;background:white;outline:none}.input:focus{border-color:var(--asari-gold)}`}</style>
    </form>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-widest text-[var(--asari-charcoal)]">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
