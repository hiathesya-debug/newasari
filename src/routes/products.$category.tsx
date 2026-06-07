import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/products/$category")({
  component: () => {
    const { category } = useParams({ from: "/products/$category" });
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Category: {category}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <p className="text-gray-600">Products in {category} category.</p>
        </div>
      </div>
    );
  },
});
