import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/products/new")({
  head: () => ({ meta: [{ title: "Tambah Produk — Asari Admin" }] }),
  component: NewProduct,
});

function NewProduct() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <Link
        to="/admin/products"
        className="text-sm text-[var(--asari-gold)] inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <h1 className="font-display text-4xl">Tambah Produk</h1>
      <div className="h-px bg-[var(--asari-gold)]" />
      <ProductForm onSubmit={() => navigate({ to: "/admin/products" })} />
    </div>
  );
}