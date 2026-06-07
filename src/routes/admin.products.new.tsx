import { createFileRoute } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/new")({
  component: () => (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={() => window.history.back()} />
    </div>
  ),
});
