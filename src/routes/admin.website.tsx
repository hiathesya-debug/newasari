import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/website")({
  component: () => (
    <div>
      <h1 className="text-3xl font-bold">Website Settings</h1>
      <div className="mt-6 space-y-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold">Site Information</h2>
          <p className="text-gray-600">Configure your website settings here.</p>
        </div>
      </div>
    </div>
  ),
});
