import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products")({
  component: () => (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <p className="text-gray-600">Browse our collection of products.</p>
      </div>
    </div>
  ),
});
