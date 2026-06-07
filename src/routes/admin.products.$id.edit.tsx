import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/mockData";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/products/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Produk — Asari Admin" }] }),
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) throw notFound();
  return (
    <div className="space-y-6">
      <Link to="/admin/products" className="text-sm text-[var(--asari-gold)] inline-flex items-center gap-1">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>
      <h1 className="font-display text-4xl">Edit Produk</h1>
      <div className="h-px bg-[var(--asari-gold)]" />
      <ProductForm initial={product} onSubmit={() => navigate({ to: "/admin/products" })} />
    </div>
  );
}
