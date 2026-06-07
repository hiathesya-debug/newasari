import { createFileRoute } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/orders/$id")({
  component: () => {
    const { id } = useParams({ from: "/admin/orders/$id" });
    return (
      <div>
        <h1 className="text-3xl font-bold">Order #{id}</h1>
        <div className="mt-6 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-medium">{id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
