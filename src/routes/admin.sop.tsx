import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/sop")({
  component: () => (
    <div>
      <h1 className="text-3xl font-bold">Standard Operating Procedures</h1>
      <div className="mt-6 space-y-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold">SOPs</h2>
          <p className="text-gray-600">Manage standard operating procedures here.</p>
        </div>
      </div>
    </div>
  ),
});
