import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: () => {
    const { id } = useParams({ from: "/admin/products/$id/edit" });
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        <ProductForm onSubmit={() => window.history.back()} />
      </div>
    );
  },
});
