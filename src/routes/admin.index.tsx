import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-600 mt-2">Welcome to the admin panel.</p>
    </div>
  ),
});
