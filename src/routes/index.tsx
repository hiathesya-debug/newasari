import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Asari</h1>
      <p className="text-lg text-gray-600">
        Discover our fresh products and premium collections.
      </p>
    </div>
  ),
});
