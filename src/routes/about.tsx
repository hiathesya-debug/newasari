import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <div className="p-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-4">About Asari</h1>
      <p className="text-lg text-gray-600 mb-4">
        We are dedicated to providing the freshest and highest quality products to our customers.
      </p>
      <p className="text-lg text-gray-600">
        Our mission is to deliver exceptional service and premium products at competitive prices.
      </p>
    </div>
  ),
});
